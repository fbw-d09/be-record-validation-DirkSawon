const express = require('express');
const router = express.Router();

const userController = require('./../controller/users.js');

router.route("/").get(userController.getAllUsers).post(userController.createNewUser);

router.route("/auth").post(userController.authUser);

router.route("/filter").get(userController.filterUser);

//router.route("/:id").get(userController.getUser).put(userController.updateUser).delete(userController.deleteUser)//.post(userController.authUser);

router.route("/login").post(userController.loginUser);
router.route("/test").get(userController.testLoggedInUser);
router.route("/logout").post(userController.logoutUser);

module.exports = router;
