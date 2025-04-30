import React from 'react'
import { Sidebar } from './Sidebar'
import { MessageContainer } from './MessageContainer'

export const HomePage = () => {
  return (
    <div  className="p-4 h-screen flex items-center justify-center">

    <div  className='flex sm:h-[450px] md:h-[550px] border rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
        <Sidebar/>
        <MessageContainer/>
    </div>
    </div>
  )
}
