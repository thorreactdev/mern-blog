import { useEffect, useState } from "react"
import Loader from "../Components/Loader";
import PostCard from "./PostCard";

export default function PostSection() {
    const[postData ,setPostData]=useState([]);
    const[loading , setLoading] = useState(false);
    const[hooks , setHooks] = useState([]);
    useEffect(()=>{
        const fetchPost = async()=>{
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts`);
                const data = await res.json();
                console.log(data);
                if(res.ok){
                    setPostData(data.posts);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error.message);
                setLoading(false);
            }
        }
        const fetchHookPost = async()=>{
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?category=react hooks`);
                const data = await res.json();
                console.log(data);
                if(res.ok){
                    setHooks(data.posts);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error.message);
                setLoading(false);
            }
        }


        fetchPost();
        fetchHookPost();

    },[]);
  return (
    <div className="max-w-7xl mx-auto mt-7 pb-7 flex flex-col items-center justify-center">
        {loading && (
            <Loader/>
        )}
        {
            !loading && (
                <h1 className="text-xl sm:text-2xl mb-7 mt-3 text-center font-semibold">Recent Post</h1>
            )
        }
        <div className="flex flex-wrap gap-4 items-center justify-center">
        {postData && postData?.map((post)=>(
            <PostCard key={post._id} postData={post}/>
        ))}
        </div>
        { !loading && (
            <h1 className="text-xl sm:text-2xl mb-7 mt-7 text-center font-semibold">Recent React Hooks Post</h1>
        )}
        <div className="flex flex-wrap gap-4 items-center justify-center">
        {hooks && hooks?.map((post)=>(
            <PostCard key={post._id} postData={post}/>
        ))}
        </div>
    </div>
  )
}
