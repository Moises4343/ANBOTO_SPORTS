import { PostRepository } from "../domain/ports/PostRepository";
import { CustomError } from "../infrastructure/error/error";

export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(postId: string, authorUuid: string): Promise<void> {
    const success = await this.postRepository.deletePost(postId, authorUuid);
    if (!success) {
      throw new CustomError(403, "No tienes permisos para eliminar esta publicación o no existe.");
    }
  }
}
