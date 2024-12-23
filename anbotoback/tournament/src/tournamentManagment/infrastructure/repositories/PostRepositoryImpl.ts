import fs from "fs";
import mongoose, { Document, Schema } from "mongoose";
import path from "path";
import { Post } from "../../domain/entities/Post";
import { PostRepository } from "../../domain/ports/PostRepository";

interface IPost extends Document {
  postId: string;
  authorUuid: string;
  imagePath: string;
  content: string | null;
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  postId: { type: String, required: true, unique: true },
  authorUuid: { type: String, required: true },
  imagePath: { type: String, required: true },
  content: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const PostModel = mongoose.model<IPost>("Post", PostSchema);

export class PostRepositoryImpl implements PostRepository {
  async createPost(post: Post): Promise<Post> {
    const newPost = new PostModel(post);
    await newPost.save();
    return post;
  }

  async getAllPosts(): Promise<Post[]> {
    const posts = await PostModel.find().sort({ createdAt: -1 }).exec();
    return posts.map(post => new Post(
      post.postId,
      post.authorUuid,
      `${process.env.PORT || 'http://localhost:3001'}${post.imagePath}`,
      post.content,
      post.createdAt
    ));
  }

  async getUserPosts(userUuid: string): Promise<Post[]> {
    const posts = await PostModel.find({ authorUuid: userUuid }).exec();
    return posts.map(post => new Post(
      post.postId,
      post.authorUuid,
      `${process.env.PORT || 'http://localhost:3001'}${post.imagePath}`,
      post.content,
      post.createdAt
    ));
  }

  async deletePost(postId: string, authorUuid: string): Promise<boolean> {
    const post = await PostModel.findOne({ postId, authorUuid });

    if (!post) {
      return false; 
    }

    const imagePath = path.join(__dirname, "..", post.imagePath);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await PostModel.deleteOne({ postId, authorUuid });
    return true;
  }
}
