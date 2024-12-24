export class PostComment {
  constructor(
    public commentId: string,
    public userId: string,
    public content: string,
    public createdAt: Date
  ) { }
}
