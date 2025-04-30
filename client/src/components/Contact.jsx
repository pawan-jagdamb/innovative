import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiConnector } from '../services/apiConnector';
import { endpoints } from '../services/apis';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
const{GET_USER}=endpoints;
export default function Contact({ listing }) {
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState('');
const { currentUser } = useSelector((state) => state.user);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchSeller = async () => {

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
        
        setSeller(response.data.rest);
        toast.success("Data fetched successfully")
      } catch (error) {
        console.log(error);
      }
    };
    fetchSeller();
  }, [listing.userRef]);
  return (
    <>
      {seller && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{seller.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg text-richblack-900'
          ></textarea>

          <Link
          to={`mailto:${seller.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message           
          </Link>
        </div>
      )}
    </>
  );
}