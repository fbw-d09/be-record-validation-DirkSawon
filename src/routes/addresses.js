const express = require('express');
const router = express.Router();

const orderController = require('../controller/addresses.js');

router.route("/").get(orderController.getAllAddresses).post(orderController.createNewAddress);

router.route("/:id").get(orderController.getAddress).put(orderController.updateAddress).delete(orderController.deleteAddress);

module.exports = router;

