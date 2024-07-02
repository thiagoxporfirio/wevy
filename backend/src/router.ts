import { Router } from "express";
import express from "express";
import path from "path";
import { createUser } from "./app/controllers/User";
import { loginUser } from "./app/controllers/loginUser";
import tokenMiddleware from "./app/Middleware/Authorization";

export const router = Router();

router.get("/", (request, response) => response.json({ message: "." }));

// ======================
// Authentication and User Management
// ======================
router.post("/login", loginUser);
router.post("/register-user", createUser);
