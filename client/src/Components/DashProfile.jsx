import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import SignoutPopup from "../model/SignoutPopup";
import DeletePopup from "../model/DeletePopup";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { toast } from "react-toastify";
import { updateStart, updateFailure , updateSuccess, signoutSuccess, deleteUserSuccess, deleteUserFailure, deleteUserStart } from "../app/user/userSlice";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isSignOutPopupOpen, setIsSignOutPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const fileRef = useRef();
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  
  console.log(currentUser);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 3MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileURL(null);
        setImageFileUploading(false);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
          toast.success("File Uploaded SuccessFully");
        });
      }
    );
  };

  // USER OPERATION

  const handleUpdateUser = async(e)=>{
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast.error('No changes made');
      return;
    }
    if (imageFileUploading) {
      toast.warning('Please wait for image to upload');
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method : "POST",
        headers:{
          "Content-Type" : "application/json"
        },
        body:JSON.stringify(formData)
      })
      const data = await res.json();
      if(!res.ok){
        dispatch(updateFailure(data?.message));
        toast.error(data.message);
      }else{
        dispatch(updateSuccess(data));
        toast.success("Profile Updated");
      }
    } catch (error) {
      dispatch(updateFailure(error?.message));
      toast.error(error.message);
    }
  }

  const handleSignOut = async() =>{
    try {
      const res = await fetch("/api/user/signout",{
        method : "POST",
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data);
      }else{
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async() =>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method : "DELETE"
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(deleteUserFailure(data?.message));
      }else{
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserSuccess(error.message));
    }
  }




  return (
    <div className="max-w-lg mx-auto w-full p-3">
      <h1 className="font-semibold text-3xl text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdateUser}>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          hidden
          onChange={handleImageChange}
        />
        <div
          className="w-32 h-32 shadow-lg relative rounded-full self-center"
          onClick={() => fileRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={
                imageFileUploadProgress < 100
                  ? imageFileUploadProgress
                  : "" || 0
              }
              text={`${
                imageFileUploadProgress < 100
                  ? `${imageFileUploadProgress}%`
                  : ""
              }`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={ imageFileURL || currentUser?.profilePicture}
            alt="user_profile"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          placeholder="Enter your name"
          defaultValue={currentUser?.username}
          id="username"
          onChange={handleChange}
        />
        <TextInput
          type="email"
          placeholder="Enter your email"
          defaultValue={currentUser?.email}
          id="email"
          onChange={handleChange}
        />
        <TextInput
          type="password"
          placeholder="Password..."
          id="password"
          onChange={handleChange}
        />
         <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          disabled={loading || imageFileUploading}
          className="uppercase"
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
        {
          currentUser && currentUser.isAdmin &&(
            <Link to="/create-post">
            <Button type="button" gradientDuoTone="purpleToPink" outline className="uppercase w-full">
              Create a post
            </Button>
            </Link>
          )
        }
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span
          className="text-sm cursor-pointer"
          onClick={() => setIsDeletePopupOpen(true)}
        >
          Delete Account
        </span>
        <span
          className="text-sm cursor-pointer"
          onClick={() => setIsSignOutPopupOpen(true)}
        >
          Sign Out
        </span>
      </div>

      {isSignOutPopupOpen && (
        <SignoutPopup
          onClose={() => setIsSignOutPopupOpen(false)}
          onConfirm={handleSignOut}
        />
      )}
      {isDeletePopupOpen && (
        <DeletePopup
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
