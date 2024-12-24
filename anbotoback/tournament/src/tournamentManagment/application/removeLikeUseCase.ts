import { PostRepository } from "../domain/ports/PostRepository";

export class RemoveLikeUseCase {
  constructor(private repository: PostRepository) {}

  async execute(postId: string, userId: string): Promise<void> {
    await this.repository.removeLike(postId, userId);
  }
}
