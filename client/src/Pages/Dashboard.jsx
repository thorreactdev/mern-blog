import { useLocation } from "react-router-dom";
import DashSideBar from "../Components/DashSideBar";
import { useEffect, useState } from "react";
import DashProfile from "../Components/DashProfile";
import DashPosts from "../Components/DashPosts";
import DashUsers from "../Components/DashUsers";
import DashComments from "../Components/DashComments";
import AdminDashBoard from "../Components/AdminDashBoard";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSideBar/>
      </div>
      {tab==="profile" && <DashProfile/>}
      {tab==="posts" && <DashPosts/>}
      {tab==="users" && <DashUsers/>}
      {tab==="comment" &&<DashComments/>}
      {tab==="dash" && <AdminDashBoard/>}
    </div>
  )
}
