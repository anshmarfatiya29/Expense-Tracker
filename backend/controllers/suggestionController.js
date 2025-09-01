// A:\Expense Tracker\backend\controllers\suggestionController.js

const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- Budget Suggestion Controller ---
exports.getBudgetSuggestion = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch last 30 days of expenses
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const expenses = await Expense.find({ userId, date: { $gte: last30Days } });

        if (expenses.length === 0) {
            return res.status(200).json({ suggestion: "Not enough expense data from the last 30 days to generate a suggestion. Please add more expenses." });
        }

        // 2. Summarize expenses by category
        const expenseSummary = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        const formattedSummary = Object.entries(expenseSummary)
            .map(([category, amount]) => `${category}: $${amount.toFixed(2)}`)
            .join(", ");
        
        // 3. Create the AI Prompt
        const prompt = `
            You are a friendly and insightful financial advisor for an app called "Expense Tracer".
            A user has provided their expense summary for the last 30 days.
            Expense Summary: ${formattedSummary}.
            Based on this, provide a concise, actionable, and encouraging budget suggestion.
            - Identify the top 1 or 2 spending categories.
            - Suggest specific, practical ways to reduce spending in those areas without being too restrictive.
            - Keep the tone positive. Start with something like "Here is your personalized budget suggestion!".
            - Format the output nicely using markdown bullet points.
        `;
        
        // 4. Get response from Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const suggestionText = response.text();

        res.status(200).json({ suggestion: suggestionText });

    } catch (error) {
        console.error("Error getting budget suggestion:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// --- Income Growth Suggestion Controller ---
exports.getIncomeGrowthSuggestion = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Calculate total savings (Income - Expense) for the last 30 days
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentIncomes = await Income.find({ userId, date: { $gte: last30Days } });
        const recentExpenses = await Expense.find({ userId, date: { $gte: last30Days } });

        const totalIncome = recentIncomes.reduce((sum, item) => sum + item.amount, 0);
        const totalExpense = recentExpenses.reduce((sum, item) => sum + item.amount, 0);
        const savings = totalIncome - totalExpense;

        if (savings <= 0) {
            return res.status(200).json({ suggestion: "Your expenses are greater than your income for the last 30 days. Focus on creating a positive saving balance before looking for investment options." });
        }

        // 2. Create the AI Prompt with a strong disclaimer
        const prompt = `
            You are a financial educator for an app called "Expense Tracer".
            **IMPORTANT: You must not give direct financial advice.**
            Your role is to provide educational information about investment options.
            A user has saved $${savings.toFixed(2)} this month.
            Based on this amount, provide some general, educational suggestions on how they could potentially grow their money.
            - Explain 2-3 different types of investment options (e.g., High-Yield Savings Accounts, Index Funds, Stocks for beginners).
            - For each option, briefly explain what it is and its general risk level (e.g., low, medium, high).
            - Do not recommend any specific stock, fund, or financial product.
            - Start with a clear disclaimer: "This is not financial advice, but educational information to help you explore your options. Always do your own research or consult a professional financial advisor."
            - Keep the tone encouraging and informative.
            - Format the output nicely using markdown headers and bullet points.
        `;
        
        // 3. Get response from Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const suggestionText = response.text();

        res.status(200).json({ suggestion: suggestionText });

    } catch (error) {
        console.error("Error getting income growth suggestion:", error);
        res.status(500).json({ message: "Server Error" });
    }
};