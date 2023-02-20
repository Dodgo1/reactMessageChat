
import ChatDisplay from "../components/chatDisplay.jsx";
import ChatInput from "../components/chatInput.jsx";
import styles from '../css/chatPage.module.css'


export default function ChatPage(){

    function getInitialState() {
        return {
            styles: {
                top: 0,
                left: 0
            }
        };
    }

    function componentDidMount() {
        this.setState({
            styles: {
                // Note: computeTopWith and computeLeftWith are placeholders. You
                // need to provide their implementation.
                top: computeTopWith(this.refs.child),
                left: computeLeftWith(this.refs.child)
            }
        })
    }

    return(
        <div className={styles.chatWrapper}>
            <ChatDisplay/>
            <ChatInput/>
        </div>
    )
}