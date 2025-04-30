import { Conversation } from "../model/conversationModel.js";
import { Message } from "../model/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage= async(req,res)=>{
    try {
        // console.log("user",req)
        const senderId= req.user.id; 
        const receiverId=req.params.id;
        const {message}= req.body;
        console.log("senderId",senderId);
        console.log("receiverId",receiverId);
        // console.log("message",message);
        let  gotConversation= await Conversation.findOne(
            {
                participants:{$all:[senderId,receiverId]}
            }
        );
        if(!gotConversation){
            gotConversation= await Conversation.create({
                participants:[senderId,receiverId]
            })
        };

        const newMessage= await Message.create({
            senderId,receiverId,
            message
        })
        if(newMessage){
            gotConversation.messages.push(newMessage._id);

        };
        await gotConversation.save(); 
        // socket Io
        const receiverSocketId=getReceiverSocketId(receiverId);

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)  // send message to receiver using receiver socket Id
        }

        return res.status(201).json({
           newMessage
        })

        
    } catch (error) {
        console.log(error)
        
    }
}
export const getMessage= async(req,res)=>{
    try {
        console.log("req.url",req.url)
        // console.log("req.data",req.query)
        const receiverId= req.query.receiverId;
        // console.log("receiver Id",receiverId)
        // console.log("Get Message",req.user.id)
        const senderId= req.query.senderId;
        // console.log("senderId",senderId)
        const conversation= await Conversation.find({
            participants:{$all:[senderId,receiverId]}

        }).populate("messages")
        // console.log(conversation[0]?.messages);
        return res.status(200).json(conversation[0]?.messages)
    } catch (error) {
        console.log(error) 
    }

}