import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup} from "react-icons/hi"
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
 

export default function AdminDashBoard() {
    const[user , setUser] = useState([]);
    const[post , setPost] = useState([]);
    const[comment , setComment] = useState([]);
    const[totaluser , setTotalUser] = useState(0);
    const[totalPost , setTotalPost] = useState(0);
    const[totalcomments , setTotalcomments] = useState(0);
    const[lastMonthUser , setLastMonthUser] = useState(0);
    const[lastMonthPost , setLastMonthPost] = useState(0);
    const[lastMonthComment , setLastMonthComment] = useState(0);
    const { currentUser } = useSelector((state)=> state.user);

    console.log(totaluser);

    useEffect(()=>{

        const fetchUser = async()=>{
            try {
                const res = await fetch("/api/user/getusers");
                const data = await res.json();
                console.log(data);
                if(res.ok){
                    setUser(data.users);
                    setTotalUser(data.totalUsers);
                    setLastMonthUser(data.lastMonthUser);
                }else{
                    toast.error(data.message || "Erro Fetching Data");
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        const fetchPost = async()=>{
            try {
                const res = await fetch("/api/post/getposts");
                const data = await res.json();
                console.log(data);
                if(res.ok){
                    setPost(data.posts);
                    setTotalPost(data.totalPosts);
                    setLastMonthPost(data.lastMonthPosts);
                }else{
                    toast.error(data.message || "Erro Fetching Data");
                }
            } catch (error) {
                console.log(error.message)
            }

        }
        const fetchComment = async()=>{
            try {
                const res = await fetch("/api/comment/getcomment");
                const data = await res.json();
                console.log(data);
                if(res.ok){
                    setComment(data.comments);
                    setTotalcomments(data.totalComments);
                    setLastMonthComment(data.lastMonthComments);
                }else{
                    toast.error(data.message || "Erro Fetching Data");
                }
            } catch (error) {
                console.log(error.message)
            }

        }

        if(currentUser?.isAdmin){
            fetchUser();
            fetchPost();
            fetchComment();
        }

    },[currentUser]);




  return (
    <div className="main p-3 md:mx-auto mt-2">
    <div className="flex flex-wrap justify-center gap-4 w-full">
        <div className="first flex flex-col p-3 dark:bg-slate-800 rounded-md shadow-lg md:w-72 w-full ">
            <div className="flex justify-between">
                <div>
                    <h2 className="text-gray-500 text-md uppercase">Total Users</h2>
                    <p className="text-2xl">{totaluser}</p>
                </div>
                    <HiOutlineUserGroup className="text-white bg-teal-600 rounded-full text-5xl p-3 shadow-lg"/>
            </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-green-500 flex items-center">
                        <HiArrowNarrowUp/>
                        {lastMonthUser}
                    </span>
                    <div className="text-gray-500">Last Month</div>
                </div>
        </div>
        <div className="second flex flex-col p-3 dark:bg-slate-800 rounded-md shadow-lg md:w-72 w-full ">
            <div className="flex justify-between">
                <div>
                    <h2 className="text-gray-500 text-md uppercase">Total Comments</h2>
                    <p className="text-2xl">{totalcomments}</p>
                </div>
                    <HiAnnotation className="text-white bg-indigo-600 rounded-full text-5xl p-3 shadow-lg"/>
            </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-green-500 flex items-center">
                        <HiArrowNarrowUp/>
                        {lastMonthComment}
                    </span>
                    <div className="text-gray-500">Last Month</div>
                </div>
        </div>
        <div className="third flex flex-col p-3 dark:bg-slate-800 rounded-md shadow-lg md:w-72 w-full sm:w-full">
            <div className="flex justify-between">
                <div>
                    <h2 className="text-gray-500 text-md uppercase">Total Posts</h2>
                    <p className="text-2xl">{totalPost}</p>
                </div>
                    <HiDocumentText className="text-white bg-lime-600 rounded-full text-5xl p-3 shadow-lg"/>
            </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-green-500 flex items-center">
                        <HiArrowNarrowUp/>
                        {lastMonthPost}
                    </span>
                    <div className="text-gray-500">Last Month</div>
                </div>
        </div>
    </div>

    <div className="flex flex-wrap gap-4 py-7 mx-auto justify-center">
        <div className="flex flex-col rounded-md shadow-lg p-3 w-full md:w-auto dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
                <h1 className="uppercase">Recent users</h1>
                <Link to="/dashboard?tab=users">
                <Button gradientDuoTone="purpleToBlue" outline >
                    See all
                </Button>
                </Link>
            </div>
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>User Image</Table.HeadCell>
                    <Table.HeadCell>User Name</Table.HeadCell>
                </Table.Head>
                {user.map((users)=>(
                    <Table.Body key={users._id} className="divide-y">
                        <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                            <Table.Cell>
                                <img src={users.profilePicture} alt={users.username} className="w-10 h-10 rounded-full"/>
                            </Table.Cell>
                            <Table.Cell>
                                {users?.username}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                ))}
            </Table>
        </div>
        <div className="flex flex-col rounded-md shadow-lg p-3 w-full md:w-auto dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
                <h1 className="uppercase">Recent Comment</h1>
                <Link to="/dashboard?tab=comment">
                <Button gradientDuoTone="purpleToBlue" outline >
                    See all
                </Button>
                </Link>
            </div>
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>Content</Table.HeadCell>
                    <Table.HeadCell>Likes</Table.HeadCell>
                </Table.Head>
                {comment.map((comments)=>(
                    <Table.Body key={comments._id} className="divide-y">
                        <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                            <Table.Cell className="w-96" >
                                <p className="line-clamp-2 capitalize">{comments?.content}</p>
                            </Table.Cell>
                            <Table.Cell>
                                {comments?.numberOfLikes}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                ))}
            </Table>
        </div>
        <div className="flex flex-col rounded-md shadow-lg p-3 w-full md:w-auto dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
                <h1 className="uppercase">Recent post</h1>
                <Link to="/dashboard?tab=posts">
                <Button gradientDuoTone="purpleToBlue" outline >
                    See all
                </Button>
                </Link>
            </div>
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>Post Image</Table.HeadCell>
                    <Table.HeadCell>Post Title</Table.HeadCell>
                    <Table.HeadCell>Post Category</Table.HeadCell>
                </Table.Head>
                {post.map((posts)=>(
                    <Table.Body key={posts._id} className="divide-y">
                        <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                            <Table.Cell>
                                <img src={posts.image} alt={posts.title} className="w-20 h-10 "/>
                            </Table.Cell>
                            <Table.Cell className="w-auto">
                               <p className="line-clamp-2">{posts.title}</p>
                            </Table.Cell>
                            <Table.Cell>
                                <p className="uppercase">{posts.category}</p>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                ))}
            </Table>
        </div>
    </div>

    </div>
  )
}
