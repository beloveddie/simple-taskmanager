const fsPromises = require("fs/promises");
const { nanoid } = require("nanoid");
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

const addTask = (req, res) => {
  const { title, assignee, dueDate, difficulty } = req.body;
  if (!title || !assignee || !dueDate || !difficulty) {
    return res.status(400).json({
      message: "title, assignee, duedate and difficulty are required!",
    });
  }
  // we can go ahead and create the task then
  const newTask = {id: nanoid(), title, assignee, dueDate, difficulty };
  tasksDB.setTasks([...tasksDB.tasks, newTask]);
  // lets play bit with the filesystem ..yoh!
    try {
        await fsPromises.writeFile(path.join(__dirname, "..", "model", "tasks.json"), JSON.stringify(tasksDB.tasks))
        console.log(tasksDB.tasks)
        res.status(201).json({"success": "Task successfully added!"})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTask = (req, res) => {
    const id = (req.body.id)
    if (!id) {
        return res.status(400).json({messgae: `No task with ${id} not found!`})
    }
    try {
        const newTasks = tasksDB.tasks.map(task => {
            if (task.id === id) {
                const updatedTask = {...task, ...req.body}
                return updatedTask;
            } else {return task}
        })
        tasksDB.setTasks(newTasks);
        const updatedTask = newTasks.find(task => task.id === id)
        await fsPromises.appendFile(path.join(__dirname, "..", "model", "tasks.json"), JSON.stringify(tasksDB.tasks))
        res.status(200).json({message: "Task succesfully updated", updatedTask})
        console.log(updateTask)
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}
