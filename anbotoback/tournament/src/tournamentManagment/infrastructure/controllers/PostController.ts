import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { AddCommentUseCase } from "../../application/addCommentUseCase";
import { AddLikeUseCase } from "../../application/addLikeUseCase";
import { CreatePostUseCase } from "../../application/createPostUseCase";
import { DeletePostUseCase } from "../../application/deletePostUseCase";
import { GetAllPostsUseCase } from "../../application/getAllPostsUseCase";
import { GetUserPostsUseCase } from "../../application/getUserPostsUseCase";
import { RemoveLikeUseCase } from "../../application/removeLikeUseCase";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/error";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../images/posts"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
});
  

export const upload = multer({ storage });

export class PostController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private getAllPostsUseCase: GetAllPostsUseCase,
    private getUserPostsUseCase: GetUserPostsUseCase,
    private deletePostUseCase: DeletePostUseCase,
    private addCommentUseCase: AddCommentUseCase,
    private addLikeUseCase: AddLikeUseCase,
    private removeLikeUseCase: RemoveLikeUseCase,
    private tokenService: TokenService
  ) {}

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError(401, "Token no proporcionado o inválido.");
      }

      const token = authHeader.split(" ")[1];
      const { uuid } = this.tokenService.getTokenData<{ uuid: string }>(token);

      if (!req.file) {
        throw new CustomError(400, "Imagen no proporcionada.");
      }

      const { content } = req.body;
      const imagePath = `/images/posts/${req.file.filename}`;

      const post = await this.createPostUseCase.execute(uuid, imagePath, content);

      res.status(201).json(post);
    } catch (error: any) {
      console.error("Error al crear publicación:", error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError(401, "Token no proporcionado o inválido.");
      }
  
      const token = authHeader.split(" ")[1];
      const { uuid } = this.tokenService.getTokenData<{ uuid: string }>(token);
  
      const posts = await this.getAllPostsUseCase.execute();
  
      res.status(200).json(posts);
    } catch (error: any) {
      console.error("Error al obtener publicaciones:", error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getUserPosts(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError(401, "Token no proporcionado o inválido.");
      }
  
      const token = authHeader.split(" ")[1];
      const { uuid } = this.tokenService.getTokenData<{ uuid: string }>(token);
  
      const posts = await this.getUserPostsUseCase.execute(uuid);
  
      res.status(200).json(posts);
    } catch (error: any) {
      console.error("Error al obtener publicaciones del usuario:", error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
  
  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError(401, "Token no proporcionado o inválido.");
      }

      const token = authHeader.split(" ")[1];
      const { uuid } = this.tokenService.getTokenData<{ uuid: string }>(token);

      const { postId } = req.params;

      await this.deletePostUseCase.execute(postId, uuid);

      res.status(200).json({ message: "Publicación eliminada correctamente." });
    } catch (error: any) {
      console.error("Error al eliminar publicación:", error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async addComment(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError(401, "Token no proporcionado o inválido.");
      }

      const token = authHeader.split(" ")[1];
      const { uuid } = this.tokenService.getTokenData<{ uuid: string }>(token);

      const { postId } = req.params;
      const { content } = req.body;

      if (!content) {
        throw new CustomError(400, "El comentario no puede estar vacío.");
      }

      await this.addCommentUseCase.execute(postId, uuid, content);

      res.status(201).json({ message: "Comentario agregado correctamente." });
    } catch (error: any) {
      console.error("Error al agregar comentario:", error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async addLike(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError(401, "Token no proporcionado o inválido.");
      }
  
      const token = authHeader.split(" ")[1];
      const { uuid } = this.tokenService.getTokenData<{ uuid: string }>(token);
  
      const { postId } = req.params;
  
      await this.addLikeUseCase.execute(postId, uuid);
  
      res.status(200).json({ message: "Like agregado correctamente." });
    } catch (error: any) {
      console.error("Error al agregar like:", error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
  

  async removeLike(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError(401, "Token no proporcionado o inválido.");
      }
  
      const token = authHeader.split(" ")[1];
      console.log("Token recibido:", token);
  
      const { uuid } = this.tokenService.getTokenData<{ uuid: string }>(token);
      console.log("UUID del token:", uuid);
  
      const { postId } = req.params;
  
      await this.removeLikeUseCase.execute(postId, uuid);
  
      res.status(200).json({ message: "Like eliminado correctamente." });
    } catch (error: any) {
      console.error("Error al eliminar like:", error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
  
  
}
