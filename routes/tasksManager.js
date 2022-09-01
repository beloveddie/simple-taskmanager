const express = require("express");
const router = express.Router();
const taskController = require("../controllers/tasksController");

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.addTask)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

router.route("/:id").get(taskController.getTaskById);

module.exports = router;
