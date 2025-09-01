import React, { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [budgetSuggestion, setBudgetSuggestion] = useState("");
    const [growthSuggestion, setGrowthSuggestion] = useState("");

    // Function to update user data 
    const updateUser = (userData) => {
        setUser(userData);
        
    };

    // Function to clear user data (e.g., on logout)
    const clearUser = () => {
        setUser(null);
        setBudgetSuggestion("");
        setGrowthSuggestion("");
    };

     const updateBudgetSuggestion = (suggestion) => {
        setBudgetSuggestion(suggestion);
    };

    const updateGrowthSuggestion = (suggestion) => {
        setGrowthSuggestion(suggestion);
    };

    return (
        <UserContext.Provider
        value={{
            user,
            updateUser,
            clearUser,
            budgetSuggestion,
            growthSuggestion,
            updateBudgetSuggestion,
            updateGrowthSuggestion,
        }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;