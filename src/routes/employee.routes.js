const express = require('express');
const router = express.Router();

const { getEmployeeDetails, setEmployeeDetails } = require( "../controllers/employee.controller.js");

router.get('/:id', getEmployeeDetails);
router.get('register', setEmployeeDetails);

router.get('/test', (req, res) => {
    setEmployeeDetails({body: {name: 'test1', techStack: ['React'], experience: 2}}, res);
})

module.exports =  router;
