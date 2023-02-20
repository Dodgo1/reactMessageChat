import styles from '/src/css/chatPage.module.css'
import { useState, useId } from "react";
import {gql, useMutation } from "@apollo/client";
import {useParams} from "react-router-dom";

const CREATE_MESSAGE = gql`
    mutation($chatHash:String! $message:String! $author:String!){
      createMessage(chatHash:$chatHash message:$message author:$author){
        author
        message
        time
      }
    }
`

export default function ChatInput(){
    const id = useId()
    const chatHash=useParams().chatHash
    const [addMessage, {data,loading,error}] = useMutation(CREATE_MESSAGE)
    const [input,setInput] = useState("")


// TODO: check mutation error and loading


    return(
        <div className={"message"}>
            <form onSubmit={ event => {
                event.preventDefault()
                addMessage({
                    variables:{
                        chatHash:chatHash,
                            message:input,
                            author:"TODO"}
                })

            }}>
                <input id={id} value={input} onInput={e => setInput(e.target.value)} className={"chat-input"}/>
                <button className={styles.chatInputButton} type={"submit"}>{"Send"}</button>
            </form>

        </div>
    )
}