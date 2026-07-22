const { z } = require("zod");

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    res.status(400);
    return next(new Error(result.error.issues[0].message));
  }

  req.body = result.data;
  next();
};

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email address").max(254),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(254),
  password: z.string().min(1, "Password is required").max(128),
});

const scoreSchema = z.object({
  score: z.preprocess(
    (value) => Number(value),
    z.number().int("Score must be a whole number").min(0),
  ),
  attempts: z.preprocess(
    (value) => Number(value),
    z.number().int("Attempts must be a whole number").min(1),
  ),
});

module.exports = { validate, registerSchema, loginSchema, scoreSchema };
