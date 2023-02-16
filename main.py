import asyncio
import hashlib
import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from tinydb import TinyDB
from tinydb.queries import where

from db_utils import add_message
from schemes import *

# TODO: change to different db/ cloud?
db = TinyDB('db.json', sort_keys=True, indent=4)


@strawberry.type
class Query:
    @strawberry.field
    def get_messages(self, chat_hash: str) -> typing.List[Message]:
        message_list = db.search(where("hash") == chat_hash)[0]["messages"]
        return [Message(**message) for message in message_list]

    @strawberry.field
    def get_chat(self, chat_hash: str) -> Chat:
        chat_in_db = db.search(where("hash") == chat_hash)[0]
        return Chat(
            chat_name=chat_in_db['chat_name'],
            author=chat_in_db['author'],
            hash=chat_in_db['hash'],
            messages=[Message(**message) for message in chat_in_db['messages']]
        )


@strawberry.type
class Mutation:
    @strawberry.field
    def create_chat(self, chat_name: str, author: str) -> Chat:
        new_chat = Chat(
            chat_name=chat_name,
            author=author,
            hash=hashlib.md5(bytes(chat_name + author + str(time.time()), "utf-8")).hexdigest(),
            messages=[],
        )
        db.insert(new_chat.__dict__)
        return new_chat

    @strawberry.field
    def create_message(self, chat_hash: str, message: str, author: str) -> Message:
        new_msg = Message(
            author=author,
            message=message,
            time=time.time()
        )
        db.update(add_message("messages", new_msg.__dict__), where('hash') == chat_hash)
        return new_msg

    # @strawberry.field
    # def create_user(self, name: str, password: str) -> User:
    #     user_table = db.table("users")
    #     creation_time = time.time()
    #     new_user = User(
    #         username=name,
    #         password=password,  # TODO: hash pswd
    #         creation_time=creation_time,
    #         key=hashlib.md5(bytes(name + password + str(creation_time), "utf-8")).hexdigest()
    #     )
    #     user_table.insert(new_user.__dict__)
    #     return new_user


@strawberry.type
class Subscription:
    @strawberry.subscription
    async def subscribe_messages(self, chat_hash: str) -> typing.AsyncGenerator[Message, None]:
        base_time = time.time()
        while True:
            # todo: change DB or store in tables not in a list for less computation and simplicity
            new_chat = db.get(where("messages").any(where("time") > base_time))
            if new_chat:
                new_message = next(filter(lambda message: message["time"] > base_time, new_chat["messages"]))
                base_time = time.time()
                yield Message(**new_message)
            await asyncio.sleep(1)


schema = strawberry.Schema(Query, Mutation, Subscription)

graphql_app = GraphQLRouter(schema)

app = FastAPI()

origins = ["*"]  # set allowed origins here
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*", "OPTIONS"],
    allow_headers=["*"],
)
app.include_router(graphql_app, prefix="/graphql")
