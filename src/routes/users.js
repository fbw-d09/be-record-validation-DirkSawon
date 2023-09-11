const express = require('express');
const router = express.Router();

const userController = require('./../controller/users.js');

router.route("/").get(userController.getAllUsers).post(userController.createNewUser);

router.route("/filter").get(userController.filterUser);

router.route("/:id").get(userController.getUser).put(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
