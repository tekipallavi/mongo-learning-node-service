const express = require("express");
const router = express.Router();

const {
  getProjectDetails,
  setProjectDetails,
  getProjects,
} = require("../controllers/project.controller");

router.get("/:id", getProjectDetails);
router.get("register", setProjectDetails);
router.post("getProjects", getProjects);

module.exports = router;
