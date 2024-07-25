import * as React from 'react';
import {Button, Textarea, TextInput} from 'flowbite-react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import genz from "../assets/gen-z-suffering-hangover.jpg";
import web from "../assets/web-dev.jpg";
import api from "../assets/api-integration.jpg";
import ecom from "../assets/exom-solution.jpg";
import portfolio from "../assets/portfolio.jpg";
import {toast} from "react-toastify";
import { Link } from "react-router-dom";


// eslint-disable-next-line react/prop-types
export default function Contact({ open, onClose, scroll }) {
  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const[email , setEmail] = React.useState("");
  const[message , setMessage] = React.useState("");

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      const res = await fetch("/api/contact/contactdata",{
        method : "POST",
        headers:{
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({email , message})
      });
      const data = await res.json();
      if(res.ok){
        toast.success(data?.message);
        setEmail("");
        setMessage("");
      }else{
        toast.error(data?.message || "Error Contacting");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  const emaildata = "prajapativinay140404@gmail.com";
  const name = "For Freelance Project"
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${emaildata}&su=Regarding ${name}&body`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      className='scroll'
      sx={{ padding : 0 , }}
    >
      <DialogContent dividers={scroll === 'paper'} sx={{ padding : 0 }} >
      <div className="relative">
          <img src={genz} alt="Freelance Developer" className="w-full h-full" />
          <div className="absolute inset-0 bg-black opacity-70 flex items-center justify-center flex-col">
            <h2 className="text-2xl font-bold text-white relative">Looking for a Freelance Developer?</h2>
            <span className='text-white text-2xl font-bold'>You are at Right Place</span>
          </div>
        </div>
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <div className='p-3'>
          {/* <h2 className="text-2xl font-bold mb-4">Looking for a Freelance Developer?</h2> */}
          <p className="mb-4 text-center font-semibold text-slate-600 uppercase">Let's Build Something Amazing Together!</p>
          <p className="mb-4 capitalize">
            Hi, I'm Vinay , a passionate freelance Web developer with 1 years of experience in <span className='bg-slate-600 px-2 py-1 rounded-t-md text-white'>MERN STACK</span>. I specialize in creating high-quality, scalable solutions tailored to your needs.
          </p>
          <h3 className="text-xl font-semibold mb-2 text-center uppercase text-slate-600">Services Offered</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 items-center justify-center ">
              <img src={web} alt='web developement' className='w-[350px]' />
              <Button gradientDuoTone="purpleToBlue" className='w-[250px]' >Web Developement</Button>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center ">
              <img src={api} alt='web developement' className='w-[350px]' />
              <Button gradientDuoTone="purpleToBlue" className='w-[250px]' >API Integration</Button>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center ">
              <img src={ecom} alt='web developement' className='w-[350px]' />
              <Button gradientDuoTone="purpleToBlue" className='w-[250px]'>Ecom Solutions</Button>
            </div>
           
          </div>
          <div className="relative mt-8">
          <img src={portfolio} alt="Freelance Developer" className="w-full h-full rounded-lg" />
          <div className="absolute inset-0 bg-black opacity-80 flex items-center justify-center flex-col gap-3 rounded-lg">
            <h2 className="text-2xl font-bold text-white relative z-10 uppercase">Check Out My Portfolio Now</h2>
            <Link to={"https://portfolioprajapati.netlify.app"} target='_blank' className='text-white font-bold p-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>Portfolio</Link>
          </div>
        </div>
          <h3 className="text-xl font-semibold mb-2 text-slate-600 uppercase text-center mt-5">Get in Touch</h3>
          <form className='flex flex-col items-center justify-center gap-3' onSubmit={()=>{
            handleSubmit();
          }}>
            <TextInput type='email' placeholder="Enter Email" className='w-96' required onChange={(e)=>setEmail(e.target.value)} />
              <Textarea placeholder='Enter Your Message' onChange={(e)=>setMessage(e.target.value)} className='w-96' rows={4} />
            <Button type="submit" className="bg-blue-500 text-white rounded" gradientDuoTone="purpleToBlue">Submit</Button>
          </form>
          <div>

          </div>
          <p className="mt-4">Ready to bring your idea to life? Fill out the form, and I'll get back to you within 24 hours!</p>
          <p className="mt-4">
            Let's Connect:
            <a href="#" className="text-blue-500"> LinkedIn</a>, 
            <a href="#" className="text-blue-500"> Twitter</a>, 
            or email me directly at <Link to={gmailLink} target='_blank' className='text-green-600'>prajapativinay140404@gmail.com</Link>
          </p>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} gradientDuoTone="purpleToBlue" >Cancel</Button>
        {/* <Button onClick={onClose}>Submit</Button> */}
      </DialogActions>
    </Dialog>
  );
}
