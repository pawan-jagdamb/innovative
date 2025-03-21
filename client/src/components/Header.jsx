import React from 'react'
import { IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux'


export default function Header() {
  const {currentUser}= useSelector(state=>state.user);
  console.log("Current user->",currentUser);
//   console.log("Current user.user->",currentUser.user.avatar);

  return (
    <header className='text-xl bg-richblack-800 shadow-md'>
    <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <Link to='/'>
                <span className='text-richblack-25'>Colligiate </span>
                <span className=' text-richblack-100'>Mart</span>
            </Link>
           
        </h1>

        <form className='bg-slate-100 rounded-lg p-3 flex items-center'>
            <input type=" text" placeholder='Search Products...' 
                className='bg-transparent outline-none w-24 sm:w-64'

            />
            <IoSearch className='text-slate-600'/>
        </form>
        <ul className='flex gap-4'>
        <Link to='/'>
           <li className='hidden sm:inline text-richblack-100 hover:underline '>Home</li>

        </Link>
        <Link to='/about'>
        <li className='hidden sm:inline text-richblack-100 hover:underline'>About</li>


        </Link>
        
        <Link to='/profile'>
        {currentUser?(<img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='Profile'/>) : (<li className=' text-richblack-100 hover:underline'>Sign in</li>)
        }

        </Link>
        </ul>

    </div>
       

    </header>
  )
}
