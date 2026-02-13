import { NextFunction, Request, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    for (let validation of validations) {
      await validation.run(req);
    }

    // Check for errors after all validations have run
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(422).json({ errors: errors.array() });
  };
};

export const signupValidator = () => [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").notEmpty().trim().isEmail().withMessage("Email is required"),
  body("password")
    .notEmpty()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidator = () => [
  body("email").notEmpty().trim().isEmail().withMessage("Email is required"),
  body("password")
    .notEmpty()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const chatCompletionValidator = () => [
  body("messages")
    .isArray({ min: 1 })
    .withMessage("Messages array is required and must not be empty"),
  body("messages.*.role")
    .isIn(["user", "assistant"])
    .withMessage("Each message must have a valid role"),
  body("messages.*.content")
    .notEmpty()
    .withMessage("Each message must have content"),
];
