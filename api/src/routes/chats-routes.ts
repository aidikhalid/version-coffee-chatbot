import { Router } from "express";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import {
  createChatCompletion,
  createChatCompletionStream,
} from "../controllers/chat-controllers.js";
import {
  authenticateToken,
  authenticateUser,
} from "../middleware/auth-middleware.js";
import { arcjetProtection } from "../middleware/arcjet-middleware.js";

const chatsRoutes = Router();

chatsRoutes.use(arcjetProtection);

chatsRoutes.post(
  "/",
  validate(chatCompletionValidator()),
  authenticateToken,
  authenticateUser,
  createChatCompletion,
);

chatsRoutes.post(
  "/stream",
  validate(chatCompletionValidator()),
  authenticateToken,
  authenticateUser,
  createChatCompletionStream,
);

export default chatsRoutes;
