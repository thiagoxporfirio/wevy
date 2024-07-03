import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Container,
	Typography,
	TextField,
	Button,
	Box,
	Card,
	CardContent,
	CardActions
} from "@mui/material";
import axios from "axios";
import useStore from "../store/store";

export const URL_API = "http://localhost:443";

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const setToken = useStore(state => state.setToken);

	const handleLogin = async () => {
		try {
			const response = await axios.post(`${URL_API}/login`, {
				email,
				password
			});

			if (response.status !== 200) {
				throw new Error("Failed to login");
			}

			const data = response.data;
			setToken(data.token);
			navigate("/tasks");
		} catch (error) {
			console.error("Login failed", error);
		}
	};

	return (
		<Container
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh"
			}}
		>
			<Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3 }}>
				<CardContent>
					<Typography variant="h4" component="h1" gutterBottom align="center">
						Login
					</Typography>
					<Box
						component="form"
						onSubmit={e => {
							e.preventDefault();
							handleLogin();
						}}
						sx={{ mt: 2 }}
					>
						<TextField
							label="Email"
							variant="outlined"
							fullWidth
							margin="normal"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<TextField
							label="Password"
							type="password"
							variant="outlined"
							fullWidth
							margin="normal"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</Box>
				</CardContent>
				<CardActions>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						fullWidth
						onClick={handleLogin}
						sx={{ m: 2 }}
					>
						Login
					</Button>
				</CardActions>
			</Card>
		</Container>
	);
};

export default LoginPage;
