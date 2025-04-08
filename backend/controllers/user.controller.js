import bcrypt from "bcryptjs";
import { User } from "../models/user.models.js";
import {getDataUri} from "../utils/datauri.js";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({ message: "User already exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: "Account created successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "All fields are required", success: false });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password", success: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password", success: false });
    }
   
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const populatedPosts=await Promise.all(
        user.posts.map(async(postId)=>{
            const post=await Post.findById(postId);
            if(post.author.equals(user._id)){
                return post;
            }
            return null;
        })
    )
    user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: populatedPosts,
      };
    return res
      .cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 30 * 24 * 60 * 60 * 1000 })
      .json({ message: `Welcome back ${user.username}`, success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params.id;
    const user = await User.findById(userId);

    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found", success: false });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({ message: "Profile updated successfully", success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
    if (!suggestedUsers) {
      return res.status(401).json({ message: "Currently do not have any users", success: false });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const followOrUnfollow=async(req,res)=>{
  try {
    const followkarneWalaId=req.id;
    const whomToFollowId=req.params.id;
    if(followkarneWalaId===whomToFollowId){
      return res.status(401).json({message:'You cannot follow/unfollow yourself',success:false})
    }
    const user=await User.findById(followkarneWalaId);
    const targetUser=await User.findById(whomToFollowId);
    if(!user || !targetUser){
      return res.status(401).json({message:'User not found',success:false})
    }
   const isFollowing=user.following.includes(whomToFollowId);
   if(isFollowing){
    //unfollow
    await Promise.all([
     User.updateOne({_id:followkarneWalaId},{$pull:{following:whomToFollowId}}),
     User.updateOne({_id:whomToFollowId},{$pull:{followers:followkarneWalaId}})
    ])
    return res.status(200).json({message:'Unfollowed successfully',success:true})
   } else{
    //follow
    await Promise.all([
      User.updateOne({_id:followkarneWalaId},{$push:{following:whomToFollowId}}),
      User.updateOne({_id:whomToFollowId},{$push:{followers:followkarneWalaId}})
    ])
    return res.status(200).json({message:'Followed successfully',success:true})
   }
  } catch (error) {
    console.log(error);
    res.status(500).json({message:'Internal server error',success:false})
  }
}
