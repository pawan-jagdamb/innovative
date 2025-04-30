import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiConnector } from '../services/apiConnector';
import { endpoints } from '../services/apis';
import toast from 'react-hot-toast';
import { ListingItem } from '../components/ListingItem';

const { GET_LISTING } = endpoints;

export const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    offer: false,
    category: 'all',
    location: '',
    minPrice: '',
    maxPrice: '',
    sort: 'createdAt',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const updatedData = {
      searchTerm: urlParams.get('searchTerm') || '',
      type: urlParams.get('type') || 'all',
      offer: urlParams.get('offer') === 'true',
      category: urlParams.get('category') || 'all',
      location: urlParams.get('location') || '',
      minPrice: urlParams.get('minPrice') || '',
      maxPrice: urlParams.get('maxPrice') || '',
      sort: urlParams.get('sort') || 'createdAt',
      order: urlParams.get('order') || 'desc',
    };
    setSidebarData(updatedData);

    const fetchListings = async () => {
      setLoading(true);
      const toastId = toast.loading('Fetching listings...');
      try {
        const response = await apiConnector(
          'GET',
          `${GET_LISTING}/get?${urlParams.toString()}`,
          null
        );
        setListings(response.data.listings || []);
        toast.success('Listings loaded!');
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch listings.');
      }
      toast.dismiss(toastId);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    setSidebarData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    Object.entries(sidebarData).forEach(([key, value]) => {
      if (value !== '' && value !== 'all') {
        urlParams.set(key, value);
      }
    });

    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row p-5 gap-5 bg-gradient-to-r from-blue-500 to-richblack-900 min-h-screen">
      {/* Sidebar */}
      <div className="md:w-1/4 p-5 bg-white shadow-xl rounded-1xl sticky top-20 h-fit">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-black">
          {/* Search Input */}
          <div>
            <label htmlFor="searchTerm" className="block font-semibold text-blue-900 mb-2">
              Search
            </label>
            <input
              type="text"
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
              placeholder="Item name..."
              className="border bg-gray-100 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Type Filter */}
          {/* <div>
            <label htmlFor="type" className="block font-semibold text-blue-900 mb-2">
              Type
            </label>
            <select
              id="type"
              value={sidebarData.type}
              onChange={handleChange}
              className="border bg-gray-100 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
            >
              <option value="all">All</option>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </div> */}

          {/* Offer Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="offer"
              checked={sidebarData.offer}
              onChange={handleChange}
              className="w-5 h-5 bg-gray-100"
            />
            <label htmlFor="offer" className="text-blue-800">
              Offer Only
            </label>
          </div>

          {/* Category Filter */}
          {/* <div>
            <label htmlFor="category" className="block font-semibold text-blue-900 mb-2">
              Category
            </label>
            <select
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
            >
              <option value="all">All</option>
              <option value="books">Books</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothes">Clothes</option>
              <option value="stationary">Stationary</option>
              <option value="others">Others</option>
            </select>
          </div> */}

          {/* Location Filter */}
          <div>
            <label htmlFor="location" className="block font-semibold text-blue-900 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={sidebarData.location}
              onChange={handleChange}
              placeholder="Campus / Hostel..."
              className="border p-3 bg-gray-100 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Price Range */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="minPrice" className="block font-semibold text-blue-900 mb-2">
                Min Price
              </label>
              <input
                type="number"
                id="minPrice"
                value={sidebarData.minPrice}
                onChange={handleChange}
                placeholder="₹ Min"
                className="border bg-gray-100 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="maxPrice" className="block font-semibold text-blue-900 mb-2">
                Max Price
              </label>
              <input
                type="number"
                id="maxPrice"
                value={sidebarData.maxPrice}
                onChange={handleChange}
                placeholder="₹ Max"
                className="border bg-gray-100 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sort_order" className="block font-semibold text-blue-900 mb-2">
              Sort By
            </label>
            <select
              id="sort_order"
              onChange={(e) => {
                const [sort, order] = e.target.value.split('_');
                setSidebarData((prev) => ({ ...prev, sort, order }));
              }}
              defaultValue="createdAt_desc"
              className="border bg-gray-100 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="regularPrice_desc">Price High to Low</option>
              <option value="regularPrice_asc">Price Low to High</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 p-3 text-white font-semibold rounded-lg uppercase transition-all duration-200"
          >
            Search
          </button>
        </form>
      </div>

      {/* Listings */}
      <div className="md:w-3/4 p-5">
        <h1 className="text-3xl font-bold text-white mb-6">Listing Results</h1>
        {loading ? (
          <p className="text-center text-lg text-gray-700">Loading...</p>
        ) : listings.length === 0 ? (
          <p className="text-center text-xl text-red-600">No Items Found</p>
        ) : (
          <div className="grid grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="transform hover:scale-105  transition-transform duration-300 max-w-[330px]"
              >
                <ListingItem listing={listing} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
