import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { apiConnector } from '../services/apiConnector';
import { endpoints } from '../services/apis';
import toast from 'react-hot-toast';
import {Swiper,SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';

import 'swiper/css'
import 'swiper/css/navigation'
import { useDispatch, useSelector } from 'react-redux';
import Contact from '../components/Contact';
import { setSelectedUser } from '../redux/user/userSlice';
import useGetMessages from '../hooks/useGetMessages';
import { setMessages } from '../redux/user/messageSlice';

const {GET_A_LISTING}=endpoints;
const{GET_USER,BASE_URL}=endpoints;

export const Listing = () => {
  SwiperCore.use([Navigation])
const params= useParams();
const dispatch= useDispatch();
const [listing, setListing]=useState(null);
const [loading,setLoading]= useState(false);
const [copied, setCopied] = useState(false);
const [seller, setSeller] = useState(null);
const { currentUser,selectedUser } = useSelector((state) => state.user);
const navigate= useNavigate();


console.log("first")

  useEffect(()=>{
    const fetchListing= async()=>{
    setLoading(true);
      const toastId= toast.loading("Loading")
      try {
        
        const response= await apiConnector('GET',`${GET_A_LISTING}/${params.listingId}`,null);
        console.log("response in showing single listing",response)
        if(!response.data.success){  
          setLoading(false);
          toast.dismiss(toastId);
          toast.error("Error in loading data")
        }
        toast.success("Data fetched Successfully")
      
        toast.dismiss(toastId)
        console.log("Here")
        setLoading(false)
        setListing(response.data.listing)
        console.log(listing)
      } catch (error) {
        toast.dismiss(toastId);
        setLoading(false);
        toast.error(error.message);
      }

 
    };
    fetchListing();
  
    
  },[])
  console.log(listing)
  console.log(loading)
  const handleSeller=async()=>{
     try {
            // console.log(listing.userRef)
            console.log("contact", currentUser.token)
            console.log("in contact page",listing.userRef)
            // const res = await fetch(`server/api/user/${listing.userRef}`);
            console.log(`${GET_USER}/${listing.userRef}`)
            const response= await apiConnector('GET',`${GET_USER}/${listing.userRef}`,null,
              {
                  Authorization:`Bearer ${currentUser.token}`
              }
            )
            // const data = await res.json();
            if(!response.data.success){
              toast.error("Unable to fetch detail of Seller")
            }
            console.log("responsee",response.data)
            dispatch(setSelectedUser(response.data.rest))
            console.log("selected User in listingh",selectedUser)
            // useGetMessages();
            // dispatch(setMessages(null))

            // console.log("Get messages")
            // console.log("1")
            // console.log("Selected User:", selectedUser);

            // if (!selectedUser?._id) return;
            // console.log("selected UserId",selectedUser._id)
            // console.log("2")
            // // const GET_MESSAGE = `${BASE_URL}/v1/message/${selectedUser._id}`;
            // const params = {
            //     senderId: currentUser._id,
            //     receiverId: selectedUser._id,
            //   };
            //   const GET_MESSAGE = `${BASE_URL}/v1/message/${selectedUser._id}`;

            // const response1 = await apiConnector("GET", GET_MESSAGE,null,null,params);

            // console.log("Fetched Messages:", response1);
            // dispatch(setMessages(response1.data))
            navigate('/chating')
            
          
            // setSeller(response.data.rest);
            toast.success("Data fetched successfully")
          } catch (error) {
            console.log(error);
          }
    

  }
  
  return (
    <div className='flex justify-center'>
      <main className='backdrop-blur-md shadow-xl min-h-screen  max-w-[940px] min-w-[250px]  bg-gradient-to-r from-blue-500 to-richblack-500 px-4 '>
    <div >
    {listing&&!loading&&(
        
        <div className=''>
        <p className='text-white'></p>
        
          <Swiper navigation 
           
          >
          {listing.imageUrls.map((url)=>(
            <SwiperSlide key={url}>
          
            <div className='h-[450px] max-w-[440px] item-center flex ml-10 mt-5 bg-cover bg-center bg-no-repeat' style={{backgroundImage:`url('${url}')`}}>
            </div>
           
            </SwiperSlide>

            
          ))}

          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}

            <div className='flex flex-col items-center text-center max-w-4xl mx-auto p-3 my-7 gap-4'>

          <p className='text-2xl font-semibold'>
              {listing.name} - Rs{' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
            
            </p>

            <p className='flex items-center mt-6 gap-2 text-richblack-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            
            <div className='flex gap-4'>
            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  Rs{+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}

            </div>
            <p className='text-richblack-200'>
              <span className='font-semibold text-richblack-200'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
           
            </ul>

            {currentUser && listing.userRef!==currentUser._id&&   (
              <button
                onClick={handleSeller}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact Seller
              </button>
            )}
            {/* {contact && <Contact listing={listing} />} */}

          </div>




        </div>


        

        
      )}

    </div>
    
      
    </main>

    </div>
    
  )
}
