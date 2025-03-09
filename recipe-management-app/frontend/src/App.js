import React, { useState, useEffect } from "react";
import RecipeForm from "./components/RecipeForm";
import RecipeList from "./components/RecipeList";

const App = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        // Fetch existing recipes from the backend on page load
        const fetchRecipes = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/recipes");
                if (!response.ok) throw new Error("Failed to fetch recipes");

                const data = await response.json();
                setRecipes(data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div>
            <h1>Recipe Manager 🍽</h1>
            <RecipeForm setRecipes={setRecipes} />   {/* ✅ Pass setRecipes */}
            <RecipeList recipes={recipes} />         {/* ✅ Pass recipes */}
        </div>
    );
};

export default App;
