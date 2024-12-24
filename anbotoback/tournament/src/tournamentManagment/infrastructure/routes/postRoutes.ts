import { Router } from "express";
import { PostController, upload } from "../controllers/PostController";

export const postRouter = (postController: PostController): Router => {
  const router = Router();

  router.post("/create-post", upload.single("image"), postController.createPost.bind(postController));
  router.get("/all-posts", postController.getAllPosts.bind(postController));
  router.get("/get-post", (req, res) => postController.getUserPosts(req, res));
  router.delete("/delete-post/:postId", postController.deletePost.bind(postController));
  router.post("/:postId/add-comment", postController.addComment.bind(postController));
  router.post("/:postId/add-like", postController.addLike.bind(postController));
  router.post("/:postId/remove-like", postController.removeLike.bind(postController));

  return router;
};
