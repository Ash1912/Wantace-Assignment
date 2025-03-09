import React, { useState } from "react";

const RecipeForm = ({ setRecipes }) => {
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!title || !ingredients || !instructions || !category) {
            setError("⚠️ All fields are required.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/recipes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    ingredients: ingredients.split(",").map((i) => i.trim()), // Convert to array
                    instructions,
                    category,  // ✅ Fixed issue (removed extra quotes)
                }),
            });

            if (!response.ok) throw new Error("❌ Failed to add recipe");

            const newRecipe = await response.json();
            // ✅ Immediately update the recipe list
            setRecipes((prevRecipes) => {
            const updatedRecipes = [...prevRecipes, newRecipe];
            console.log("✅ Updated Recipes:", updatedRecipes); // Debugging
            return updatedRecipes;
        });

        // ✅ Clear the form
        setTitle("");
        setIngredients("");
        setInstructions("");
        setCategory("");
        } catch (error) {
            setError("❌ Error adding recipe.");
            console.error(error);
        }
    };

    return (
        <div style={styles.container}>
            {/* <h2 style={styles.mainTitle}>Recipe Management</h2> */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Recipe Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Ingredients (comma-separated)"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    style={styles.input}
                />
                <textarea
                    placeholder="Cooking Instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    style={styles.textarea}
                />
                <input
                    type="text"
                    placeholder="Category (e.g., Vegetarian, Non-Vegetarian)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={styles.input}
                />
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>➕ Add Recipe</button>
            </form>
        </div>
    );
};

const styles = {
    container: { textAlign: "center", padding: "20px", backgroundColor: "#f4f4f4" },
    mainTitle: { color: "#0066cc", fontSize: "28px", fontWeight: "bold" },
    form: { display: "flex", flexDirection: "column", alignItems: "center", background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" },
    input: { width: "90%", padding: "10px", margin: "8px 0", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" },
    textarea: { width: "90%", height: "80px", padding: "10px", margin: "8px 0", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" },
    button: { backgroundColor: "#28a745", color: "white", padding: "10px 15px", borderRadius: "5px", border: "none", cursor: "pointer", fontSize: "16px" },
    error: { color: "red", marginBottom: "10px" }
};

export default RecipeForm;
