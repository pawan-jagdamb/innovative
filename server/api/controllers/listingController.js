import Listing from "../model/listingModel.js";

export const createListing= async(req,res,next)=>{
    try {
        const listing= await Listing.create(req.body);
        return res.status(201).json({
            success:false,
            message:"Listing Created Successfully",
            listing
        })
        
    } catch (error) {
        next(error);
        
    }
}