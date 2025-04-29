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

export default function CreateListing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    furnished: false,
    category: "",
    paymentMethods: [],
    availability: "In Stock",
    tags: [],
    isExclusive: false,
    sellerRating: 0,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(false);
  const [err, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFileTypeSupported = (type) => {
    const supportedType = ["jpeg", "jpg", "png"];
    return supportedType.includes(type);
  };

  const handleImageUpload = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploadingProgress(true);
      setImageUploadError(false);
      const toastId = toast.loading("Uploading...");
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        const fileType = files[i].name.split(".").pop().toLowerCase();
        if (isFileTypeSupported(fileType)) {
          if (files[i].size / 1024 > 2048) {
            setUploadingProgress(false);
            toast.dismiss(toastId);
            setImageUploadError("Image size should be less than 2MB");
            toast.error("Image size should be less than 2MB");
            return;
          }
          promises.push(storeImage(files[i]));
        } else {
          setUploadingProgress(false);
          toast.dismiss(toastId);
          setImageUploadError("File Type Not Supported");
          toast.error("Invalid file name or file type not supported");
          return;
        }
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.concat(urls),
          }));
          setUploadingProgress(false);
          toast.dismiss(toastId);
          toast.success("Images uploaded successfully");
        })
        .catch(() => {
          setUploadingProgress(false);
          toast.dismiss(toastId);
          toast.error("Error uploading images");
        });
    } else if (files.length === 0) {
      setImageUploadError("Choose at least 1 image");
      toast.error("Choose at least 1 image");
    } else {
      setImageUploadError("You can only upload 6 images max");
      toast.error("You can only upload 6 images");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}-${file.name}`;
      const storageRef = ref(storage, `ListingImages/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        () =>
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            resolve(downloadURL)
          )
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleFormChange = (e) => {
    const { id, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const handlePaymentMethodsChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      paymentMethods: checked
        ? [...prev.paymentMethods, value]
        : prev.paymentMethods.filter((method) => method !== value),
    }));
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      tags: value.split(",").map((tag) => tag.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating Listing...");

    // Validation
    if (!formData.name || !formData.description || !formData.address || !formData.category) {
      toast.dismiss(toastId);
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.imageUrls.length < 1) {
      toast.dismiss(toastId);
      toast.error("Upload at least one image");
      return;
    }

    if (formData.offer && +formData.discountPrice >= +formData.regularPrice) {
      toast.dismiss(toastId);
      toast.error("Discount price should be less than regular price");
      return;
    }

    setLoading(true);
    try {
      const newFormData = {
        ...formData,
        userRef: currentUser._id,
      };

      const response = await apiConnector("POST", CREATE_LISTING, newFormData, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      });

      toast.dismiss(toastId);

      if (!response.data.success) {
        setError(response.data.message);
        return;
      }

      toast.success("Listing created successfully!");
      setFormData({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        regularPrice: 0,
        discountPrice: 0,
        offer: false,
        furnished: false,
        category: "",
        paymentMethods: [],
        availability: "In Stock",
        tags: [],
        isExclusive: false,
        sellerRating: 0,
      });
      navigate(`/listing/${response.data.listing._id}`);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Something went wrong");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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