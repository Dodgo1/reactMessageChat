import styles from './chatPage.module.css'


export default function ChatInput(){








    return(
        <div>
            <form>
                <input></input>
                <button className={styles.chatInputButton} type={"submit"}>{"Send"}</button>
            </form>

        </div>
    )
}