import { Router } from "express";
import { PostController, upload } from "../controllers/PostController";

export const postRouter = (postController: PostController): Router => {
  const router = Router();

  router.post("/create-post", upload.single("image"), postController.createPost.bind(postController));
  router.get("/all-posts", postController.getAllPosts.bind(postController));
  router.get("/get-post", (req, res) => postController.getUserPosts(req, res));
  router.delete("/delete-post/:postId", postController.deletePost.bind(postController));

  return router;
};
