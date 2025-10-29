const express = require('express');
const router = express.Router();

const { getEmployeeDetails } = require( "../controllers/employee.controller.js");

router.get('/:id', getEmployeeDetails);

module.excports =  router;
