const Task = require("../models/task")

// APIs here ---------

exports.task_index_get = async (req, res) => {
  const tasks = await Task.find({ owner: req.session.user._id })
  res.render("tasks/index.ejs", { tasks })
}

exports.task_create_get = async (req, res) => {
  res.render("tasks/new.ejs")
}

exports.task_create_post = async (req, res) => {
  req.body.owner = req.session.user._id
  await Task.create(req.body)
  res.redirect("/tasks")
}

exports.task_show_get = async (req, res) => {
  const task = await Task.findById(req.params.taskId)

  if (!task.owner.equals(req.session.user._id)) {
    return res.send("You Don't have permissions to view this task")
  }

  res.render("tasks/show.ejs", { task })
}

exports.task_edit_get = async (req, res) => {
  const task = await Task.findById(req.params.taskId)

  if (!task.owner.equals(req.session.user._id)) {
    return res.send("You Don't have permissions to view this task")
  }

  res.render("tasks/edit.ejs", { task })
}

exports.task_edit_put = async (req, res) => {
  const task = await Task.findById(req.params.taskId)
  await task.updateOne(req.body)
  if (!task.owner.equals(req.session.user._id)) {
    return res.send("You Don't have permissions to view this task")
  }
  res.redirect("/tasks")
}

exports.task_remove_delete = async (req, res) => {
  const task = await Task.findById(req.params.taskId)
  if (!task.owner.equals(req.session.user._id)) {
    return res.send("You Don't have permissions to view this task")
  }
  await task.deleteOne() //when to put nothing in paranthesis and when to put req.body, is a bit overwhelming
  res.redirect("/tasks")
}
