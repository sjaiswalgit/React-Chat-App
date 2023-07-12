import React from 'react'
import styles from './styles.module.css'
import { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import { AuthContext } from "../../context/AuthContext";

const SearchBar = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    console.log("selected")
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        const tes = await getDoc(doc(db, "userChats", currentUser.uid));
        const nes = await getDoc(doc(db, "userChats", user.uid));
        if (!tes.exists()) {
          //create a chat in chats collection
          await setDoc(doc(db, "userChats", currentUser.uid), { });}
          
        if (!nes.exists()) {
          //create a chat in chats collection
          await setDoc(doc(db, "userChats", user.uid), { });}

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
         [ combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) { console.log(err)}

    setUser(null);
    setUsername("")
  };
 
  return (
    <div className={styles.search}>
      <div className={styles.searchForm} >
        <input type="text" className={styles.searchInp} placeholder='Find a user' onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}/>
      </div>
      {err && <span>User not found!</span>}
      {user && (
      <div className={styles.userChat} onClick={handleSelect}>
        <img className={styles.userImage} src={user.photoURL} alt="Nan" />
        <div  className={styles.userChatInfo}>
          <span>{user.displayName}</span>
        </div>
      </div>
       )}
      </div>
  )
}

export default SearchBar