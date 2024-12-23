export class Post {
  constructor(
    public postId: string,
    public authorUuid: string,
    public imagePath: string,
    public content: string | null,
    public createdAt: Date
  ) { }
}
