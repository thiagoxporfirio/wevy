import { Router } from "express";
import express from "express";
import path from "path";
import {
	createUser,
	updateUser,
	getUser,
	deleteUser
} from "./app/controllers/createUser";
import { loginUser } from "./app/controllers/loginUser";
import tokenMiddleware from "./app/Middleware/Authorization";
import { health } from "./app/controllers/health";


export const router = Router();

// ======================
// Health Checks
// ======================
router.get("/health", health);
router.get("/", (request, response) =>
	response.json({ message: "." })
);

// ======================
// Authentication and User Management
// ======================
router.post("/login", loginUser);
router.post("/register-user", createUser);
router.delete("/delete-user/:id", tokenMiddleware, deleteUser);
router.put("/update-user/:id", tokenMiddleware, updateUser);
router.get("/get-user/:id", tokenMiddleware, getUser);
