import React from 'react'
import styles from './styles.module.css'
import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { ToggleContext } from '../../context/ToggleContext';
import { db } from "../../Firebase/firebase";
const Chats = () => {
  const [chats, setChats] = useState([]);
  const {dispatch1}=useContext(ToggleContext)
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (document) => {
        setChats(document.data());
        console.log(document.data())
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();

  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className={styles.chats} >
       {(chats)?Object.entries(chats).sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div className={styles.userChat} key={chat[0]}
        onClick={() =>{ handleSelect(chat[1].userInfo); dispatch1({type:"Nav_Toggle",payload:false})}} >
        <img className={styles.userImage} src={chat[1].userInfo.photoURL} alt="Nan" />
        {console.log(chat[1].userInfo.photoURL)}
        <div  className={styles.userChatInfo}>
          <span className={styles.username}>{chat[1].userInfo.displayName}</span>
          <p className={styles.lastmssg}>{chat[1].lastMessage?.text}</p>
        </div>
      </div>
        )):<></>}
    </div>
  )
}

export default Chats