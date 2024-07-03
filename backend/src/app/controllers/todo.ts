import { type Request, type Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { Task } from "../entity/Task";
import { User } from "../entity/User";

type ExtendedRequest = {
	user?: User;
} & Request;

export async function createTask(request: ExtendedRequest, response: Response) {
	try {
		const { title, description } = request.body;
		const userId = request.user!.id;

		const userRepository = AppDataSource.getRepository(User);
		const taskRepository = AppDataSource.getRepository(Task);

		const user = await userRepository.findOneBy({ id: userId });
		if (!user) {
			return response.status(404).json("Usuário não encontrado");
		}

		const task = new Task();
		task.title = title;
		task.description = description;
		task.completed = false;
		task.user = user;
		task.created_at = new Date();
		task.updated_at = new Date();

		await taskRepository.save(task);

		return response.status(201).json(task);
	} catch (error) {
		console.error(error);
		return response.status(500).send("Internal Server Error: " + error.message);
	}
}

export async function getTasks(request: ExtendedRequest, response: Response) {
	try {
		const userId = request.user!.id;

		const taskRepository = AppDataSource.getRepository(Task);

		const tasks = await taskRepository.find({
			where: { user: { id: userId } }
		});

		return response.status(200).json(tasks);
	} catch (error) {
		console.error(error);
		return response.status(500).send("Internal Server Error: " + error.message);
	}
}

export async function updateTask(request: ExtendedRequest, response: Response) {
	try {
		const { id } = request.params;
		const { title, description, completed } = request.body;
		const userId = request.user!.id;

		const taskId = parseInt(id, 10);

		const taskRepository = AppDataSource.getRepository(Task);

		const task = await taskRepository.findOne({
			where: { id: taskId, user: { id: userId } }
		});
		if (!task) {
			return response.status(404).json("Tarefa não encontrada");
		}

		task.title = title || task.title;
		task.description = description || task.description;
		task.completed = completed !== undefined ? completed : task.completed;
		task.updated_at = new Date();

		await taskRepository.save(task);

		return response.status(200).json(task);
	} catch (error) {
		console.error(error);
		return response.status(500).send("Internal Server Error: " + error.message);
	}
}

export async function deleteTask(request: ExtendedRequest, response: Response) {
	try {
		const { id } = request.params;
		const userId = request.user!.id;

		const taskId = parseInt(id, 10);

		const taskRepository = AppDataSource.getRepository(Task);

		const task = await taskRepository.findOne({
			where: { id: taskId, user: { id: userId } }
		});
		if (!task) {
			return response.status(404).json("Tarefa não encontrada");
		}

		await taskRepository.remove(task);

		return response
			.status(200)
			.json({ message: "Tarefa deletada com sucesso" });
	} catch (error) {
		console.error(error);
		return response.status(500).send("Internal Server Error: " + error.message);
	}
}
