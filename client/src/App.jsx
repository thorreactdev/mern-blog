import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import About from "./Pages/About";
import Projects from "./Pages/Projects";
import Dashboard from "./Pages/Dashboard";
import Header from "./Components/Header";
import PrivateRoute from "./Components/PrivateRoute";
import PrivateAdminRoute from "./Components/PrivateAdminRoute";
import CreatePost from "./Pages/CreatePost";
import UpdatePost from "./Components/UpdatePost";
import PostPage from "./Components/PostPage";
import ScrollTop from "./Components/ScrollTop";
import Search from "./Pages/Search";


function App() {
  
  return(
    <Router>
      <ScrollTop/>
      <Header />
     
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-up" element={<Signup/>}/>
        <Route path="/sign-in" element={<Signin/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/project" element={<Projects/>}/>
        <Route element={<PrivateRoute/>}>
         <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>

        <Route path="/posts/:postSlug" element={<PostPage/>}/>
        <Route path="/search" element={<Search/>}/>

        <Route element={<PrivateAdminRoute/>}>
          <Route path="/create-post" element={<CreatePost/>}/>
          <Route path="/update-post/:postId" element={<UpdatePost/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
