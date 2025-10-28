const router = require("express").Router()

const isSignedIn = require("../middleware/is-signed-in")
//Auth controller
const authCtrl = require("../controllers/auth")

// Routes/ Call API's
router.get("/sign-up", authCtrl.auth_signup_get)
router.post("/sign-up", authCtrl.auth_signup_post)
router.get("/sign-in", authCtrl.auth_signin_get)
router.post("/sign-in", authCtrl.auth_signin_post)
router.get("/sign-out", authCtrl.auth_signout_get)

router.get("/vip-lounge", isSignedIn, (req, res) => {
  res.render("auth/vip-lounge.ejs")
})
module.exports = router
