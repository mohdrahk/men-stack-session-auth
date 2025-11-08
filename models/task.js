const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "Medium", "High"],
    default: "Medium",
  },
  status: {
    type: String,
    enum: ["Pending", "Complete"],
    default: "Pending",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    default: "User",
  },
})

//Pascal letter, we have to use uppercase here
const Task = mongoose.model("Task", taskSchema)
module.exports = Task
