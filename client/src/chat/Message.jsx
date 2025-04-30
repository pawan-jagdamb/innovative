import React, { useEffect, useRef } from 'react'
import {useSelector} from "react-redux";
export const Message = ({message}) => {
    const scroll = useRef();
    const {selectedUser,currentUser} = useSelector(store=>store.user);
    const authUser= currentUser;

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"});
    },[message]);
    // console.log("asendir",message?.senderId )
    // console.log("authUser",authUser?._id )
    
    return (
        <div ref={scroll} className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={message?.senderId === authUser?._id ? authUser?.avatar  : selectedUser?.avatar } />
                </div>
            </div>
            <div className="chat-header">
                <time className="text-xs opacity-50 text-white">
                {message?.createdAt 
                ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                : ''}
                </time>
            </div>
            <div className={`chat-bubble rounded-full ${message?.senderId !== authUser?._id ? 'bg-gray-200 text-black' : ''} `}>{message?.message}</div>
        </div>
    )
}
