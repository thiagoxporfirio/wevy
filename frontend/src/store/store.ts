import create from 'zustand';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

interface Store extends AuthState {
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (id: number) => void;
  toggleTask: (id: number) => void;
  setTasks: (tasks: Task[]) => void;
  updateTask: (updatedTask: Task) => void;
}

const useStore = create<Store>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
  })),
  setTasks: (tasks) => set({ tasks }),
  updateTask: (updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
  })),
}));

export default useStore;
