import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiConnector } from '../services/apiConnector';
import { endpoints } from '../services/apis';
import toast from 'react-hot-toast';
import { ListingItem } from '../components/ListingItem';

const {GET_LISTING}=endpoints
export const Search = () => {
    const [sidebarData,setSidebarData]= useState({
        searchTerm:'',
        type:'all',
        offer:false,
        sort:'created_at',
        order:'desc'
    })

    const [loading,setLoading]= useState(false);
    const [listings,setListings]=useState([]);
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
       
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
         
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
          ) {
            setSidebarData({
              searchTerm: searchTermFromUrl || '',
              type: typeFromUrl || 'all',
             
              offer: offerFromUrl === 'true' ? true : false,
              sort: sortFromUrl || 'created_at',
              order: orderFromUrl || 'desc',
            });
        }

        const fetchListing= async()=>{
            setLoading(true);
            const toastId= toast.loading("Loading")
            const searchQuery = urlParams.toString();
            const response= await apiConnector("GET",`${GET_LISTING}/get?${searchQuery}`,null);

            console.log("response",response.data



            )
            setListings(response.data.listings)
            toast.dismiss(toastId);
            console.log("Listing",listings);
            toast.success("Data Fetched Successfully")
            setLoading(false);

        }
        fetchListing();
        


    },[location.search])

    const navigate= useNavigate();
    console.log("side barData",sidebarData)
    const handleChange =(e)=>{

        if(e.target.id==='all'){
            setSidebarData({...sidebarData,type:e.target.id})

        }
        if(e.target.id==='searchTerm'){
            setSidebarData({...sidebarData,searchTerm:e.target.value})
        }
        if(e.target.id==='offer'){
            setSidebarData({...sidebarData,[e.target.id]:e.target.checked|| e.target.checked==='true'?true:false})
        }
        if(e.target.id==='sort_order'){
            const sort= e.target.value.split('_')[0]||'created_at';
            const order= e.target.value.split('_')[1]||'desc';

            setSidebarData({...sidebarData,sort,order})
        }


   

    }

    const handleSubmit=(e)=>{
        e.preventDefault();

        const urlParams= new URLSearchParams();
        urlParams.set('searchTerm',sidebarData.searchTerm);
        urlParams.set('type',sidebarData.type);
        urlParams.set('offer',sidebarData.offer);
        urlParams.set('sort',sidebarData.sort);
        urlParams.set('order',sidebarData.order);
        const searchQuery= urlParams.toString();


        navigate(`/search?${searchQuery}`)



    }

  return (
        <div className='flex flex-col md:flex-row text-richblack-100'>
            <div className='p-7 border-b-2 sm:border-r-2 md:min-h-screen 
            '>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2 '>
                    <label
                    className='whitespace-nowrap font-semibold' 
                    >Search Term:</label>
                    <input
                        type='text'
                        id='searchTerm'
                        placeholder='Search...'
                        value={sidebarData.searchTerm}
                        onChange={handleChange}
                        className='border rounded-lg  p-3 w-full'
                    />
                </div>
                <div className='flex gap-2 flex-wrap items-center text-richblack-100'>
                    <label className='text-richblack-100'>Type:</label>
                    <div className='flex gap-2'>
                        <input type='checkbox'
                            id='offer'
                            className='w-5'
                            onChange={handleChange}


                        />
                        <span>offer</span>
                    

                    </div>
                  
                  
                </div>

                <div className='flex items-center gap-2 text-richblack-400'>
                    <label>Sort:</label>
                    <select id='sort_order'
                    className='border rounded-lg p-3'
                    onChange={handleChange}
                    defaultValue={'created_at_desc'}
                    >
                        <option value={"regularPrice_desc"} >Price High to low</option>
                        <option value={"regularPrice_asc"} >Price Low to High</option>
                        <option value={"createdAt_desc"}>Latest</option>
                        <option value={"createdAt_asc"}>Oldest</option>
                    </select>
                </div>
                <button className='bg-richblack-700 p-3 text-richblack-200
                rounded-lg uppercase hover:opacity-95'>search</button>



                </form>
            </div>
            <div className=''>
                <h1 className='text-3xl font-semibold  p-3 text-richblack-600'>Listing Results</h1>
            </div>
            <div className='p-7 flex lg:flex-row flex-col  gap-4'>
                {!loading&& listings.length===0 &&(

                    <p className='text-xl text-pink-700 '> No Item Found</p>
                 
                )}
                {
                    !loading && listings && listings.map((listing)=>(
                        <ListingItem key={listing._id} listing={listing}/>
                    ))
                }
            </div>
        </div>
  )
}
