import { Post } from "../entities/Post";

export interface PostRepository {
  createPost(post: Post): Promise<Post>;
  getAllPosts(): Promise<Post[]>;
  getUserPosts(userUuid: string): Promise<Post[]>;
  deletePost(postId: string, authorUuid: string): Promise<boolean>;
}
