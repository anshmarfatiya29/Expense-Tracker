// A:\Expense Tracker\backend\routes\suggestionRoutes.js

const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { 
    getBudgetSuggestion, 
    getIncomeGrowthSuggestion 
} = require("../controllers/suggestionController");

const router = express.Router();

router.get("/budget", protect, getBudgetSuggestion);
router.get("/income-growth", protect, getIncomeGrowthSuggestion);

module.exports = router;