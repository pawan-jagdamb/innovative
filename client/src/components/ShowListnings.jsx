import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { endpoints } from '../services/apis';
import { apiConnector } from '../services/apiConnector';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
const {DELETE_LISTING}=endpoints;


export const ShowListnings = (Listing) => {
    const { currentUser } = useSelector((state) => state.user);
  

const [userListings,setUserListings]=useState(Listing.Listing)
    // const userListings= Listing.userListings;
    // useEffect(()=>{
    //   setUserListings(Listing.Listing);
    // },[userListings])
    console.log("her",Listing);
    // setUserListings(Listing.listing);
    const handleDelete=async(listingId)=>{
      console.log(listingId)
      try {
        const response= await apiConnector('DELETE',`${DELETE_LISTING}/${listingId}`,
          null,
          {
            Authorization: `Bearer ${currentUser.token}`,
          }
        )
        if(!response.data.success){
          toast.error("Error in deleting listing")

        }
        toast.success("Listing deleted Successfully")
        setUserListings((prev)=>prev.filter((listing)=>listing._id!==listingId))

        console.log("response",response)
      } catch (error) {
        toast.error("Error in deleting listings")
        console.log(error)
        
      }

    }
  return (
    <>

        {userListings&& userListings.length>0 &&
       
       <div className='flex flex-col gap-4'>
       <h1 className='text-center mt-7 text-2xl'> Your Listings</h1>
        {
             userListings.map((listing)=>(
            <div key={listing._id}
            className='border rounded-lg p-3 flex justify-between gap-4 items-center'
           
            >
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt='Listing cover Image' className='
                h-15, w-16 object-contain rounded-lg'/>
            </Link>
            <Link to={`/listing/${listing._id}`} className='flex-1'>
            <p
            className='text-richblack-200 font-semibold 
             hover:underline truncate'
            >

                {listing.name}
            </p>
            </Link>
            <div className='flex flex-col items-center'>
            <button onClick={()=>handleDelete(listing._id)} className='text-red-700'>Delete</button>
            <button  className='text-green-700'>Edit</button>

            </div>

            </div>
        ))  
        }
       </div>
        
     
        
        }
    </>
  )
}
