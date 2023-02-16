
import ChatDisplay from "../components/chatDisplay.jsx";
import ChatInput from "../components/chatInput.jsx";
import styles from '../components/chatPage.module.css'


export default function ChatPage(){

    return(
        <div className={styles.chatWrapper}>
            <ChatDisplay/>
            <ChatInput/>
        </div>
    )
}