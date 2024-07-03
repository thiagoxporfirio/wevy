import { type Request, type Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";

export async function createUser(request: Request, response: Response) {
	try {
		const { name, email, password } = request.body;

		// Validação do nome
		const nameRegex = /^[a-zA-Z\s]+$/;
		if (!nameRegex.test(name)) {
			return response.status(400).json("O nome deve conter apenas letras");
		}

		// Validação da senha
		if (password.length < 4) {
			return response
				.status(400)
				.json("A senha deve ter pelo menos 8 caracteres");
		}

		// Validação do e-mail
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return response.status(400).json("E-mail inválido");
		}

		const userRepository = AppDataSource.getRepository(User);

		// Verificar se já existe um usuário com o mesmo e-mail
		const existingEmail = await userRepository.findOneBy({ email });
		if (existingEmail) {
			return response.status(409).json("E-mail já registrado");
		}

		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User();
		user.name = name;
		user.email = email;
		user.password = hashedPassword;
		user.created_at = new Date();
		user.updated_at = new Date();

		await userRepository.save(user);

		return response.status(201).json({
			id: user.id,
			message: "Usuário criado com sucesso!"
		});
	} catch (error) {
		console.error(error);
		return response
			.status(500)
			.send("Internal Server Error: " + error?.message);
	}
}
