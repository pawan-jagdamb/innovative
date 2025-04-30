
import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'

export const ListingItem = ({listing}) => {
  return (
    <div className='bg-richblack-800 shadow-md hover:shadow-lg transition-shadow
    w-full h-[450px] sm:w-[330px] overflow-hidden rounded-lg flex:col'>
    <Link to={`/listing/${listing._id}`}>
    <img
  className="w-full max-h-[250px] object-contain transition-transform duration-300 hover:scale-150"
  alt="cover image"
  src={listing.imageUrls[0]}
/>



<div className='p-3 flex flex-col items-center text-center gap-2 w-full'>

        <p className='text-richblack-100 font-semibold  text-lg truncate'>{listing.name}</p>
        <div className='flex items-center gap -1'>
          <MdLocationOn className='h-4 w-4 gext-green-700'/>
          <p className='text-sm text-richblack-100 truncate'>{listing.address}</p>
         </div>
         <div className='flex gap-4'>
          {
            listing.offer&&(
              <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'
              >₹{+listing.regularPrice- +listing.discountPrice} Off</p>
            )
          }
         </div>

         <p className='text-richblack-100 text-sm line-clamp-2
         '>{listing.description}</p>
         <p className='text-richblack-200 mt-2 font-semibold
         flex items-center'>
         ₹ {
          listing.offer?listing.discountPrice.toLocaleString('en-US'):
          listing.regularPrice.toLocaleString('en-US')
         }
         </p>
         
      </div>
   

    </Link>
    </div>
  )
}
