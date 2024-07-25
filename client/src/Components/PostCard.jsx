import { Card, CardContent, CardMedia , Chip, Typography } from "@mui/material"
import { Link } from "react-router-dom";
// eslint-disable-next-line react/prop-types
export default function PostCard({ postData }) {
    console.log(postData);
  return (
    <Link to={`/posts/${postData?.slug}`}>
    <Card sx={{ maxWidth : "400px"}} className="hover:scale-105 hover:transition-all hover:duration-300" >
        <CardMedia image={postData?.image} sx={{ height : "200px" , width: "100%" , objectFit : "cover"}}/>
        <CardContent>
            <Typography>
               <span className="font-medium line-clamp-2">{postData?.title}</span> 
            </Typography>

            <Chip label={postData?.category} className="uppercase italic font-medium mt-3"/>
           
        </CardContent>
    </Card>
    </Link>
  )
}
