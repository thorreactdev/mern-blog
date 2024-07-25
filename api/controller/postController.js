import Post from "../models/postModel.js";
import SubscribeSchema from "../models/susbcribeModel.js";
import { sendEmail } from "../utils/emailService.js";
import { errorHandler } from "../utils/error.js"

export const createPost = async(req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to create a post'));
    }
    if(!req.body.title || !req.body.content || !req.body.image || !req.body.category){
        return next(errorHandler(400, 'Please Provide All Required Fields'));
    }
   
    const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });
    try {
        const savedPost = await newPost.save();
        console.log(savedPost);

        const subscribedUser = await SubscribeSchema.find();
        const emailContent = `
           <div style="max-width: 450px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">
              <div>
                <img src="${req.body.image}" alt="" style="width: 100%; height: auto; border-radius: 8px 8px 0 0;"/>
              </div>
              <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
                <h1 style="font-weight: 500; font-size: 1.125rem; cursor: pointer; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">${req.body.title}</h1>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <p style="font-weight: 500;">Post Category : </p>
                  <span style="display: inline-flex; align-items: center; justify-content: center; padding: 0 8px; font-size: 0.875rem; border-radius: 16px; background-color: rgba(0, 0, 0, 0.08);">${req.body.category}</span>
                </div>
                <a href="https://mern-blog-cyd1.onrender.com/" style="text-decoration: none;">
                  <button style="margin-top: 8px; margin-bottom: 8px; width: 100%; padding: 8px 16px; background-image: linear-gradient(to right, #a855f7, #ec4899); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">Read Blog</button>
                </a>
              </div>
            </div>
        `;

        const emailPromises = subscribedUser.map((subscribe)=>{
          return(
            sendEmail(
              subscribe.email,
              "New Post Published",
              emailContent
            )
          )
        })

        await Promise.all(emailPromises);
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
}

export const getPost = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const totalPosts = await Post.countDocuments();
  
      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
  
      const lastMonthPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts,
      });
    } catch (error) {
      next(error);
    }
  };

export const deletePost = async(req,res,next)=>{
  if(!req.user.isAdmin || req.user.id !== req.params.userId){
    return next(errorHandler(401 , "You are not allowed to delete the post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("Post Deleted Successfull");
  } catch (error) {
    next(error);
  }
}

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
          slug : req.body.title?.split(" ")?.join("-")?.toLowerCase()?.replace(/[^a-zA-Z0-9-]/g, '')
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};