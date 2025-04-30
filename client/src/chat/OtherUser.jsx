import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/user/userSlice';

export const OtherUser = ({user}) => {
    // const user= props.user;
    const dispatch= useDispatch();
    // console.log("user",user)
    const {selectedUser,onlineUsers}=useSelector(store=>store.user)
    // const selectedUser=currentUser.user._id
    const isOnline= onlineUsers.includes(user._id);
    const selectedUserHandler=(user)=>{
        console.log("selected User",user);
        dispatch(setSelectedUser(user))

    }
  return (
    <>
    <div onClick={() => selectedUserHandler(user)} className={` ${selectedUser?._id === user?._id ? 'bg-zinc-200 text-black' : 'text-white'} flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-2 cursor-pointer`}>
        <div className={`avatar ${isOnline?'online':''} `}>
        {isOnline&& <div aria-label="success" className="status status-success"></div>
        }
            <div className='w-12 rounded-full'>
                <img src={user?.avatar} alt="user-profile" />
            </div>
        </div>
        <div className='flex flex-col flex-1'>
            <div className='flex justify-between gap-2 '>
                <p>{user?.userName}</p>
            </div>
        </div>
    </div>
    <div className='divider my-0 py-0 h-1'></div>
</>
  )
}
