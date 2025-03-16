import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { MoreHorizontal, MessageCircle, Send, Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

const Post = () => {
    const [text,setText]=useState("");
    const [open,setOpen]=useState(false);
    const changeEventHandler=(e)=>{
        const inputText=e.target.value;
        if(inputText.trim()){ 
            setText(inputText);
        }else{
          setText("")
        }
    }
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>Username</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Add to favorites
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src="data:image/jpeg;base64,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"
        alt="post_image"
      />

      <div className="flex items-center justify-between my-">
        <div className="flex items-center gap-3">
          <FaRegHeart size={"22px"} />
          <MessageCircle onClick={()=>setOpen(true)} className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span  className="font-medium block mb-2">1k likes</span>
      <p>
        <span className="font-medium mr-2">Username</span>
        caption
      </p>
      <span onClick={()=>setOpen(true)} className="cursor-pointer text-sm text-gray-400">View all 100 comments</span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
         type="text" 
         placeholder="Add a comment..." 
         className="outline-none text-sm w-full" 
         onChange={changeEventHandler}
         value={text}
         />
       {text && <span className="text-[#3BADF9]">Post</span>}
      </div>
    </div>
  );
};

export default Post;
