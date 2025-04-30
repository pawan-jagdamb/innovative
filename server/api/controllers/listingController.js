import Listing from "../model/listingModel.js";
import { errorHandler } from "../utils/error.js";

export const createListing= async(req,res,next)=>{
    try {
        console.log("req.body",req.body);
        const listing= await Listing.create(req.body);
        return res.status(201).json({
            success:true,
            message:"Listing Created Successfully",
            listing
        })
        
    } catch (error) {
        next(error);
        
    }
}
export const deleteListing = async(req,res,next)=>{
    const listing= await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404, 'Listing not found'))
    }
    console.log("req.user",req.user);
    if(req.user.id!==listing.userRef){
        return next(errorHandler(401,"You can  only own listing"))
    }

    try { 

        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json(
            {
                success:true, 
                message:"Listing deleted successfully"
            }
        )
        
    } catch (error) {
        next(error);
        
    }
}

export const updateListing= async(req,res,next)=>{
    const listing= await Listing.findById(req.params.id);
    if(!listing){
        next (errorHandler(404, 'Listing not Found'))
    }
    if(req.user.id!==listing.userRef){
        return next(errorHandler(401,"You can only update your own listing"))
    }

    try {

        const updateListing= await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        return res.status(200).json({
            success:true,
            updateListing})
        
    } catch (error) {
        console.log("Erron in updateing listing",error);
        next(error);
        
    }
}
export const getListing= async(req,res,next)=>{
    try {
        
        const listing=await Listing.findById(req.params.id);
        // console.log(listing);
        if(!listing){
            next(errorHandler(404,'Listin not found'))
        }
        return res.status(200).json({
            success:true,
            listing});
    } catch (error) {
      console.log(error);
     next( errorHandler(500, error.message))
    //   return;
       
        
    }
}

export const getAllListings= async(req,res,next)=>{

    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;
        
        const query = {
            name: { $regex: searchTerm, $options: 'i' },
          };
        
          // --- Offer Filter ---
          if (req.query.offer === 'true') {
            query.offer = true;
          } else if (req.query.offer === 'false') {
            query.offer = false;
          }
        
          // --- Furnished Filter ---
          if (req.query.furnished === 'true') {
            query.furnished = true;
          } else if (req.query.furnished === 'false') {
            query.furnished = false;
          }
        
          // --- Address Filter (location) ---
          if (req.query.location && req.query.location.trim() !== '') {
            query.address = { $regex: req.query.location, $options: 'i' };
          }
        
          // --- Price Filter (regularPrice) ---
          const minPrice = parseFloat(req.query.minPrice);
          const maxPrice = parseFloat(req.query.maxPrice);
          if (!isNaN(minPrice) || !isNaN(maxPrice)) {
            query.regularPrice = {};
            if (!isNaN(minPrice)) query.regularPrice.$gte = minPrice;
            if (!isNaN(maxPrice)) query.regularPrice.$lte = maxPrice;
          }
        
          const listings = await Listing.find(query)
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);


        return res.status(200).json({
            success:true,
            listings
        })


        
    } catch (error) {
        console.log("Error in get all listing");
        next(error);
        
    }
}