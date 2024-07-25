import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toogleTheme } from "../app/theme/themeSlice";
import { signoutSuccess } from "../app/user/userSlice";
import { useEffect, useState } from "react";
import SignoutPopup from "../model/SignoutPopup";
import Contact from "./Contact";


export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const path = useLocation().pathname;
  const location = useLocation();
  const [isSignOutPopup, setIsSignOutPopup] = useState(false);
  const[isContactPopup , setIsContactPopup] = useState(false);
  const[searchTerm , setSearchTerm] = useState("");

  useEffect(()=>{
    const urlParam = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParam.get("searchTerm");
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  },[location.search]);



  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchTermString = urlParams.toString();
    console.log(searchTermString);
    navigate(`/search?${searchTermString}`);
  }




  return (
    <div className="sticky top-0 left-0 z-20">
      <Navbar className="shadow-lg">
        <Link
          to="/"
          className="whitespace-nowrap text-sm sm:text-lg font-semibold dark:text-white self-center"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Vinay{"'"}s
          </span>
          Blog
        </Link>
        <form onSubmit={handleSubmit}>
          <TextInput
            placeholder="Search.."
            type="search"
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
            onChange={(e)=> setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </form>
        <Button className="w-12 h-10 lg:hidden outline-none" color="gray" pill>
          <AiOutlineSearch />
        </Button>
        <div className="flex gap-2 md:order-2">
          <Button
            color="gray"
            pill
            className="w-12 h-10 hidden sm:inline"
            onClick={() => dispatch(toogleTheme())}
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
          </Button>
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  img={currentUser?.profilePicture}
                  rounded
                  alt="user_profile"
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser?.username}</span>
                <span className="font-medium block text-sm truncate">
                  {currentUser?.email}
                </span>
              </Dropdown.Header>

              {currentUser && currentUser.isAdmin && (
                <Link to="/dashboard?tab=dash">
                  <Dropdown.Item>Dashboard</Dropdown.Item>
                </Link>
              )}
              <Dropdown.Divider />

              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>

              <Dropdown.Divider />

              <Link>
                <Dropdown.Item onClick={() => setIsSignOutPopup(true)}>
                  Sign Out
                </Dropdown.Item>
              </Link>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" className="" outline>
                Sign in
              </Button>
            </Link>
          )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to="/about">About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/project"} as={"div"}>
            <Link to="/project">Projects</Link>
          </Navbar.Link>
          <Navbar.Link>
            <span 
            onClick={()=> setIsContactPopup(true)} 
            className="cursor-pointer"
            >
              Contact
            </span>
          </Navbar.Link>
         

          
        </Navbar.Collapse>
      </Navbar>
      {isSignOutPopup && (
        <SignoutPopup
          onClose={() => setIsSignOutPopup(false)}
          onConfirm={handleSignOut}
        />
      )}

      {isContactPopup && <Contact open={isContactPopup} onClose={()=> setIsContactPopup(false)} scroll="paper" />}
    </div>
  );
}
