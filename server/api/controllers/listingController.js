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
export const deleteListing = async(req,res)=>{
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

export const updateListing= async(req,res)=>{
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
export const getListing= async(req,res)=>{
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