import { Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { Footer } from 'flowbite-react';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';

export default function Foooter() {
  return (
    <footer>
      <div className="flex flex-col sm:flex-row justify-between shadow-2xl dark:bg-[#1f2937] border-t-2 border-teal-500 dark:text-white p-7 sm:p-16 cursor-pointer mt-5 gap-20">
      <div>
        <Link to="/" className="font-bold dark:text-white text-3xl">
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Vinay{"'"}s
          </span>
          Blog
        </Link>
      </div>
      <div className="flex gap-16 flex-wrap">
        <div className="flex gap-3 flex-col">
          <h1 className="text-xl font-medium">About</h1>
          <span>100JS Project</span>
          <span>Vinay Blog</span>
        </div>
        <div className="flex gap-3 flex-col">
          <h1 className="text-xl font-medium">Follow</h1>
          <span>Github</span>
          <span>Instagram</span>
        </div>
        <div className="flex gap-3 flex-col">
          <h1 className="text-xl font-medium">Legal</h1>
          <span>Privacy Policy</span>
          <span>Terms & Condition</span>
        </div>
      </div>
      </div>
      <Divider sx={{ color : "#FFF" , backgroundColor : "#fff"}}/>
      <div className="flex justify-between items-center px-10 py-3 bg-white dark:bg-[#1f2937]">
      <Footer.Copyright
            href='#'
            by="Vinay's blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0  sm:justify-center items-center">
            <Footer.Icon href='#' icon={BsFacebook}/>
            <Footer.Icon href='#' icon={BsInstagram}/>
            <Footer.Icon href='#' icon={BsTwitter}/>
            <Footer.Icon href='https://github.com/thorreactdev' icon={BsGithub}/>
            {/* <Footer.Icon href='#' icon={BsDribbble}/> */}

          </div>
      </div>
    
    </footer>
  );
}
