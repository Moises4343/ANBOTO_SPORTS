import { PostRepository } from "../domain/ports/PostRepository";

export class AddLikeUseCase {
  constructor(private repository: PostRepository) {}

  async execute(postId: string, userId: string): Promise<void> {
    await this.repository.addLike(postId, userId);
  }
}
