import { Post } from "../domain/entities/Post";
import { PostRepository } from "../domain/ports/PostRepository";

export class GetUserPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(userUuid: string): Promise<Post[]> {
    return await this.postRepository.getUserPosts(userUuid);
  }
}
