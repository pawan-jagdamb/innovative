import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
} from "../redux/user/userSlice";
import toast from "react-hot-toast";
import { logout } from "../services/operations/authAPI";
import { apiConnector } from "../services/apiConnector";
import { endpoints } from "../services/apis";
import { ShowListnings } from "../components/ShowListnings";

const { SHOW_LISTING } = endpoints;

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadPer, setFileUploadPer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [userListings, setUserListings] = useState([]);
  const [showList, setShowList] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `avatars/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadPer(Math.round(progress));
      },
      () => setFileUploadError(true),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
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
        toast.error("Passwords do not match");
        return;
      }

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        dispatch(updateUserFailure(data.message));
        toast.error(data.message);
        return;
      }

      dispatch(updateUserSuccess(data));
      toast.success(data.message);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) {
          dispatch(deleteUserFailure(data.message));
          toast.error(data.message);
          return;
        }

        localStorage.clear();
        window.location.reload();
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
        toast.error(error.message);
      }
    }
  };

  const handleSignOut = () => dispatch(logout(navigate));

  const handleShowListings = async () => {
    const toastId = toast.loading("Fetching your listings...");
    setShowList(false);
    try {
      const response = await apiConnector("GET", `${SHOW_LISTING}/${currentUser._id}`, null, {
        Authorization: `Bearer ${currentUser.token}`,
      });

      if (!response.data.success) throw new Error("Failed to fetch listings");

      setUserListings(response.data.listings);
      setShowList(true);
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
    toast.dismiss(toastId);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 bg-blue-25 rounded-none shadow-sm mt-10 text-sm">
      <h1 className="text-xl font-semibold text-center text-gray-800 mb-3">Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
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
          className="w-full rounded-lg bg-white-100 border border-richback-600 p-2 text-sm"
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-sm text-sm font-medium"
        >
          Update Profile
        </button>

        <Link
          to="/create-listing"
          className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded-sm text-sm font-medium"
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
        className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-sm text-sm font-medium"
      >
        Show My Listings
      </button>

      {showList && <ShowListnings Listing={userListings} />}
    </div>
  );
}
