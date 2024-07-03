// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import TaskPage from "./Views/Task";
import LoginPage from "./Views/Login";
import PrivateRoute from "./Auth/PrivateRoute";

const App: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<LoginPage />} />
			<Route
				path="/tasks"
				element={
					<PrivateRoute>
						<TaskPage />
					</PrivateRoute>
				}
			/>
		</Routes>
	);
};

export default App;
