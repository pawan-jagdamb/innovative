import React from 'react'
import { Link } from 'react-router-dom'

export const ShowListnings = (userListing) => {
    const userListings= userListing.userListings;
    console.log("her",userListings)
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
            <button className='text-red-700'>Delete</button>
            <button className='text-green-700'>Edit</button>

            </div>

            </div>
        ))  
        }
       </div>
        
     
        
        }
    </>
  )
}
