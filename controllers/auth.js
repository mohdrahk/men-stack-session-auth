// Alyways do the controller first then routes and finally is the view

const User = require("../models/user")
const bcrypt = require("bcrypt")

// router.get("/sign-up", (req, res) => {
//   res.render("auth/sign-up.ejs");
// });

exports.auth_signup_get = async (req, res) => {
  res.render("auth/sign-up.ejs")
}
exports.auth_signup_post = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (userInDatabase) {
    return res.send("Username already taken")
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Password and confirm password must match")
  }
  //Register the user
  //Password encryption
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword

  //Create the user
  const user = await User.create(req.body)
  res.send(`Thanks for you signing up ${user.username}`)
}

//Sign in

exports.auth_signin_get = async (req, res) => {
  res.render("auth/sign-in.ejs")
}

exports.auth_signin_post = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (!userInDatabase) {
    return res.send("Login failed. Please try again later")
  }
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  )
  if (!validPassword) {
    return res.send("Login failed. Please try again later")
  }

  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  }

  res.redirect("/")
}

//Sign Out
exports.auth_signout_get = async (req, res) => {
  req.session.destroy()
  res.redirect("/auth/sign-in")
}
