import React, { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Box,
	TextField,
	Button,
	List,
	ListItem,
	ListItemText,
	Checkbox,
	IconButton,
	Card,
	CardContent,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useStore from "../store/store";
import axios from "axios";

import { URL_API } from "./Login";

const TaskPage: React.FC = () => {
	const {
		tasks,
		addTask,
		removeTask,
		toggleTask,
		setTasks,
		token,
		updateTask
	} = useStore();
	const [newTask, setNewTask] = useState({
		title: "",
		description: "",
		completed: false
	});
	const [editTask, setEditTask] = useState({
		id: null,
		title: "",
		description: ""
	});
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	useEffect(() => {
		const fetchTasks = async () => {
			if (!token) return;

			try {
				const response = await axios.get(`${URL_API}/get-tasks`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});

				if (response.status !== 200) {
					console.error("Failed to fetch tasks");
					return;
				}

				setTasks(response.data);
			} catch (error) {
				console.error("Failed to fetch tasks", error);
			}
		};

		fetchTasks();
	}, [token, setTasks]);

	const handleAddTask = async () => {
		if (!token) return;

		try {
			const response = await axios.post(
				`${URL_API}/create-task`,
				newTask,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				}
			);

			if (response.status !== 201) {
				console.error("Failed to add task");
				return;
			}

			addTask(response.data);
			setNewTask({ title: "", description: "", completed: false });
		} catch (error) {
			console.error("Failed to add task", error);
		}
	};

	const handleRemoveTask = async (id: number) => {
		if (!token) return;

		try {
			const response = await axios.delete(
				`${URL_API}/delete-task/${id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			if (response.status !== 200) {
				console.error("Failed to delete task");
				return;
			}

			removeTask(id);
		} catch (error) {
			console.error("Failed to delete task", error);
		}
	};

	const handleToggleTask = async (id: number) => {
		if (!token) return;

		try {
			const task = tasks.find(t => t.id === id);
			if (!task) return;

			const response = await axios.put(
				`${URL_API}/update-task/${id}`,
				{ ...task, completed: !task.completed },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				}
			);

			if (response.status !== 200) {
				console.error("Failed to update task");
				return;
			}

			toggleTask(id);
		} catch (error) {
			console.error("Failed to update task", error);
		}
	};

	const handleOpenEditModal = (task: any) => {
		setEditTask(task);
		setIsEditModalOpen(true);
	};

	const handleEditTask = async () => {
		if (!token) return;

		try {
			const response = await axios.put(
				`${URL_API}/update-task/${editTask.id}`,
				{ title: editTask.title, description: editTask.description },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				}
			);

			if (response.status !== 200) {
				console.error("Failed to update task");
				return;
			}

			updateTask(response.data);
			setIsEditModalOpen(false);
		} catch (error) {
			console.error("Failed to update task", error);
		}
	};

	return (
		<Container
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				minHeight: "100vh",
				mt: 4,
				mb: 4
			}}
		>
			<Typography variant="h4" component="h1" gutterBottom>
				To-Do List
			</Typography>
			<Card sx={{ maxWidth: 600, width: "100%", boxShadow: 3, mb: 4 }}>
				<CardContent>
					<Box
						component="form"
						onSubmit={e => {
							e.preventDefault();
							handleAddTask();
						}}
					>
						<TextField
							label="Title"
							variant="outlined"
							fullWidth
							margin="normal"
							value={newTask.title}
							onChange={e => setNewTask({ ...newTask, title: e.target.value })}
						/>
						<TextField
							label="Description"
							variant="outlined"
							fullWidth
							margin="normal"
							value={newTask.description}
							onChange={e =>
								setNewTask({ ...newTask, description: e.target.value })
							}
						/>
						<Button type="submit" variant="contained" color="primary" fullWidth>
							Add Task
						</Button>
					</Box>
				</CardContent>
			</Card>
			<Card sx={{ maxWidth: 600, width: "100%", boxShadow: 3 }}>
				<CardContent>
					<List>
						{tasks.map(task => (
							<ListItem
								key={task.id}
								secondaryAction={
									<>
										<IconButton
											edge="end"
											aria-label="edit"
											onClick={() => handleOpenEditModal(task)}
										>
											<EditIcon />
										</IconButton>
										<IconButton
											edge="end"
											aria-label="delete"
											onClick={() => handleRemoveTask(task.id)}
										>
											<DeleteIcon />
										</IconButton>
									</>
								}
							>
								<Checkbox
									checked={task.completed}
									onChange={() => handleToggleTask(task.id)}
								/>
								<ListItemText
									primary={task.title}
									secondary={task.description}
								/>
							</ListItem>
						))}
					</List>
				</CardContent>
			</Card>
			<Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
				<DialogTitle>Edit Task</DialogTitle>
				<DialogContent>
					<TextField
						label="Title"
						variant="outlined"
						fullWidth
						margin="normal"
						value={editTask.title}
						onChange={e => setEditTask({ ...editTask, title: e.target.value })}
					/>
					<TextField
						label="Description"
						variant="outlined"
						fullWidth
						margin="normal"
						value={editTask.description}
						onChange={e =>
							setEditTask({ ...editTask, description: e.target.value })
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsEditModalOpen(false)} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleEditTask} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default TaskPage;
