import React, {  useState } from 'react'
import { IoSend } from "react-icons/io5";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/user/messageSlice';

export const SendInput = () => {
  const dispatch= useDispatch();
  const [message,setMessage]=useState("");
  const {selectedUser,currentUser}=useSelector(store=>store.user);
  const {messages}= useSelector(store=>store.message)
  const token= currentUser.token;
  // console.log("token,in current user",token)
  const onSubmitHandler=async(e)=>{
    e.preventDefault();
    try {
      const res= await axios.post(`http://localhost:5000/api/v1/message/send/${selectedUser?._id}`,{message:message,
        token:token
      },
      {withCredentials:true}
      )
      console.log(res);
      dispatch(setMessages([...messages,res?.data?.newMessage]))
      setMessage("")
    } catch (error) {
      console.log(error);
      
    }

    // alert(message);
  }
  return (
    <form onSubmit={onSubmitHandler} className='px-4 my-3'>
        <div className='w-full relative'>
            <input type='text'
                placeholder='
                Send a Messaage'
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                className='border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white'
                />
                     <button  type="submit" className='absolute flex inset-y-0 end-0 items-center pr-4'>
                    <IoSend />
                </button>
        </div>
    </form>
  )
}
