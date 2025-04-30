import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { BiSearchAlt2 } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/user/userSlice';
import { OtherUsers } from './OtherUsers';
import { useGetOtherUsers } from '../hooks/useGetOtherUsers';

export const Sidebar = () => {
    useGetOtherUsers();
    const [search, setSearch] = useState("");
    const {otherUsers}= useSelector(store=>store.user)
    const dispatch= useDispatch();

    const searchSubmitHandler=(e)=>{
        e.preventDefault();
        const conversationUser= otherUsers?.find((user)=>user.userName.includes(search));
        if(conversationUser){
            dispatch(setSelectedUser(conversationUser))
        }
        else{
            toast.error("User Not found")
        }
    }
  
  return (
    <div className='border-r border-slate-500 p-4 flex flex-col'>
    <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2'>
        <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className='input input-bordered rounded-md' type="text"
            placeholder='Search...'
        />
        <button type='submit' className='btn bg-zinc-700 text-white'>
            <BiSearchAlt2 className='w-6 h-6 outline-none'/>
        </button>
    </form>
    <div className="divider px-3"></div> 
    <OtherUsers/> 
   
</div>
  )
}
