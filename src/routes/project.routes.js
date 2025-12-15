const express = require('express');
const router = express.Router();

const { getProjectDetails, setProjectDetails, getProjects } = require( "../controllers/project.controller");

router.post('/getProjects', getProjects);
router.get('/:id', getProjectDetails);
router.get('register', setProjectDetails);


module.exports =  router;
