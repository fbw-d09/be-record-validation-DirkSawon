const express = require('express');
const router = express.Router();
const authorization = require('./../middleware/authorization.js');
const validation = require('./../middleware/validation.js');

const userController = require('./../controller/users.js');

router.route("/").get(userController.getAllUsers).post(/* validation.method, */ userController.createNewUser);

//router.route("/auth").post(userController.authUser);

router.route("/filter").get(userController.filterUser);

router.route("/:id").get(authorization.authorize, userController.getUser).put(authorization.authorize, /* validation.method, */ userController.updateUser).delete(authorization.authorize, userController.deleteUser)//.post(userController.authUser);

// Test Routes for cookie-parser:
router.route("/login").post(userController.loginUser);
router.route("/test").get(authorization.authorize, userController.testLoggedInUser);
router.route("/logout").post(authorization.authorize, userController.logoutUser);

module.exports = router;
