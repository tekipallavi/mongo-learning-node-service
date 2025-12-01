const express = require('express');
const router = express.Router();

const { createInterest } = require('../controllers/interest.contoller');

router.get('/create', createInterest);

module.exports =  router;