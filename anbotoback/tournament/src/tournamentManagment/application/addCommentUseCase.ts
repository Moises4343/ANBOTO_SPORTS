import { PostComment } from "../domain/entities/PostComment";
import { PostRepository } from "../domain/ports/PostRepository";

export class AddCommentUseCase {
  constructor(private repository: PostRepository) {}

  async execute(postId: string, userId: string, content: string): Promise<void> {
    const comment = new PostComment(
      new Date().getTime().toString(),
      userId,
      content,
      new Date()
    );
    await this.repository.addComment(postId, comment);
  }
}
