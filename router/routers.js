const express = require("express")
const router = express.Router()
const { signUp, logIn, updateUser, logOut } = require("../controller/controller.js")
const authenticate = require("../authentication/authorization.js")


router.post("/signup", signUp)
router.post("/login", logIn)
router.put("/updateuser", authenticate, updateUser)
router.put("/logout", authenticate, logOut)

module.exports = router
