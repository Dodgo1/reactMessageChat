import strawberry
import typing


@strawberry.type
class Message:
    def __init__(self, **entries):
        self.__dict__.update(entries)

    author: str
    message: str
    time: str


@strawberry.type
class User:
    username: str
    password: str
    creation_time: str
    key: str


@strawberry.type
class Chat:
    # TODO: resolve serialization

    chat_name: str
    author: str
    hash: str
    messages: typing.List[Message]
