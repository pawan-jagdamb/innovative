import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { endpoints } from '../services/apis';
import { apiConnector } from '../services/apiConnector';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { BsThreeDotsVertical } from 'react-icons/bs';

const { DELETE_LISTING } = endpoints;

export const ShowListnings = (Listing) => {
  const { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState(Listing.Listing);
  const [openMenuId, setOpenMenuId] = useState(null); // Track which listing's menu is open

  const handleDelete = async (listingId) => {
    try {
      const response = await apiConnector('DELETE', `${DELETE_LISTING}/${listingId}`, null, {
        Authorization: `Bearer ${currentUser.token}`,
      });

      if (!response.data.success) {
        toast.error("Error in deleting listing");
        return;
      }

      toast.success("Listing deleted Successfully");
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      toast.error("Error in deleting listings");
      console.log(error);
    }
  };

  const toggleMenu = (listingId) => {
    setOpenMenuId(openMenuId === listingId ? null : listingId);
  };

  return (
    <>
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl'>Your Listings</h1>
          {userListings.map((listing) => (
            <div key={listing._id} className='border rounded-lg p-3 flex justify-between gap-4 items-center relative'>
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='Listing cover'
                  className='h-16 w-20 object-cover rounded-lg'
                />
              </Link>

              <Link to={`/listing/${listing._id}`} className='flex-1'>
                <p className='text-richblack-200 font-semibold hover:underline truncate'>
                  {listing.name}
                </p>
              </Link>

              <div className='relative'>
                <button onClick={() => toggleMenu(listing._id)}>
                  <BsThreeDotsVertical className='text-xl' />
                </button>

                {openMenuId === listing._id && (
                  <div className='absolute right-0 top-8 bg-white shadow-md rounded-md z-10 flex flex-col'>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className='px-4 py-2 text-red-700 hover:bg-gray-100 text-left'
                    >
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='px-4 py-2 text-green-700 hover:bg-gray-100 text-left w-full text-left'>
                        Edit
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

