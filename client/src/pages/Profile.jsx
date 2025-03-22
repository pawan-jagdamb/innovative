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
      dispatch(updateUserStart());
      if (formData.password !== formData.confirmPassword) {
        toast.error("Password not matched");
        return;
      }

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      // console.log("ccurrentUser",currentUser.user);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error(data.message);

        return;
      }
      console.log("Data  is->", data);
      console.log("current user is ", currentUser);
      toast.success(data.message);

      dispatch(updateUserSuccess(data));
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

    try {
      console.log(currentUser._id);
      const response = await apiConnector(
        "GET",
        `http://localhost:5000/api/user/listings/67dda7bd9189c563bcbfc745`,
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
        // console.log("userListing",userListings)

    } catch (error) {
      console.error(
        "Error fetching listings:",
         error.message
      );
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
    <div className="p-3 max-w-lg mx-auto">
      <h1 className=" text-3xl font-semibold text-center text-white">
        Your Profile
      </h1>
      <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="Profile"
          className="rounded-full 
        h-24 w-24 object-cover cursor-pointer self-center mt-2 text-white"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error in Uploading Image ( Image must be less then 2mb)
            </span>
          ) : fileUploadPer > 0 && fileUploadPer < 100 ? (
            <span className="text-green-500">
              {`Uploading ${fileUploadPer} % done`}
            </span>
          ) : fileUploadPer === 100 ? (
            <span className=" text-green-700">
              Image uploaded successfully !
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          id="userName"
          className="
        border p-3 rounded-lg"
          defaultValue={currentUser.userName}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="New Password"
          id="password"
          className="
        border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="New Confirm Password"
          id="confirmPassword"
          className="
        border p-3 rounded-lg"
          onChange={handleChange}
        />

        {/*  creating button */}
        <button
          className=" bg-richblack-700 text-whited rounded-lg
        p-3 uppercase text-white hover:opacity-50 disabled:opacity-80"
        >
          Update
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 p-3 text-white rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className=" flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      <button
        onClick={handleShowListings}
        className=" bg-richblack-700 text-whited rounded-lg
        p-3 uppercase text-white hover:opacity-50 disabled:opacity-80 w-full"
      >
        {" "}
        Show listing
      </button>
      <ShowListnings userListings={userListings}/>
    </div>
  );
}
