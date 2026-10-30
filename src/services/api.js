
const USERS_KEY = "taskflow_users";
const TASKS_KEY = "taskflow_tasks";
const SESSION_KEY = "taskflow_user";

const getUsers = () =>
  JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

// const getTasks = () =>
//   JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");

// REGISTER
export const registerUser = (name, email, password) => {
  const users = getUsers();

  const existingUser = users.find(
    user => user.email === email.toLowerCase()
  );

  if (existingUser) {
    throw new Error("Email already registered");
  }

  if (!name.trim() || password.length < 8) {
    throw new Error("Please enter valid details");
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    password
  };

  users.push(user);

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const session = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return session;
};

// LOGIN
export const loginUser = (email, password) => {
  const users = getUsers();

  const user = users.find(
    user =>
      user.email === email.toLowerCase() &&
      user.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const session = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return session;
};

// GET CURRENT USER
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

// GET TASKS
export const getTasks = () => {
  const user = getCurrentUser();

  if (!user) return [];

  return getTasksFromStorage().filter(
    task => task.userId === user.id
  );
};

const getTasksFromStorage = () =>
  JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");

// CREATE TASK
export const createTask = (taskData) => {
  const user = getCurrentUser();

  if (!user) throw new Error("Please login first");

  const tasks = getTasksFromStorage();

  const newTask = {
    id: crypto.randomUUID(),
    ...taskData,
    userId: user.id,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

  return newTask;
};

// UPDATE TASK
export const updateTask = (id, updates) => {
  const user = getCurrentUser();

  if (!user) throw new Error("Please login first");

  const tasks = getTasksFromStorage();

  const index = tasks.findIndex(
    task => task.id === id && task.userId === user.id
  );

  if (index === -1) {
    throw new Error("Task not found");
  }

  tasks[index] = {
    ...tasks[index],
    ...updates,
    id: tasks[index].id,
    userId: user.id
  };

  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

  return tasks[index];
};

// DELETE TASK
export const deleteTask = (id) => {
  const user = getCurrentUser();

  if (!user) throw new Error("Please login first");

  const tasks = getTasksFromStorage();

  const updatedTasks = tasks.filter(
    task => !(task.id === id && task.userId === user.id)
  );

  localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
};
