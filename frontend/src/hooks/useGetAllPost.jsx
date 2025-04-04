import { setPosts } from "../redux/postSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useEffect } from "react";

const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/post/all",{withCredentials:true});
                if (res.data.success) {
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllPost();
    }, [dispatch]);
};

export default useGetAllPost;
