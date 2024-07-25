import { Button } from "flowbite-react";
import jsprojectimage from "../assets/Top-10-JavaScript-Project-Ideas-For-Beginners-2023.png";
export default function CallToAction() {
  return (
    <div className="relative mx-auto w-full">
    <img src={jsprojectimage} alt="Tech Blog" className="w-full lg:h-[500px] h-full object-cover rounded-tl-3xl rounded-br-3xl" />
    <div className="absolute inset-0 bg-black bg-opacity-70 dark:bg-opacity-50 flex flex-col items-center justify-center text-center text-white p-6 rounded-tl-3xl rounded-br-3xl">
      <h2 className="text-2xl sm:text-4xl font-bold mb-4">Discover the Latest in Tech</h2>
      <p className="text-sm sm:text-xl text-white font-semibold mb-6 max-w-3xl capitalize">
        Stay updated with the latest articles on React, Node.js, Next.js, and more. Enhance your skills and keep up with the ever-evolving tech world.
      </p>
      <Button gradientDuoTone="purpleToPink" className="p-1">
        Read More
      </Button>
    </div>
  </div>
  )
}
