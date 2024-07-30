import { type NextFunction, type Request, type Response } from "express";
import { verificaToken } from "../../config/JwtConfig";
import { loggerInfo, loggerInfoItem } from "../utils/LoggerUtil";
import { AppDataSource } from "../../database/data-source";
import { User } from "../entity/User";

type ExtendedRequest = {
	user?: any;
} & Request;

export default async function tokenMiddleware(
	req: ExtendedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		loggerInfo("Start token validation");
		const { authorization } = req.headers;
		if (!authorization) {
			return res.sendStatus(401);
		}

		const token = authorization.replace("Bearer", "").trim();

		const decoded: any = verificaToken(token);
		if (!decoded) {
			return res.sendStatus(401);
		}

		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOne({ where: { id: decoded.id } });

		if (!user) {
			return res.sendStatus(401);
		}

		req.user = user;
		loggerInfoItem("Token Valido: ", token);
		next();
	} catch (error) {
		console.error(error);
		return res.sendStatus(401);
	}
}
