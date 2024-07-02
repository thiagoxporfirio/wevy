import { Router } from "express";
import express from "express";
import path from "path";
import { createUser } from "./app/controllers/User";
import { loginUser } from "./app/controllers/loginUser";
import tokenMiddleware from "./app/Middleware/Authorization";
import { createTask, deleteTask, getTasks, updateTask } from "./app/controllers/todo";

export const router = Router();

router.get("/", (request, response) => response.json({ message: "." }));

// ======================
// Authentication and User Management
// ======================
router.post("/login", loginUser);
router.post("/register-user", createUser);

router.post("/create-task", tokenMiddleware, createTask);
router.get("/get-tasks", tokenMiddleware, getTasks);
router.put("/update-task/:id", tokenMiddleware, updateTask);
router.delete("/delete-task/:id", tokenMiddleware, deleteTask);
