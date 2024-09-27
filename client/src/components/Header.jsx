import React from 'react'
import { IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';


export default function Header() {
  return (
    <header className='text-xl bg-slate-200 shadow-md'>
    <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <Link to='/'>
                <span className='text-slate-500'>colligiate </span>
                <span className=' text-slate-700'>Mart</span>
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
           <li className='hidden sm:inline text-slate-700 hover:underline '>Home</li>

        </Link>
        <Link to='/about'>
        <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>


        </Link>
        <Link to='/sign-in'>
          <li className=' text-slate-700 hover:underline'>Sign in</li>

        </Link>
        </ul>

    </div>
       

    </header>
  )
}
