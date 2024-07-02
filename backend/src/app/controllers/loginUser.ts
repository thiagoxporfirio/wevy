import { type Request, type Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { User } from "../entity/User";
import { Attorneys } from "../entity/Attorneys";
import { cadastraToken } from "../../config/JwtConfig";
import bcrypt from "bcrypt";
import { Subscription } from "../entity/Subscription";

export async function loginUser(request: Request, response: Response) {
	try {
		const { email, password } = request.body;

		const userRepository = AppDataSource.getRepository(User);
		const attorneysRepository = AppDataSource.getRepository(Attorneys);
		const subscriptionRepository = AppDataSource.getRepository(Subscription);

		const user = await userRepository.findOneBy({ email });
		if (!user) {
			return response.status(404).json("Usuário não encontrado");
		}

		const passwordHash = user.password.replace(/^\$2y/, "$2b");

		const isPasswordValid = await bcrypt.compare(password, passwordHash);

		if (!isPasswordValid) {
			return response.status(401).json({ message: "Senha inválida" });
		}

		// Verificar se o usuário é um advogado
		const attorney = await attorneysRepository.findOne({
			where: { user_id: user.id },
			relations: ["subscriptions"]
		});

		// Buscar a assinatura do advogado, se existir
		let subscriptionData = null;
		if (attorney) {
			subscriptionData = await subscriptionRepository.findOne({
				where: { attorney_id: attorney.user_id },
				order: { created_at: "DESC" } // Obtendo a assinatura mais recente
			});
		}

		// Gerar e retornar token
		const token = cadastraToken({ cpf_cnpj: user.cpf_cnpj });

		const userData = {
			status: "Logado",
			id: user.id,
			name: user.name,
			cpf_cnpj: user.cpf_cnpj,
			email: user.email,
			attorneyData: attorney
				? {
						oab: attorney.oab,
						state: attorney.state,
						status: attorney.status,
						photo: attorney.photo,
						rating: attorney.rating,
						subscription: subscriptionData
							? {
									id: subscriptionData.id,
									subscription: subscriptionData.subscription_id,
									created_at: subscriptionData.created_at,
									updated_at: subscriptionData.updated_at,
									deleted_at: subscriptionData.deleted_at,
									payment_platform: subscriptionData.payment_platform,
									payment_platform_status:
										subscriptionData.payment_platform_status,
									status: subscriptionData.status,
									ends_at: subscriptionData.ends_at
								}
							: null
					}
				: null
		};

		return response.status(200).json({ token, userData });
	} catch (error) {
		console.error(error);
		return response.status(500).send("Internal Server Error");
	}
}
