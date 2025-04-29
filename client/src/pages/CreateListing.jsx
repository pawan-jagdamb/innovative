import React, { useState } from "react";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../GoogleFirebase";
import toast from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { endpoints } from "../services/apis";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const { CREATE_LISTING } = endpoints;


export default function CreateListing(props) {
  const navigate= useNavigate();
  const {currentUser}= useSelector(state=>state.user)
  const [files, setFiles] = useState([]);

  console.log("Current user",currentUser);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(false);

  const [err, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log("files",files);

  console.log("Form Data", formData);
  function isFileTypeSupported(type) {
    const supportedType = ["jpeg", "jpg", "png"];

    return supportedType.includes(type);
  }

  const handleImageUpload = (e) => {
    // e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploadingProgress(true);
      setImageUploadError(false);
      // const toastId=toast.loading("Uploading")
      const promises = []; // we need to wait for all of them to upload

      for (let i = 0; i < files.length; i++) {
        const fileType = files[i].name.split(".")[1].toLowerCase();
        console.log("each file is", files[i]);
        if (isFileTypeSupported(fileType)) {
          // console.log(reached);
          // if(files[i].size >2*1024){}
          if (files[i].size / 1000 > 2 * 1024) {
            setUploadingProgress(false);
            // toast.dismiss(toastId)
            setImageUploadError("Image  size should be less than 2mb max(2mb)");
            toast.error("Image  size should be less than 2mb");
            return;
          }
          promises.push(storeImage(files[i]));
        } else {
          setUploadingProgress(false);
          setImageUploadError("File Type Not Supported");
          toast.dismiss(toastId);
          toast.error("Invalid file name or File Type Not Supported");
          return;
        }
        // toast.dismiss(toastId)
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploadingProgress(false);
        })
        .catch((error) => {
          setImageUploadError("Image  size should be max(2mb)");
          toast.error("Image  size should be max(2mb)");
          // setUploadingProgress(false);
        });
    } else if (files.length == 0) {
      setImageUploadError("Choose atleast 1 image");
      toast.error("Choose atleast 1 image");
      setUploadingProgress(false);
    } else {
      setImageUploadError("You can only upload 6 images");
      toast.error("You can only upload 6 images");
      setUploadingProgress(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `ListningImage/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("upload task is", progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleFormChange = (e) => {
    if (e.target.id == "furnished" || e.target.id == "offer") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type == "text" ||
      e.target.type == "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("first")
    const toastId= toast.loading("Creating Listing")
    console.log("sedond")

    try {
      if(formData.imageUrls.length<1){
        toast.error("Image not Uploaded");
        return
      }
      if(formData.offer && formData.discountPrice>formData.regularPrice){
        toast.error("Discount price should be less then regular price");
        return;
      }
console.log("threee")
      setLoading(true);
      setError(false);
      const newFormData={
        ...formData,userRef:`${currentUser._id}`  
      }
      console.log("New form Data",newFormData)
     
      const response = await apiConnector(
        "POST",
        CREATE_LISTING,
        newFormData,   {
          "Content-Type": "application/json",
          Authorization:`Bearer ${currentUser.token}`
         
        }
     
      );
      toast.dismiss(toastId);
      console.log("four")
      console.log(" response after submint listing data",response.data)

      // const data= await response.json();
      // console.log("Data  after submmit in creating listing",data);
      setLoading(false);
      if(!response.data.success){
        setError(response.data.message)
        return
      }
      const data= response.data;
      console.log("Data in create listing ",data);
      navigate(`/listing/${data.listing._id}`)
    } catch (error) {
      toast.dismiss(toastId);
      setError(error.message);
      toast.error(error);
      setLoading(false);
      console.log("Error in submitting data", error);
    }
  };

  return(
    <main className="p-6 md:p-10 max-w-6xl mx-auto bg-gradient-to-r from-blue-700 to-blue-800 rounded-1xl">
      <h1 className="text-5xl font-bold text-center text-white mb-12">
        Create New Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-8 bg-white shadow-lg p-10 rounded-1xl"
      >
        {/* Left Side (Form Inputs) */}
        <div className="flex flex-col gap-6 flex-1 bg-gray-50 p-6 rounded-lg">
          <input
            type="text"
            placeholder="Name"
            id="name"
            value={formData.name}
            onChange={handleFormChange}
            className="border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <textarea
            placeholder="Description"
            id="description"
            value={formData.description}
            onChange={handleFormChange}
            className="border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            value={formData.address}
            onChange={handleFormChange}
            className="border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />

          {/* Category */}
          

          {/* Availability */}
          {/* <div className="flex items-center gap-3">
            <label htmlFor="availability" className="font-semibold text-gray-700">
              Availability
            </label>
            <select
              id="availability"
              value={formData.availability}
              onChange={handleFormChange}
              className="border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div> */}

          {/* Payment Methods */}
          {/* <div className="flex flex-col gap-3">
            <label className="font-semibold text-gray-700">Payment Methods</label>
            <div className="flex gap-3">
              <input
                type="checkbox"
                value="Credit Card"
                // checked={formData.paymentMethods.includes("Credit Card")}
                onChange={handlePaymentMethodsChange}
              />
              <span>Credit Card</span>
              <input
                type="checkbox"
                value="PayPal"
                // checked={formData.paymentMethods.includes("PayPal")}
                onChange={handlePaymentMethodsChange}
              />
              <span>PayPal</span>
              <input
                type="checkbox"
                value="Bank Transfer"
                // checked={formData.paymentMethods.includes("Bank Transfer")}
                onChange={handlePaymentMethodsChange}
              />
              <span>Bank Transfer</span>
            </div>
          </div> */}
          <div className="flex gap-6 flex-wrap text-white">
            <div className="flex gap-2">
              {/* <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleFormChange}
                checked={formData.furnished}
              />
              <span>Furnished</span> */}
            </div>
            <div className="flex gap-2 text-black">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleFormChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
            <div className="text-white flex flex-wrap gap-6 text-black">
            <div className="flex items-center gap-2 text-black">
              <input
                type="number"
                id="regularPrice"
                required
                min="0"
                onChange={handleFormChange}
                checked={formData.regularPrice}
                className="p-3 border border-gray-300 rounded-lg text-black"
              />
              <div className="flex flex-col items-center">
                <p>Regular price </p>
                <span className="text-xs">₹ /INR</span>
              </div>
            </div>
            {
              formData.offer &&( <div className="flex items-center gap-2 text-black">
              <input
                type="number"
                id="discountPrice"
                required
                min="0"
                max='1000000'
                onChange={handleFormChange}
                checked={formData.discountPrice}
                className="p-3 border border-gray-300 rounded-lg text-black"
              />
              <div className="flex flex-col items-center">
                <p>Discount price</p>

                <span className="text-xs">₹ /INR</span>
              </div>
            </div>
            )
            }
           
          </div>
          </div>
        </div>

        {/* Right Side (Image Upload) */}
        <div className="flex flex-col gap-6 flex-1 bg-gray-50 p-6 rounded-lg">
          <div>
            <label htmlFor="image" className="font-semibold text-gray-700">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              id="image"
              onChange={(e) => setFiles(e.target.files)}
              className="border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {imageUploadError && (
              <p className="text-red-600 text-sm mt-2">{imageUploadError}</p>
            )}
          </div>

          {/* Image Preview */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={url}
                  alt="Listing"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-3 mt-6">
            <button
              type="button"
              onClick={handleImageUpload}
              className="w-full p-4 bg-blue-600 text-white rounded-lg"
            >
              Upload Images
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 bg-green-600 text-white rounded-lg"
            >
              {loading ? "Creating Listing..." : "Create Listing"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
 