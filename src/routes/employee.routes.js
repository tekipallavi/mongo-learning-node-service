const express = require('express');
const router = express.Router();

const { getEmployeeDetails, setEmployeeDetails } = require( "../controllers/employee.controller.js");

router.get('/:id', getEmployeeDetails);
router.get('register', setEmployeeDetails);

module.exports =  router;
