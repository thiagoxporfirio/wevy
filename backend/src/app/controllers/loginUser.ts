import { type Request, type Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { User } from "../entity/User";
import { cadastraToken } from "../../config/JwtConfig";
import bcrypt from "bcrypt";

export async function loginUser(request: Request, response: Response) {
	try {
		const { email, password } = request.body;

		const userRepository = AppDataSource.getRepository(User);

		const user = await userRepository.findOneBy({ email });
		if (!user) {
			return response.status(404).json("Usuário não encontrado");
		}

		const passwordHash = user.password.replace(/^\$2y/, "$2b");

		const isPasswordValid = await bcrypt.compare(password, passwordHash);

		if (!isPasswordValid) {
			return response.status(401).json({ message: "Senha inválida" });
		}

		const token = cadastraToken({ email: user.email });

		const userData = {
			status: "Logado",
			id: user.id,
			name: user.name,
			email: user.email
		};

		return response.status(200).json({ token, userData });
	} catch (error) {
		console.error(error);
		return response.status(500).send("Internal Server Error");
	}
}
