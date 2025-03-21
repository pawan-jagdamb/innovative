import React, { useState } from "react";
import { createListing } from "../../../server/api/controllers/listingController";
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

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 text-white">
        Create Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        action=""
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-4  flex-1">
          <input
            type="text"
            placeholder="Name"
            className=" border p-3 rounded-lg "
            id="name"
            maxLength="62"
            minLength="10"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className=" border p-3 rounded-lg "
            id="description"
            value={formData.description}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className=" border p-3 rounded-lg "
            id="address"
            value={formData.address}
            onChange={handleFormChange}
            required
          />

          <div className="flex gap-6 flex-wrap text-white">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleFormChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleFormChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="text-white flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
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
              formData.offer &&( <div className="flex items-center gap-2">
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
        <div className=" flex flex-col flex-1 text-white gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-richblack-100 ml-2">
              The first will be the cover (max 6)
            </span>
          </p>
          <div className=" flex gap-4">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploadingProgress}
              onClick={handleImageUpload}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg 
                        disabled:opacity-80"
            >
              {uploadingProgress ? "Uploading..." : "Upload"}
            </button>
          </div>
          {/* <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p> */}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-40 h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase
                hover:opacity-95 disabled:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button disabled={loading|| uploadingProgress}
            className=" p-3 bg-richblack-700 text-white rounded-lg 
                uppercase"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
