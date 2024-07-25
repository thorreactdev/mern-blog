import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";
import AdminDeleteComment from "../model/AdminDeleteComment";

export default function DashComments() {
    const { currentUser } = useSelector((state)=> state.user);
  const[commentData , setCommentData] = useState([]);
  const[showMore , setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const[showModal , setShowModal] = useState(false);
  const[userid , setUserID] = useState("");
  const[commentIdDelete , setCommentDelete] = useState("");
  console.log(commentData);

  useEffect(()=>{
    const fetchComments = async()=>{
        try {
            setLoading(true);
            const res = await fetch("/api/comment/getcomment");
            const data = await res.json();
            console.log(data);
            if(res.ok){
                setCommentData(data.comments);
                setLoading(false);
                if(data.comments.length < 9){
                    setShowMore(false)
                }
            }else{
                toast.error(data?.message);
                setLoading(false);
            }
        } catch (error) {
            console.log(error.message);
            setLoading(false);
        }
    }
    if(currentUser?.isAdmin){
        fetchComments();
    }
  },[currentUser.isAdmin]);

  const handleShowMore = async()=>{
    const startIndex = commentData?.length;
    console.log(startIndex);
    try {
        setLoading(true);
        const res = await fetch(`/api/comment/getcomment?startIndex=${startIndex}`);
        const data = await res.json();
        console.log(data);
        if(res.ok){
            setCommentData((prev)=> [...prev , ...data.comments]);
            setLoading(false);
            if (data.comments.length < 9) {
                setShowMore(false);
              }
        }
    } catch (error) {
        console.log(error.message);
        setLoading(false);
    }
  }

  const handleDelete = async () =>{
    try {
        const res = await fetch(`/api/comment/deletecomment/${commentIdDelete}`,{
            method : "DELETE"
        });
        const data = await res.json();
        console.log(data);
        if(res.ok){
            setCommentData((prev)=> prev.filter((comment)=> comment._id !== commentIdDelete))
            toast.success(data);
        }
    } catch (error) {
        console.log(error.message);
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

      {currentUser && currentUser?.isAdmin && commentData?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md cursor-pointer">
            <Table.Head>
            <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {commentData?.map((comment) => (
              <Table.Body key={comment?._id} className="divide-y">
                <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                  <Table.Cell>
                    {new Date(comment?.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="capitalize">{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-red-500 cursor-pointer hover:underline"  
                    onClick={()=> {
                        setShowModal(true);
                        setUserID(comment.userId);
                        setCommentDelete(comment._id);
                    }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
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
        <AdminDeleteComment onClose={()=> setShowModal(false)} username={userid} onConfirm={handleDelete} />
      )}
    </div>
  )
}
