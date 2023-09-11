const express = require('express');
const router = express.Router();

const recordController = require('./../controller/records.js');

router.route("/").get(recordController.getAllRecords).post(recordController.createNewRecord);

router.route("/filter").get(recordController.filterRecords);

router.route("/:id").get(recordController.getRecord).put(recordController.updateRecord).delete(recordController.deleteRecord);

module.exports = router;
