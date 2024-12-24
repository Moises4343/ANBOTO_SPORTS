import fs from "fs";
import mongoose, { Document, Schema } from "mongoose";
import path from "path";
import { Post } from "../../domain/entities/Post";
import { PostComment } from "../../domain/entities/PostComment";
import { PostRepository } from "../../domain/ports/PostRepository";

interface IPostComment {
  commentId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

interface IPost extends Document {
  postId: string;
  authorUuid: string;
  imagePath: string;
  content: string | null;
  createdAt: Date;
  comments: IPostComment[];
  likes: string[];
}

const PostCommentSchema: Schema = new Schema({
  commentId: { type: String, required: true },
  userId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema: Schema = new Schema({
  postId: { type: String, required: true, unique: true },
  authorUuid: { type: String, required: true },
  imagePath: { type: String, required: true },
  content: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  comments: [PostCommentSchema],
  likes: [{ type: String }],
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
      post.createdAt,
      post.comments as PostComment[],
      post.likes
    ));
  }
  

  async getUserPosts(userUuid: string): Promise<Post[]> {
    const posts = await PostModel.find({ authorUuid: userUuid }).exec();
    return posts.map(post => new Post(
      post.postId,
      post.authorUuid,
      `${process.env.PORT || 'http://localhost:3001'}${post.imagePath}`,
      post.content,
      post.createdAt,
      post.comments as PostComment[],
      post.likes
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

  async addComment(postId: string, comment: PostComment): Promise<void> {
    await PostModel.findOneAndUpdate(
      { postId },
      { $push: { comments: comment } }
    );
  }

  async addLike(postId: string, userId: string): Promise<void> {
    await PostModel.findOneAndUpdate(
      { postId },
      { $addToSet: { likes: userId } }
    );
  }

  async removeLike(postId: string, userId: string): Promise<void> {
    await PostModel.findOneAndUpdate(
      { postId },
      { $pull: { likes: userId } }
    );
  }
}
