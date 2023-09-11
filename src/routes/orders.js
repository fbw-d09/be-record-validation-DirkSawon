const express = require('express');
const router = express.Router();

const orderController = require('../controller/orders.js');

router.route("/").get(orderController.getAllOrders).post(orderController.createNewOrder);

router.route("/filter").get(orderController.filterOrders);

router.route("/:id").get(orderController.getOrder).put(orderController.updateOrder).delete(orderController.deleteOrder);

module.exports = router;
