import { Post } from "../entities/Post";
import { PostComment } from "../entities/PostComment";

export interface PostRepository {
  createPost(post: Post): Promise<Post>;
  getAllPosts(): Promise<Post[]>;
  getUserPosts(userUuid: string): Promise<Post[]>;
  deletePost(postId: string, authorUuid: string): Promise<boolean>;
  addComment(postId: string, comment: PostComment): Promise<void>;
  addLike(postId: string, userId: string): Promise<void>;
  removeLike(postId: string, userId: string): Promise<void>;
}
