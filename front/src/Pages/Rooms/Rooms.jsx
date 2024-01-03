import React, { useEffect, useState } from 'react'
import styles from './rooms.module.css'
import RoomCard from '../../Components/Roomcard/RoomCard'
import AddRoomModal from '../../Components/AddRoomModal/AddRoomModal'
import { getAllRooms } from '../../Http'


const Rooms = () => {

  const [showModal, setshowModal]=useState(false);

  const [rooms,setrooms]=useState([]);

  useEffect(()=>{

    const fetchrooms=async()=>{
          const {data}=await getAllRooms();
          console.log(data);
          setrooms(data);
    }
    fetchrooms();
  },[]);



  function openNewRoomModal(){
    setshowModal(true);
  }


  return (
    <>
      <div className='container'>
        <div className={styles.roomsHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>All Voice rooms</span>
            <div className={styles.searchBox}>
              <img src="/images/search.png"/>
              <input type="text" className={styles.searchInput}/>
            </div>
          </div>
          <div className={styles.right}>
            <button onClick={openNewRoomModal} className={styles.startroomBtn}>
                <img src="/images/add-room.png"/>
                <span> Start a room</span>
            </button>
          </div>
        </div>


    <div className={styles.roomlist}>
    
      {rooms && rooms.map((room)=>(
        <RoomCard key={room.id} room={room}/>
      ))}
    </div>

      </div>

     { showModal&& <AddRoomModal onCloseModal={()=>setshowModal(false)}/>}
    </>
  )
}

export default Rooms