import { Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Comment from "./Comment";

// eslint-disable-next-line react/prop-types
export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentData, setCommentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment?.length > 200) {
      return toast.error("Comment Length cannot be greater than 200 chars");
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/comment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser?._id
        })
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setComment("");
        toast.success("Comment Posted");
        setLoading(false);
        setCommentData(prevComments => [data, ...prevComments]);
      } else {
        toast.error(data?.message || "error Posting Comment");
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setCommentData((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, likes: data.likes, numberOfLikes: data.likes.length }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleEdit = async (comment, editedContent) => {
    setCommentData(
      commentData.map((c) =>
        c._id === comment._id ? { ...c , content: editedContent } : c
      )
    );
  };

  const handleDelete = async(commentId) =>{
    console.log(commentId);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/deletecomment/${commentId}`,{
        method : "DELETE"
      });
      const data = await res.json();
      console.log(data);
      if(res.ok){
        setCommentData(prevComments => prevComments.filter(comment => comment._id !== commentId));
        toast.success(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/comment/getcomment/${postId}`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setCommentData(data);
          setLoading(false);
        } else {
          toast.error("Something Went Wrong");
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  return (
    <div className="max-w-2xl mx-auto w-full my-5">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 dark:text-gray-100 text-gray-500 text-sm  ">
          <p>Signed in as:</p>
          <img
            src={currentUser?.profilePicture}
            alt="profile_image"
            className="w-5 h-5 rounded-full"
          />
          <Link to="/dashboard?tab=profile">
            <p className="text-sm text-cyan-600 dark:text-green-500 hover:underline">
              @{currentUser?.username}
            </p>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center my-12">
          <p className="text-xl font-medium">
            You must be signed in to comment
          </p>
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToPink" className="w-[300px]">
              Sign In
            </Button>
          </Link>
        </div>
      )}

      {currentUser && (
        <form onSubmit={handleSubmit} className="shadow-md dark:shadow-indigo-700  border border-teal-500 p-4 rounded-lg w-full">
          <Textarea
            placeholder="Write Your Comments Here..."
            id="comment"
            rows={5}
            cols={4}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            maxLength="200"
            className="p-3"
          />
          <div className="flex justify-between mt-5 items-center">
            <p className="text-sm text-gray-500 dark:text-white">{200 - comment.length} Character Remaining</p>
            <Button gradientDuoTone="purpleToBlue" type="submit" outline disabled={loading} >
              {loading ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      )}
      {commentData && commentData.length === 0 ? (
        <p className="text-sm my-5">No Comments Yet..</p>
      ) : (
        <>
          <div className="flex items-center gap-2 my-5 text-sm">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-3 rounded-sm">
              <p>{commentData.length}</p>
            </div>
          </div>
          {commentData?.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </>
      )}
    </div>
  );
}
