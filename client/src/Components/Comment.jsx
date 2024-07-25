import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import DeleteCommentModel from "../model/DeleteCommentModel";

// eslint-disable-next-line react/prop-types
export default function Comment({ comment, onLike , onEdit, onDelete}) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const[isEditing , setIsEditing] = useState(false);
  const[editContent , setEditContent] = useState(comment?.content);
  const[modelOpen , setModelOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        // eslint-disable-next-line react/prop-types
        const res = await fetch(`/api/user/getcommentuser/${comment?.userId}`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () =>{
    setIsEditing(!isEditing);
    setEditContent(comment?.content);
  }

  const handleSave = async()=>{
    try {
      const res = await fetch(`/api/comment/editcomment/${comment._id}`,{
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({content : editContent})
      });
      if(res.ok){
        setIsEditing(!isEditing);
        onEdit(comment , editContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="flex border-b dark:border-gray-600 text-sm  p-4">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user?.profilePicture}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1 gap-2">
          <span className="font-bold text-xs truncate">
            {user ? `@${user?.username}` : "anonymous user"}
          </span>
          <span className="text-xs text-gray-500 dark:text-white">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
       
          <Textarea 
          value={editContent} 
          onChange={(e)=>setEditContent(e.target.value)}
          className="mb-2 mt-2"
          />
          <div className='flex justify-end gap-2 text-xs'>
          <Button
            type='button'
            size='sm'
            gradientDuoTone='purpleToBlue'
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            type='button'
            size='sm'
            gradientDuoTone='purpleToBlue'
            outline
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
        </>
        ):(
          <>
           <p className="text-gray-500 pb-2 dark:text-white capitalize">
          {comment.content}
        </p>
        <div className="flex gap-1 items-center pt-2">
          <button
            type="button"
            onClick={() => onLike(comment?._id)}
            className={`text-gray-400 hover:text-blue-500 ${
              currentUser &&
              comment?.likes?.includes(currentUser._id) &&
              "!text-blue-500"
            }`}
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <p className="text-xs text-gray-500 dark:text-white">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                " " +
                (comment.numberOfLikes === 1 ? "like" : "likes")}
          </p>
          {currentUser && (currentUser._id === comment.userId || currentUser?.isAdmin) && (
            <button type="button" className="text-xs ml-2 text-gray-500 dark:text-white hover:text-blue-800 dark:hover:text-blue-600" onClick={handleEdit} >
              Edit
            </button>
          )}
          {currentUser && (currentUser._id === comment.userId || currentUser?.isAdmin) && (
            <button type="button" className="text-xs ml-2 text-gray-500 dark:text-white hover:text-blue-800 dark:hover:text-blue-600" onClick={()=> setModelOpen(true)} >
              Delete
            </button>
          )}
        </div>
          </>
        )}
       
      </div>
      {modelOpen && <DeleteCommentModel onClose={()=> setModelOpen(false)} onConfirm={()=> onDelete(comment?._id)}/>}
    </div>
  );
}
