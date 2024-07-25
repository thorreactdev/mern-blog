import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import DeletePostPopup from "../model/DeletePostPopup";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMoreData, setShowMore] = useState(true);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const[showModal  , setShowModal] = useState(false);
  console.log(postData);

  console.log(postIdToDelete);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        console.log(data.posts);
        if (res.ok) {
          setPostData(data.posts);
        } else {
          toast.error("Error Fetching Posts");
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchPost();
    }
  }, [currentUser?._id, currentUser?.isAdmin]);

  const showMore = async () => {
    try {
      const startIndex = postData?.length;
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setPostData((prev) => [...prev, ...data.posts]);
        if (data?.posts?.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async() =>{
    try {
      const res = await fetch(`/api/post/delete/${postIdToDelete}/${currentUser._id}`,{
        method : "DELETE"
      });
      console.log(res);
      const data = await res.json();
      if(res.ok){
        toast.success(data);
        setPostData((prev)=> prev.filter((post)=> post._id !== postIdToDelete))
      }else{
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-800 ">
      {loading && (
        <div className="flex items-center justify-center mt-4 mb-5 flex-col gap-2">
          <Loader />
          <span>Wait Loading</span>
        </div>
      )}

      {currentUser && currentUser?.isAdmin && postData?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md cursor-pointer">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Post Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {postData?.map((post) => (
              <Table.Body key={post?._id} className="divide-y">
                <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                  <Table.Cell>
                    {new Date(post?.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/posts/${post?.slug}`}>
                      <img
                        src={post?.image}
                        alt="post_image"
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/posts/${post?.slug}`}
                      className="capitalize font-medium text-gray-900 dark:text-white"
                    >
                      {post?.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="uppercase">
                    {post?.category}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-red-500 cursor-pointer hover:underline"  
                    onClick={()=>{
                      setShowModal(true);
                      setPostIdToDelete(post._id);
                    }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline font-medium"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMoreData && (
            <button
              onClick={showMore}
              className='w-full text-teal-500 self-center text-sm uppercase font-medium py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        !loading && (
          <div className="flex flex-col gap-3 items-center justify-center my-20">
          <h1 className="text-4xl md:text-7xl font-extrabold text-center custom-text">OOPS!</h1>
          <p className="font-semibold text-3xl">
            No Posts To Show
          </p>
          <Link to="/">
          <Button className="mt-2 w-[200px]" gradientDuoTone="purpleToPink" >
            Go To Home
          </Button>
          </Link>
          </div>
        )
      )}
      {showModal && (
        <DeletePostPopup onClose={()=> setShowModal(false)}  onConfirm={handleDeletePost}/>
      )}
    </div>
  );
}
