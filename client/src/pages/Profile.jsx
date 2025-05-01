import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { app } from "../GoogleFirebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signInFailure,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { logout } from "../services/operations/authAPI";

import { Navigate, useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { endpoints } from "../services/apis";
import { setUser } from "../redux/user/profileSlice";
import { ShowListnings } from "../components/ShowListnings";

const { SHOW_LISTING } = endpoints;

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  // console.log(" console log in profile page",currentUser);
  const [fileUploadPer, setFileUploadPer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [userListings,setUserListings]=useState([])
  const [showList,setShowList]=useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("ccurrentUser", currentUser);

  console.log(" file uploading percentate", fileUploadPer);
  // console.log("file uploading image is",file);
  console.log("Form data is a", formData);
  // console.log("user image=>", currentUser.user.avatar);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `avatars/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    console.log(uploadTask);
    // console.log(" Url is ",uploadTask.snapshot.ref);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadPer(Math.round(progress));
        // console.log( `upload is ${progress}  % done`);
      },

      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("download url is ", downloadURL);
          // console.log(" url is ",uploadTask.snapshot.ref);
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("1")
      dispatch(updateUserStart());
      if (formData.password !== formData.confirmPassword) {
        toast.error("Password not matched");
        return;
      }
      console.log("2")
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${currentUser.token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("res",res)

      // console.log("ccurrentUser",currentUser.user);
      if (data.success === false) {
        // dispatch(updateUserFailure(data.message));
        toast.error(data.message);

        return;
      }
      console.log("Data  is->", data);
      console.log("current user is  after data", currentUser);
      toast.success(data.message);

      // dispatch(updateUserSuccess(data.data));
      // Navigate('/home');
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log("data in delete", data);

      if (data.success === false) {
        toast.error(data.message);

        //
        dispatch(deleteUserFailure(data.message));
        return;
      }

      localStorage.removeItem("token");

      localStorage.removeItem("persist:root"); // Just to ensure it's cleared

      window.location.reload();

      dispatch(deleteUserSuccess(data));
      return;
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    dispatch(logout(navigate));
  };
  const handleShowListings = async (req, res) => {
    const toastId = toast.loading("Fetching data");
      setShowList(false);
    try {
      console.log(currentUser._id);
      const response = await apiConnector(
        "GET",
        `${SHOW_LISTING}/${currentUser._id}`,
        null,
        {
          Authorization: `Bearer ${currentUser.token}`,
        }

      );
      // const response= await fetch(`/api/user/listings/${currentUser._id}`)
      console.log("response", response);

      // const data= await response.json();
      // console.log("data",data);
      if (!response.data.success) {
      
        console.error("API Error:", errorData);
        return;
      }
      console.log("response.data..istings",response.data.listings)
      setUserListings(response.data.listings)
      setShowList(true);
        // console.log("userListing",userListings)

    } catch (error) {
      console.error(
        "Error fetching listings:",
         error.message
      );
      setShowList(false);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
    toast.dismiss(toastId);
    // try {
    //   dispatch(signOutUserStart());
    //   const res= await fetch('/api/auth/signout',{
    //     method:'GET'
    //   });
    //   const data= await res.json();
    //   if(data.success==false){
    //     toast.error(data.message);
    //     dispatch(signOutUserFailure(data.message));
    //     return;
    //   }
    //   toast.success(data.message);
    //   dispatch(signOutUserSuccess(data));

    // } catch (error) {
    //   dispatch(signOutUserFailure(error.message));

    // }
  };

  return (
    <div className="max-w-[500px] min-h-screen mx-auto px-4 py-4 bg-blue-500 rounded-md shadow-sm mt-10 text-md">
      <h1 className="text-xl font-semibold text-center text-gray-100 mb-3">Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-3 text-black">
        <div className="flex justify-center">
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileRef}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <img
            src={formData.avatar || currentUser.avatar}
            onClick={() => fileRef.current.click()}
            alt="Profile"
            className="h-20 w-20 rounded-full object-cover cursor-pointer border-2 border-gray-300"
          />
        </div>

        <div className="text-center text-xs">
          {fileUploadError ? (
            <p className="text-red-500">Error uploading image</p>
          ) : fileUploadPer > 0 && fileUploadPer < 100 ? (
            <p className="text-yellow-500">Uploading: {fileUploadPer}%</p>
          ) : fileUploadPer === 100 ? (
            <p className="text-green-500">Uploaded successfully!</p>
          ) : null}
        </div>

        <input
          type="text"
          id="userName"
          defaultValue={currentUser.userName}
          onChange={handleChange}
          required
          placeholder="Username"
          className="w-full rounded-lg bg-gray-100 border border-richback-600 p-2 text-sm"
        />

        <input
          type="password"
          id="password"
          onChange={handleChange}
          placeholder="New Password"
          className="w-full rounded-lg bg-gray-100 border border-richblack-600 p-2 text-sm"
        />

        <input
          type="password"
          id="confirmPassword"
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full rounded-lg bg-gray-100 border border-gray-300 p-2 text-sm"
        />

        <button
          type="submit"
          className="w-full bg-yellow-300 hover:bg-blue-700 text-white py-1.5 rounded-sm text-sm font-medium"
        >
          Update Profile
        </button>
        <Link
          to="/chating"
          className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded-sm text-sm font-medium"
          >
        Go To Chat
      </Link>

        <Link
          to="/create-listing"
          className="block w-full text-center bg-yellow-300 hover:bg-blue-700 text-white py-1.5 rounded-sm text-sm font-medium"
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-3 text-red-600 text-sm font-medium">
        <button onClick={handleDeleteUser} className="hover:underline">Delete Account</button>
        <button onClick={handleSignOut} className="hover:underline">Sign Out</button>
      </div>
     

      <button
        onClick={handleShowListings}
        className="mt-3 w-full  bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded-sm text-sm font-medium"
      >
        Show My Listings
      </button>

      {showList && <ShowListnings Listing={userListings} />}
    </div>
  );
}
