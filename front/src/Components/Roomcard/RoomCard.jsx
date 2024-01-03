import React from 'react'
import styles from './room_card.module.css'
import { useNavigate } from 'react-router'



const RoomCard = ({room}) => {
  const navigate=useNavigate();
  return (
    <div
    onClick={()=>{navigate(`/room/${room.id}`)}}
     className={styles.card}>

    <h3 className={styles.topic}>
    {room.topic}
    </h3>

    <div className={`${styles.speakers} ${room.speakers.length===1?styles.singleSpeaker:''}`}>
        <div className={styles.avatars}>
        {room.speakers.map((speaker)=>(
            <img src={speaker.avatar} alt="speaker-avatar"/>
        ))}
        </div>
        <div className={styles.names}>
        {room.speakers.map((speaker)=>(
            <div className={styles.nameWrapper}>
                <span>{speaker.name}</span>
                <img src="/images/chat_bubble.png"/>
            </div>
        ))}
            </div>
    </div>

    <div className={styles.peopleCount}>
       <span>{room.totalPeople}</span> 
       <img src="/images/people.png"/>
    </div>


    </div>
  )
}

export default RoomCard