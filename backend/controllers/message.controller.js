import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";


export const sendMessage=async(req,res)=>{
    try {
        const senderId=req.id;
        const receiverId=req.params.id;
        const {textMessage:message}=req.body;
        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        });
        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId,receiverId]
            });
        }
        const newMessage=await Message.create({
            sender:senderId,
            receiver:receiverId,
            text:message,
            
        });
       if(newMessage) conversation.messages.push(newMessage._id);
       await Promise.all([conversation.save(),newMessage.save()]);
       return res.status(200).json({newMessage,success:true});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error",success:false});   
    }
}       

export const getMessages=async(req,res)=>{
    try {
        const senderId=req.id;
        const receiverId=req.params.id;
        const conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate('messages');
        if(!conversation) return res.status(404).json({message:[],success:false});
        return res.status(200).json({messages:conversation.messages,success:true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error",success:false});
    }
}       
