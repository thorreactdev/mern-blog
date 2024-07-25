import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { FaCheck , FaTimes} from "react-icons/fa";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import AdminDeleteUserPopup from "../model/AdminDeleteUserPopup";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMoreData, setShowMore] = useState(true);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const[showModal  , setShowModal] = useState(false);
  const [usernameToDelete, setUsernameToDelete] = useState('');
 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if(data?.users?.length < 9){
            setShowMore(false);
          }
        } else {
          toast.error("Error Fetching Users");
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
      fetchUsers();
    }
  }, [currentUser?._id, currentUser?.isAdmin]);

  const showMore = async () => {
    try {
      const startIndex = users?.length;
      console.log(startIndex);
      const res = await fetch(
        `/api/user/getusers?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data?.users?.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () =>{
    try {
        const res = await fetch(`/api/user/delete/${userIdToDelete}`,{
            method : "DELETE"
        });
        const data = await res.json();
        if(res.ok){
            toast.success(data);
            setUsers((prev)=> prev.filter((user)=> user._id !== userIdToDelete))
        }else{
            toast.error("Error Deleting User");
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

      {currentUser && currentUser?.isAdmin && users?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md cursor-pointer">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>User name</Table.HeadCell>
              <Table.HeadCell>User Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users?.map((user) => (
              <Table.Body key={user?._id} className="divide-y">
                <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                  <Table.Cell>
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    
                      <img
                        src={user?.profilePicture}
                        alt="post_image"
                        className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                      />
                  </Table.Cell>
                  <Table.Cell>
                      {user?.username}
                  </Table.Cell>
                  <Table.Cell>
                      {user?.email}
                  </Table.Cell>
                  <Table.Cell className="uppercase">
                    {user?.isAdmin ? <FaCheck className="text-green-500"/> : <FaTimes className="text-red-500"/>}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-red-500 cursor-pointer hover:underline"  
                    onClick={()=>{
                      setShowModal(true);
                      setUserIdToDelete(user._id);
                      setUsernameToDelete(user?.username)
                    }}
                    >
                      Delete
                    </span>
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
            No Users To Show
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
        <AdminDeleteUserPopup username={usernameToDelete} onClose={()=> setShowModal(false)} onConfirm={handleDeleteUser}/>
      )}
    </div>
  );
}
