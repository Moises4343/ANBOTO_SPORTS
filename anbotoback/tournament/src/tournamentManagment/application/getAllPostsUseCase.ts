import { Post } from "../domain/entities/Post";
import { PostRepository } from "../domain/ports/PostRepository";

export class GetAllPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(): Promise<Post[]> {
    return await this.postRepository.getAllPosts();
  }
}
