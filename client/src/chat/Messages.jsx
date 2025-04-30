import React from 'react'
import { Message } from './Message'
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from 'react-redux';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';
import { useEffect } from 'react';



export const Messages = () => {
  console.log("12"); 
 

    useGetMessages();
  
  useGetRealTimeMessage();
  const {messages} = useSelector(store=>store.message)
  if(!messages){
    return;
  }
  return (
    <div className=' px-4 flex-1 overflow-auto'>
      {
      messages.length>0 &&    messages?.map((message)=>{
          return(
            <Message key={message._id} message={message}/>
          )
        })
      }
    {/* <Message/> */}
    </div>
  )
}
