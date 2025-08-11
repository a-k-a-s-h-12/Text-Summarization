const express = require("express");
const router = express.Router();
const {askQuestion} = require('../controllers/questionController')
const authMiddleware =  require("../middleware/authMiddleware")
router.post('/questionAndAnswers',authMiddleware,askQuestion);

module.exports = router;


