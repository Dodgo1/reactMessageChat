import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import {useState} from "react";

const CREATE_CHAT_MUTATION = gql`
    mutation ($chatName :String! $author:String!){
      createChat(chatName:$chatName author:$author){
        chatName
        author
        hash
        messages{
          author
          message
          time
        }
      }
    }
`

export default function MainPage(){

    const [ createChat ,{data, loading, error}] = useMutation(CREATE_CHAT_MUTATION)

    function handleSubmit(event){
        event.preventDefault()
        createChat({
            variables: {
                chatName:event.target["chatNameInput"].value,
                author:event.target["chatAuthorInput"].value,
            }
        }
        )

    }

    if (loading) return "Loading..."

    if (error) return  "Error :((  " + error

    if (data) {
        const link = "http://" + window.location.host + "/chat/" + data.createChat.hash
        return <a href={link}>{link}</a>
    }


    return <nav>
        <div>
            <h2>CREATE CHAT</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder={`Name of chat`}
                    id={"chatNameInput"}
                />
                <input
                    placeholder={`Name of Author`}
                    id={"chatAuthorInput"}
                />
                <button>create</button>
            </form>
        </div>
    </nav>
}