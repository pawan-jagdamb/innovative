import User from '../model/useModel.js'
export const getOtherUsers=async(req,res)=>{

    try{
        console.log("1")
        // const loggedInUserId= req.id;
        console.log("2")
        

        const otherUser= await User.find().select("-password");
        console.log("3")
        return res.status(200).json(otherUser)
    } 
    catch(error){
        console.log(error)
    }
}