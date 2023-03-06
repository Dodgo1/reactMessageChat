import hashlib
import time
from os import environ

import motor.motor_asyncio as motor
import pymongo
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter

# TODO: move to motor completely
from schemes import *

load_dotenv()

client = pymongo.MongoClient(environ.get("MONGODB_URI"))
db = client.message_app
chats_coll: pymongo.collection.Collection = db.chats


@strawberry.type
class Query:
    @strawberry.field
    def get_messages(self, chat_hash: str) -> typing.List[Message]:
        messages = chats_coll.find_one({"hash": chat_hash})["messages"]
        return [Message(**message) for message in messages]

    @strawberry.field
    def get_chat(self, chat_hash: str) -> Chat:
        chat_in_db = chats_coll.find_one({"hash": chat_hash})
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
        chats_coll.insert_one(new_chat.__dict__)
        return new_chat

    @strawberry.field
    def create_message(self, chat_hash: str, message: str, author: str) -> Message:
        new_msg = Message(
            author=author,
            message=message,
            time=time.time()
        )
        chats_coll.update_one({"hash": chat_hash}, {"$push": {"messages": new_msg.__dict__}})
        return new_msg


@strawberry.type
class Subscription:
    @strawberry.subscription
    async def subscribe_messages(self, chat_hash: str) -> typing.AsyncGenerator[Message, None]:
        client = motor.AsyncIOMotorClient(environ.get("MONGODB_URI"))
        coll = client.message_app.chats
        async with coll.watch(

        ) as stream:
            async for change in stream:
                if change['operationType'] != 'update':
                    continue
                change_document = change['updateDescription']['updatedFields']
                new_message = next(iter(change_document.values()))
                # get first field of the document --> `messages.<int>`
                yield Message(**new_message)


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
