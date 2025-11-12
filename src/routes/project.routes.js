const express = require('express');
const router = express.Router();

const { getProjectDetails, setProjectDetails } = require( "../controllers/project.controller");

router.get('/:id', getProjectDetails);
router.get('register', setProjectDetails);

module.exports =  router;
