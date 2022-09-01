const fsPromises = require("fs/promises");
const { v4: uuid } = require("uuid");
const path = require("path");
const tasksDB = {
  tasks: require("../model/tasks.json"),
  setTasks(tasks) {
    this.tasks = tasks;
  },
};

const getAllTasks = (req, res) => {
  res.json(tasksDB.tasks);
};

const addTask = async (req, res) => {
  const { title, assignee, dueDate, difficulty } = req.body;
  if (!title || !assignee || !dueDate || !difficulty) {
    return res.status(400).json({
      message: "title, assignee, duedate and difficulty are required!",
    });
  }
  // we can go ahead and create the task then
  const newTask = { id: uuid(), title, assignee, dueDate, difficulty };
  tasksDB.setTasks([...tasksDB.tasks, newTask]);
  // lets play bit with the filesystem ..yoh!
  try {
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "tasks.json"),
      JSON.stringify(tasksDB.tasks)
    );
    console.log(tasksDB.tasks);
    res.status(201).json({ success: "Task successfully added!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  const id = req.body.id;
  if (!id || !tasksDB.tasks.find((task) => task.id === id)) {
    return res.status(400).json({ messgae: `No task with ${id} not found!` });
  }
  try {
    const newTasks = tasksDB.tasks.map((task) => {
      if (task.id === id) {
        const updatedTask = { ...task, ...req.body };
        return updatedTask;
      } else {
        return task;
      }
    });
    tasksDB.setTasks(newTasks);
    const updatedTask = newTasks.find((task) => task.id === id);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "tasks.json"),
      JSON.stringify(tasksDB.tasks)
    );
    res.status(200).json({ message: "Task succesfully updated", updatedTask });
    console.log(updateTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  const id = req.body.id;
  if (!id || !tasksDB.tasks.find((task) => task.id === id)) {
    return res.status(400).json({ messgae: `No task with ${id} not found!` });
  }
  try {
    const newTasks = tasksDB.tasks.filter((task) => task.id !== id);
    tasksDB.setTasks(newTasks);
    await fsPromises.appendFile(
      path.join(__dirname, "..", "model", "tasks.json"),
      JSON.stringify(tasksDB.tasks)
    );
    const deletedTask = newTasks.find((task) => task.id === id);
    res.status(200).json({ message: "Task succesfully deleted", deletedTask });
    console.log(deletedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = (req, res) => {
  const id = req.params.id;
  if (!id || !tasksDB.tasks.find((task) => task.id === id)) {
    return res.status(400).json({ messgae: `No task with ${id} not found!` });
  }
  const task = tasksDB.tasks.find((task) => task.id === id);
  res.status(200).json({ task });
  console.log(task);
};

module.exports = { getAllTasks, addTask, updateTask, deleteTask, getTaskById };
