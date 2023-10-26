import { useEffect, useState } from "react";

// Definición del tipo de evento para el formulario y los campos de entrada.
type FormElement =
  | React.FormEvent<HTMLFormElement>
  | React.ChangeEvent<HTMLInputElement>;

// Definición de la interfaz para representar una tarea.
interface Task {
  name: string;
  done: boolean;
}

const InitialTask: Task = {
  name: "",
  done: false,
};

//Es un hook perzonalizado
export const useTodos = () => {
  const [newTask, setNewTask] = useState<Task>(InitialTask);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [Tasks, setTasks] = useState<Task[]>([]);

  // Se obtiene las tareas del Local Storage
  useEffect(() => {
    const storageTasks = localStorage.getItem("tasks");
    if (storageTasks) {
      setTasks(JSON.parse(storageTasks));
    }
  }, []);

  const handleSubmit = (e: FormElement) => {
    e.preventDefault();
    if (editingIndex !== null) {
      // Si se está editando una tarea existente, actualiza la tarea correspondiente.
      const updatedTasks = [...Tasks];
      updatedTasks[editingIndex] = newTask;
      setTasks(updatedTasks);
      setEditingIndex(null);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } else {
      // Si se está creando una nueva tarea, la agrega a la lista.
      localStorage.setItem("tasks", JSON.stringify([...Tasks, newTask]));
      setTasks([...Tasks, newTask]);
    }
    setNewTask(InitialTask);
  };

  const startEditing = (i: number) => {
    setEditingIndex(i);
    setNewTask(Tasks[i]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setNewTask(InitialTask);
  };

  const toggleDoneTask = (i: number) => {
    const updatedTasks = [...Tasks];
    updatedTasks[i].done = !updatedTasks[i].done;
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const removeTask = (i: number) => {
    const updatedTasks = [...Tasks];
    updatedTasks.splice(i, 1);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  return {
    handleSubmit,
    startEditing,
    cancelEditing,
    toggleDoneTask,
    removeTask,
    editingIndex,
    setEditingIndex,
    newTask,
    Tasks,
    setNewTask,
  };
};
