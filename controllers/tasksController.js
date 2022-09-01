const { v4: uuid } = require("uuid");
const tasksDB = {
  tasks: require("../model/tasks.json"),
  setTasks(tasks) {
    this.tasks = tasks;
  },
};
const validator = require("../utils/validator");
const writeFile = require("../utils/writeFile");

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
  // check for duplicates
  if (
    tasksDB.tasks.find(
      (task) => task.title.toLowerCase() === title.toLowerCase()
    )
  ) {
    return res.sendStatus(409); // duplicate
  }
  // we can go ahead and create the task then
  const newTask = { id: uuid(), title, assignee, dueDate, difficulty };
  tasksDB.setTasks([...tasksDB.tasks, newTask]);
  // lets play bit with the filesystem ..yoh!
  try {
    await writeFile(tasksDB.tasks);
    console.log(tasksDB.tasks);
    res.status(201).json({ success: "Task successfully added!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  const id = req.body.id;
  if (validator.exists(id, tasksDB.tasks)) {
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
    await writeFile(tasksDB.tasks);
    res.status(200).json({ message: "Task succesfully updated", updatedTask });
    console.log(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  const id = req.body.id;
  if (validator.exists(id, tasksDB.tasks)) {
    return res.status(400).json({ messgae: `No task with ${id} not found!` });
  }
  try {
    const newTasks = tasksDB.tasks.filter((task) => task.id !== id);
    tasksDB.setTasks(newTasks);
    await writeFile(tasksDB.tasks);
    const deletedTask = newTasks.find((task) => task.id === id);
    res.status(200).json({ message: "Task succesfully deleted", deletedTask });
    console.log(deletedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = (req, res) => {
  const id = req.params.id;
  if (validator.exists(id, tasksDB.tasks)) {
    return res.status(400).json({ messgae: `No task with ${id} not found!` });
  }
  const task = tasksDB.tasks.find((task) => task.id === id);
  res.status(200).json({ task });
  console.log(task);
};

module.exports = { getAllTasks, addTask, updateTask, deleteTask, getTaskById };
