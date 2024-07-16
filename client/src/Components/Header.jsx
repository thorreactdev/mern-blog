import { Button, Navbar, TextInput } from "flowbite-react";
import { Link , useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
export default function Header() {
  const path = useLocation().pathname;
  return (
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
      <form>
        <TextInput
          placeholder="Search.."
          type="text"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden outline-none" color="gray" pill>
        <AiOutlineSearch/>
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button color="gray" pill className="w-12 h-10 hidden sm:inline">
            <FaMoon/>
        </Button>
        <Link to="/sign-in">
        <Button gradientDuoTone="purpleToBlue" className="" outline>
            Sign in
        </Button>
        </Link>
        <Navbar.Toggle/>
      </div>
        <Navbar.Collapse>
            <Navbar.Link active={path==="/"} as={"div"}>
                <Link to="/">
                Home
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path==="/about"} as={"div"}>
                <Link to="/about">
                About
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path==="/project"} as={"div"} >
                <Link to="/project">
                Projects
                </Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  );
}
