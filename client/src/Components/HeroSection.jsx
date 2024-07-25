import { Button } from "flowbite-react";
import { useState } from "react";
import SubscribeModal from "../model/SubscribeModal";
import { Link } from "react-router-dom";


export default function HeroSection() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  return (
    <div className="max-w-6xl p-12 md:p-28 mx-auto flex flex-col gap-3 mb-5">
        <h1 className="text-3xl lg:text-6xl font-bold text-slate-700 dark:text-white">Welcome To My Tech Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm max-w-xl capitalize font-medium">Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages</p>
        <div className="flex gap-3 mt-2">
            <Button gradientDuoTone="purpleToPink" onClick={handleClickOpen}>Subscribe</Button>
            <Link to="/search">
            <Button gradientDuoTone="purpleToBlue"  >Explore Post</Button>
            </Link>
        </div>
        {open && <SubscribeModal open={open} handleClose={handleClose}/>}
    </div>
  )
}
