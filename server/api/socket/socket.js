import { Server } from "socket.io";

import http from "http";
import express from "express"
const app= express();
const server= http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:['http://localhost:5173'],
        methods:['GET','POST']
    },
});
export const getReceiverSocketId=(receiverId)=>{
    return userSocketMap[receiverId]
}
const userSocketMap={} // userId ->socket Id store user id 





io.on('connection',(socket)=>{
    console.log("User connected",socket.id)
    const userId=socket.handshake.query.userId
    console.log("User Id from frontd received at backed",userId)
    if(userId!==undefined){
        userSocketMap[userId]=socket.id;
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap)) // send data to front how many user are online
    socket.on('disconnect',()=>{
        console.log("user disConnected",socket.id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap))
    })
})

export {app, io, server}