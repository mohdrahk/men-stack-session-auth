// Dependencies ----------

const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()
// app.set("view-engine", "ejs")

// Database Connection

const mongoose = require("./config/db.js")

// Port Config ----------

const port = process.env.PORT ? process.env.PORT : "3000"

// Added for CSS
const path = require("path")

// Required Middlewares

const methodOverride = require("method-override")
const morgan = require("morgan") // morgan is for logging only

const session = require("express-session")
const passUserToView = require("./middleware/pass-user-to-view") // checks for session
const isSignedIn = require("./middleware/is-signed-in") // comment here

// Running Middlewares

app.use(express.urlencoded()) // for forms to submit data
app.use(methodOverride("_method"))
app.use(morgan("dev"))

//new code Add for CSS
app.use(express.static(path.join(__dirname, "public")))
//new code above this line ---

// Session Configuration (MUST be before all routes)

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)

app.use(passUserToView)

// Root Route

app.get("/", async (req, res) => {
  // console.log(req.session.user.username)
  user = req.session.user
  if (user) {
    username = req.session.user.username
  } else {
    username = "Guest"
  }
  res.render("index.ejs", { username })
})

app.get("/vip-lounge", isSignedIn, (req, res) => {
  res.send(`Welcome to the party, ${req.session.user.username}`)
})

// Required Routes

const authRouter = require("./routes/auth")
const taskRouter = require("./routes/tasks")

// Use Routes

app.use("/auth", authRouter)
app.use("/tasks", isSignedIn, taskRouter) // isSignedIn is a middleware checking... you guessed it

// Server - Listen on configured port

app.listen(port, () => {
  console.log(`The Express app iis listening on port ${port}`)
})
