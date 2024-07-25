import { Chip } from "@mui/material";
import image from "../assets/portfolio.jpg";
import { Button } from "flowbite-react";

export default function Projects() {
  return (
    <div className="max-w-[450px] mx-auto rounded-lg  shadow-xl">
      <div>
        <img src={image} alt="" className="w-full h-full rounded-lg"/>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <h1 className="font-medium text-lg  cursor-pointer line-clamp-2">Mastering the Node.js HTTP Module: A Comprehensive Guide</h1>
        <div className="flex gap-2 items-center">
          <p className="font-medium">Post Category : </p>
           <Chip label="React"/>
        </div>
        <a href="">
        <Button className="mt-2 mb-2 w-full" gradientDuoTone="purpleToPink">
          Read Blog
        </Button>
        </a>
      </div>
    </div>
  )
}
