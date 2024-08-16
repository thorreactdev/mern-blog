import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "./Loader";
import Chip from "@mui/material/Chip";
import CallToAction from "./CallToAction";
import CommentSection from "./CommentSection";
// import { toast } from "react-toastify";
import PostCard from "./PostCard";
import { motion, useScroll, useSpring } from "framer-motion";

export default function PostPage() {
  const [postData, setPostData] = useState(null);
  const[recentPost , setRecentPost] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { postSlug } = useParams();
  console.log(postData);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setPostData(data.posts[0]);
          setLoading(false);
          setError(false);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(()=>{
    const fetchRecentPost = async()=>{
      try {
        const res = await fetch("/api/post/getposts?limit=3");
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setRecentPost(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchRecentPost();

  },[]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <main className="flex flex-col p-3 min-h-screen max-w-7xl mx-auto">
       <motion.div className="progress-bar" style={{ scaleX }} />

      <h1 className="text-center text-3xl mt-10 p-3 max-w-2xl mx-auto lg:text-4xl font-medium">
        {postData && postData?.title}
      </h1>
      <Link className="self-center mt-5" to={`/search?category=${postData?.category}`} >
        <Chip
          label={postData && postData?.category}
          variant="filled"
          color="secondary"
          className="uppercase dark:text-white font-medium"
        />
      </Link>
      <img
        src={postData && postData?.image}
        alt={postData?.title}
        className="mt-10 max-h-[600px] w-full rounded-2xl object-cover p-2"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-3xl text-xs">
        <span>
          {postData && new Date(postData?.createdAt).toLocaleDateString()}
        </span>
        <span className="italic font-medium">
          {postData && (postData?.content?.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: postData && postData?.content }}
        className="max-w-3xl mx-auto w-full p-3 post-content"
      ></div>
      <div className="">
        <CallToAction/>
      </div>
      <CommentSection postId={postData?._id} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-2xl uppercase font-medium text-center mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-4 items-center justify-center my-10">
          {recentPost && recentPost?.map((post)=>(
            <PostCard key={post?._id} postData={post}/>
          ))}
        </div>
      </div>
      {error && <p>{error}</p>}
    </main>
  );
}
