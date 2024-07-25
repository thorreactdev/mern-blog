import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { useDispatch , useSelector} from "react-redux";
import { signoutSuccess } from "../app/user/userSlice";
import SignoutPopup from "../model/SignoutPopup";

export default function DashSideBar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState("");
  const[isSignOutPopup , setIsSignOutPopup] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

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
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          <Link to="/dashboard?tab=profile">
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={currentUser?.isAdmin ? "Admin" : "User"}
            labelColor="dark"
            as={"div"}
          >
            Profile
          </Sidebar.Item>
          </Link>
          {currentUser && currentUser?.isAdmin && (
            <Link to="/dashboard?tab=posts">
            <Sidebar.Item 
            active={tab==="posts"}
            icon={HiDocumentText}
            as={"div"}

            >
              Posts
            </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser?.isAdmin && (
            <Link to="/dashboard?tab=dash">
            <Sidebar.Item 
            active={tab==="dash"}
            icon={HiChartPie}
            as={"div"}

            >
              DashBoard
            </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser?.isAdmin && (
            <Link to="/dashboard?tab=comment">
            <Sidebar.Item 
            active={tab==="comment"}
            icon={HiAnnotation}
            as={"div"}

            >
              Comments
            </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser?.isAdmin && (
            <Link to="/dashboard?tab=users">
            <Sidebar.Item 
            active={tab==="users"}
            icon={HiOutlineUserGroup}
            as={"div"}
            >
              Users
            </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            active={tab === ""}
            labelColor="dark"
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={()=> setIsSignOutPopup(true)}
            as={"div"}
          >
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
      {isSignOutPopup && (
        <SignoutPopup onClose={()=> setIsSignOutPopup(false)} onConfirm={handleSignOut} />
      )}
    </Sidebar>
  );
}
