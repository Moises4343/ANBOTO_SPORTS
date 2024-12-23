import { v4 as uuidv4 } from "uuid";
import { Post } from "../domain/entities/Post";
import { PostRepository } from "../domain/ports/PostRepository";

export class CreatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(authorUuid: string, imagePath: string, content: string | null): Promise<Post> {
    const post = new Post(
      uuidv4(), // Genera un ID único
      authorUuid,
      imagePath,
      content,
      new Date()
    );

    return await this.postRepository.createPost(post);
  }
}
