import React, { useEffect, useState } from 'react'
import { SendInput } from './SendInput'
import { Messages } from './Messages'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '../redux/user/userSlice'

export const MessageContainer = () => {
  const {selectedUser,currentUser,onlineUsers}=useSelector(store=>store.user);
  const isOnline= onlineUsers.includes(selectedUser._id);
  const dispatch= useDispatch();
  const authUser= currentUser;
 
  return (
    <>
      {
        selectedUser!==null?(  <div className='md:min-w-[450px] flex flex-col'>
      <div className='flex gap-2  items-center bg-zinc-800 text-white px-4 py-2 mb-2' >
        <div className={`avatar  `}>
        
        {isOnline&& <div aria-label="success" className="status status-success"></div>
        }
          <div className='w-12 rounded-full'>
            <img src={selectedUser?.avatar}/>
          </div>
        </div>
        <div className='flex flex-col flex-1'>
        <div className='flex justify-between gap-2'>
          <p>{selectedUser?.userName}</p>
        </div>

        </div>
        {isOnline?<p>online</p>:<p>offline</p>}
      </div>
      <Messages/>
      <SendInput/>
    </div>):
   ( <div className='md:min-w-[450px] flex flex-col justify-center items-center'>
           <h1 className='text-4xl text-white'> Hi, {authUser?.userName}</h1>
   <h1 className='text-2xl text-white' >Lets start Coversation</h1>
    </div>)
      }
    </>
  
  )
}
