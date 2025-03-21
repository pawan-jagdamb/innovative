import Listing from "../model/listingModel.js";

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