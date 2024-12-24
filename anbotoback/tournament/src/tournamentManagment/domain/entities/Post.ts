import { PostComment } from "./PostComment";

export class Post {
  constructor(
    public postId: string,
    public authorUuid: string,
    public imagePath: string,
    public content: string | null,
    public createdAt: Date,
    public comments: PostComment[] = [],
    public likes: string[] = [],
  ) { }
}
