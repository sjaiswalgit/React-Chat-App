import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import styles from './styles.module.css'
import { db } from "../../Firebase/firebase";
import Message from "../message/Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [userConnected,setuserConnect]=useState("null")
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
      console.log(messages)
    });
    setuserConnect(data.chatId)

    return () => {
      unSub();
    };
  }, [data.chatId]);
  return (
    <div className={(userConnected!=="null")?styles.messages:styles.nomessages}>
       {(userConnected==="null")?<div style={{fontWeight:"bold"}}>Select a User from Sidebar to Start Conversation</div>:
       (messages.length===0)?<>Type a message</>:
       messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  )
}

export default Messages