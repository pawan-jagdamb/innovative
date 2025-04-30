import { useEffect, useState } from 'react'
import {BrowserRouter, Routes,Route, useSearchParams} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import SignUp from './pages/SignUp'
import About from './pages/About'  
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import { VerifyEmail } from './pages/VerifyEmail'
import './App.css'
import UpdateListing  from './pages/UpdateListing'
import { Listing } from './pages/Listing'
import { Search } from './pages/Search'
import { HomePage } from './chat/HomePage'
import { useDispatch, useSelector } from 'react-redux'
import io from "socket.io-client";
import { setSocket } from './redux/user/socketSlice'
import { setOnlineUsers } from './redux/user/userSlice'


export default function App() {


  const {currentUser}=useSelector(store=>store.user);
  const {socket}= useSelector(store=>store.socket)
  const dispatch= useDispatch();
  // const authUser= currentUser;
  // console.log("authUser",currentUser._id)
  useEffect(()=>{
    if(currentUser){
      const socket= io('http://localhost:5000/',{
        query:{
         userId: currentUser._id}
      });
      dispatch(setSocket(socket));

      socket.on('getOnlineUsers',(onlineUsers)=>{
        console.log("onlineUser",onlineUsers)
        dispatch(setOnlineUsers(onlineUsers))
      });
      return()=>socket.close()
    }
    else{
      if(socket){
        socket.close();
        dispatch(setSocket(null))
      }
    }
  },[currentUser])
  // if(auth)


  

  return (
    <BrowserRouter>

<Header/>
    
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/sign-in' element={<Signin/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route path='/about' element={<About/>}/> 
      <Route path='/search' element={<Search/>}/>
      <Route path='/listing/:listingId' element={<Listing/>}/>
      <Route element=<PrivateRoute/>>
             <Route path='/profile' element={<Profile/>}/>
             <Route path='/create-listing' element={<CreateListing/>}/>
             <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>
             <Route path='/chating' element={<HomePage/>}/>
      
      </Route>
      <Route
      path='verify-email'
      element={
          <VerifyEmail/>
      
      }

    />
    </Routes>
    </BrowserRouter>
    
    
 )
}


