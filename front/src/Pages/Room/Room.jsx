import React, { useState } from 'react'
import { useWebRTC } from '../../Components/hooks/useWebRTC'
import {useNavigate, useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'
import styles from './room.module.css'

const Room = () => {

  const {id:roomId}=useParams();
  const user=useSelector((state)=>state.auth.user);  
  const {clients,provideRef}=useWebRTC(roomId,user);


  const navigate=useNavigate();
  const handleManualleave=()=>{
    navigate('/rooms');
  }









  return (
    <div>
    <div className='container'>
      <button 
     onClick={handleManualleave}
      className={styles.goBack}>
        <img src="/images/arrow-left.png"/>
        <span>All voice rooms</span>
      </button>
    </div>
    <div className={styles.clientsWrap}>
    <div className={styles.header}>
    <h1 className={styles.topic}> Nodejs is awesome</h1>
    <div className={styles.actions}>
      <button>
        <img src="/images/palm.png" />
      </button> 
      <button>
        <img src="/images/win.png" />
        <span>leave quietly</span>
      </button>
    </div>
    </div>
    <div className={styles.clientList}>

    {
        clients&&clients.map((client) =>(
          <div 
          className={styles.userHead}
          key={client.id}>
            <audio 
            ref={(instance)=>provideRef(instance,client.id)}
            controls autoPlay></audio>
            <img src={client.avatar} alt="avatar" className={styles.userAvatar}/>
            <h4>{client.name}</h4>
          </div>
        ))
      }
    </div>
 
   
    </div>
   
    </div>
  )
}

export default Room