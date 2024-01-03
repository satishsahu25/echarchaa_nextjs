import React, { useState } from "react";
import styles from "./addroomModal.module.css";
import TextInput from "../Shared/TextInput/TextInput";
import { createRoom } from "../../Http";
import {useNavigate} from 'react-router-dom'

const AddRoomModal = ({ onCloseModal }) => {
  const [roomtype, setroomtype] = useState("open");
  const [topic, settopic] = useState("");

  const navigate=useNavigate();

 async function createRoomBtn(){
    //server call
 
    try{
      if(!topic) return;
      const{ data}=await createRoom({topic,roomtype});
      navigate(`/room/${data.id}`);
    }catch(err){
      console.log(err);
    }

  }

  return (
    <div className={styles.modalMask}>
      <div className={styles.modalBody}>
        <button onClick={onCloseModal} className={styles.closeButton}>
          <img src="/images/close.png" />
        </button>

        <div className={styles.modalHeader}>
          <h3 className={styles.heading}>Enter the topic to be discussed</h3>
          <TextInput
            value={topic}
            onChange={(e) => settopic(e.target.value)}
            fullWidth="true"
          />
          <h2 className={styles.subheading}>Room Types</h2>
          <div className={styles.roomTypes}>
            <div
              onClick={() => setroomtype("open")}
              className={`${styles.typeBox} ${
                roomtype === "open" ? styles.active : ""
              }`}
            >
              <img src="/images/globe.png" />
              <span>Open</span>
            </div>
            <div
              onClick={() => setroomtype("social")}
              className={`${styles.typeBox} ${
                roomtype === "social" ? styles.active : ""
              }`}
            >
              <img src="/images/social.png" />
              <span>Social</span>
            </div>
            <div
              onClick={() => setroomtype("private")}
              className={`${styles.typeBox} ${
                roomtype === "private" ? styles.active : ""
              }`}
            >
              <img src="/images/private.png" />
              <span>Private</span>
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <h2>Start a room, open to everyone</h2>
          <button 
          onClick={createRoomBtn}
          className={styles.footerBtn}>
            <img src="/images/celebrate.png" alt="celebrations" />
            <span>Let's go</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
