const { z } = require("zod");

const registerSchema = {
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  }),
};

const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
};

const refreshSchema = {
  body: z.object({
    refreshToken: z.string().min(10).optional(),
  }),
};

const verifyEmailSchema = {
  body: z.object({
    token: z.string().min(10),
  }),
};

const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email(),
  }),
};

const resetPasswordSchema = {
  body: z.object({
    token: z.string().min(10),
    password: z.string().min(8),
  }),
};

const logoutSchema = {
  body: z.object({
    refreshToken: z.string().min(10).optional(),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  logoutSchema,
};
