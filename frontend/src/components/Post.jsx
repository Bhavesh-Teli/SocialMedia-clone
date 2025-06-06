import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { MoreHorizontal, MessageCircle, Send, Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from './ui/badge'

const Post = ({ post }) => {
  console.log("reach post", post);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(`http://localhost:5000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map((post) =>
          post._id === post._id
            ? {
                ...post,
                likes: liked ? post.likes.filter((id) => id !== user?._id) : [...post.likes, user?._id],
              }
            : post
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        const updatedComment = [...comment, res.data.comment];
        setComment(updatedComment);
        const updatedPostData = posts.map((post) =>
          post._id === post._id
            ? {
                ...post,
                comments: updatedComment,
              }
            : post
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/v1/post/delete/${post._id}`, { withCredentials: true });
      if (res.data.success) {
        const updatedPosts = posts.filter((postItem) => postItem?._id !== post?._id);
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author.profile} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <h1>{post.author?.username}</h1>
            {user?._id === post.author._id && <Badge variant="secondary">Author</Badge>}
          </div>
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
            {user && user?._id === post.author._id && (
              <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit">
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img className="rounded-sm my-2 w-full aspect-square object-cover" src={post.image} alt="post_image" />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart size={"22px"} className="cursor-pointer hover:text-red-600" onClick={likeOrDislikeHandler} />
          ) : (
            <FaRegHeart size={"22px"} className="cursor-pointer hover:text-gray-600" onClick={likeOrDislikeHandler} />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">{post.likes.length} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author.username}</span>
        {post.caption}
      </p>

      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {comment.length} comments
        </span>
      )}
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input type="text" placeholder="Add a comment..." className="outline-none text-sm w-full" onChange={changeEventHandler} value={text} />
        {text && (
          <span onClick={commentHandler} className="text-[#3BADF9] cursor-pointer">
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
