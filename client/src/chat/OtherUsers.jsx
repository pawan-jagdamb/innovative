import React, { useEffect } from 'react'
import  {OtherUser}  from './OtherUser'
import { useGetOtherUsers } from '../hooks/useGetOtherUsers';
import { useSelector } from 'react-redux';

export const OtherUsers = () => {
  useGetOtherUsers();
  const{otherUsers,currentUser} = useSelector(store=>store.user);
  
  console.log("OtherUser",otherUsers);
  if(!otherUsers){
    return;
  }

  return (
    <div className='overflow-auto flex-1 '>
    {/* Hellow */}
      {
       otherUsers&& otherUsers?.map((user)=>{
          return(
            
         
          currentUser._id!=user._id&& <OtherUser key={user._id} user={user}/>
            

          )

        })
      }
    
    </div>
  )
} 
