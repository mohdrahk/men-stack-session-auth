//Setting config files------------------------------------------------------------------
const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express()
const methodOverride = require("method-override")
const morgan = require("morgan")

// Connect server --------------------------------------------------------------------
const mongoose = require("./config/db")

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000"

// Middleware ------------------------------------------------------------------------

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }))

// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"))

// Morgan for logging HTTP requests
app.use(morgan("dev"))

// Config for express session which is for login ORDER MATTERS HERE (We need to do our session config before the routes)
const session = require("express-session")

//// Pass user to views middleware, has to come after session configuration
const passUserToView = require("./middleware/pass-user-to-view")

//Is signed user to manage permission, this is const, but when we use app.use, position will matter
const isSignedIn = require("./middleware/is-signed-in")

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)

// Using the pass user, MUST BE UNDER server configuration

app.use(passUserToView)

// Routes ------------------------------------------------------------------------------

// Routes that use GET
app.get("/", async (req, res) => {
  res.render("index.ejs")
})

// Require Routes
const authRouter = require("./routes/auth.js")

// //Check middle ware of is signed in
// app.get("auth/vip-lounge", isSignedIn, (req, res) => {
//   // res.send(`welcome to the party! ${req.session.user.username}`)
//   res.render("vip-lounge.ejs")
// })

// Use routes
app.use("/auth", authRouter)

// ---------------------------------------------------------------------------------------

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`)
})
