import {useParams} from "react-router-dom";
import {gql, useQuery } from "@apollo/client";
import {useEffect, useState} from "react";
import styles from '../css/chatPage.module.css'

//TODO: implement infinite scroll https://www.npmjs.com/package/react-infinite-scroll-component

const GET_CHAT =gql`
    query($chatHash: String!){
      getChat(chatHash:$chatHash){
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

const SUBSCRIBE_MESSAGES = gql`
    subscription($chatHash: String!){
      subscribeMessages(chatHash:$chatHash){
        author
        message
        time
      }
}
`

function is_day_old(date){
    const dayAgo = new Date().getTime() - (24 * 60 * 60 * 1000)
    return date < dayAgo
}

function format_date(date){
    if (is_day_old(date)){
        return date.toLocaleString('en-US')
    }
    //TODO: add 'yesterday' etc.
    return  date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
}

export default function ChatDisplay(){
    const chat_hash = useParams().chatHash
    const {loading,error,data,subscribeToMore} = useQuery(GET_CHAT,{variables:{chatHash:chat_hash}})




    function renderMessages(data){
        let elems = []
        let key = 0
        data.forEach(message => {
            let messageTime = new Date(message.time * 1000)
            elems.push(
                <div key={key}>
                    <p className={styles.author}>{message.author}</p>
                    <p>{message.message}</p>
                    <p className={styles.time}>{format_date(messageTime)}</p>
                </div> //empty array in toLocaleTimeString sets the locale to default
            )
            key ++
        })
        return elems
    }

    useEffect(() => {
        subscribeToMore({
            document:SUBSCRIBE_MESSAGES,
            variables:{chatHash:chat_hash},
            updateQuery: ( prev , {subscriptionData}) => {
                if (!subscriptionData.data) return prev;
                const newMessage = subscriptionData.data.subscribeMessages

                return Object.assign({},prev,{
                    getChat:{
                        __typename:prev.getChat.__typename,
                        hash:prev.getChat.hash,
                        chatName:prev.getChat.chatName,
                        author:prev.getChat.author,
                        messages:[newMessage,...prev.getChat.messages]}
                })
            }
        })
    },[])


    if (loading) return "loading..."

    if (error) return "Error : " + error

    return(
        <div className={"chat-title"}>
            <h1 className={"chat-name"}>{data.getChat.chatName }</h1>
            <div className={styles.chatDisplay}>
                {renderMessages(data.getChat.messages)}
            </div>
        </div>
    )

}