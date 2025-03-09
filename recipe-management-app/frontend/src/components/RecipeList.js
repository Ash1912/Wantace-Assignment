import React, { useEffect, useState } from "react";

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: "",
        ingredients: "",
        instructions: "",
        category: "",
    });

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/recipes");
                if (!response.ok) throw new Error("Failed to fetch recipes");

                const data = await response.json();
                setRecipes(data);
                setLoading(false);
            } catch (error) {
                setError("❌ Error fetching recipes.");
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    // Handle Edit Click
    const handleEditClick = (recipe) => {
        setEditingRecipe(recipe._id);
        setEditFormData({
            title: recipe.title,
            ingredients: recipe.ingredients.join(", "),
            instructions: recipe.instructions,
            category: recipe.category,
        });
    };

    // Handle Edit Input Change
    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    // Submit Edit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/recipes/${editingRecipe}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editFormData.title,
                    ingredients: editFormData.ingredients.split(",").map((i) => i.trim()),
                    instructions: editFormData.instructions,
                    category: editFormData.category,
                }),
            });

            if (!response.ok) throw new Error("Failed to update recipe");

            const updatedRecipe = await response.json();
            setRecipes((prevRecipes) =>
                prevRecipes.map((recipe) =>
                    recipe._id === editingRecipe ? updatedRecipe : recipe
                )
            );
            setEditingRecipe(null);
        } catch (error) {
            setError("❌ Error updating recipe.");
        }
    };

    // Delete Recipe
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;
        try {
            const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete recipe");

            setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== id));
        } catch (error) {
            setError("❌ Error deleting recipe.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📜 Recipe Collection</h2>
            {loading ? (
                <p>⏳ Loading...</p>
            ) : error ? (
                <p style={styles.error}>{error}</p>
            ) : recipes.length === 0 ? (
                <p>No recipes found.</p>
            ) : (
                <div style={styles.grid}>
                    {recipes.map((recipe) => (
                        <div key={recipe._id} style={styles.card}>
                            {editingRecipe === recipe._id ? (
                                <form onSubmit={handleEditSubmit}>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editFormData.title}
                                        onChange={handleEditChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="ingredients"
                                        value={editFormData.ingredients}
                                        onChange={handleEditChange}
                                        required
                                    />
                                    <textarea
                                        name="instructions"
                                        value={editFormData.instructions}
                                        onChange={handleEditChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="category"
                                        value={editFormData.category}
                                        onChange={handleEditChange}
                                        required
                                    />
                                    <button type="submit" style={styles.saveButton}>💾 Save</button>
                                    <button onClick={() => setEditingRecipe(null)} style={styles.cancelButton}>
                                        ❌ Cancel
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <h3>{recipe.title}</h3>
                                    <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
                                    <p><strong>Instructions:</strong> {recipe.instructions}</p>
                                    <p><strong>Category:</strong> {recipe.category}</p>
                                    <button onClick={() => handleEditClick(recipe)} style={styles.editButton}>
                                        ✏️ Edit
                                    </button>
                                    <button onClick={() => handleDelete(recipe._id)} style={styles.deleteButton}>
                                        🗑️ Delete
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { textAlign: "center", padding: "20px", backgroundColor: "#eef2f3" },
    title: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#333" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px", padding: "20px" },
    card: {
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        textAlign: "left",
        position: "relative",
    },
    error: { color: "red" },
    editButton: { marginTop: "10px", marginRight: "5px", padding: "5px 10px", backgroundColor: "#f0ad4e", color: "white", border: "none", cursor: "pointer" },
    deleteButton: { padding: "5px 10px", backgroundColor: "#d9534f", color: "white", border: "none", cursor: "pointer" },
    saveButton: { padding: "5px 10px", backgroundColor: "#5cb85c", color: "white", border: "none", cursor: "pointer" },
    cancelButton: { marginLeft: "5px", padding: "5px 10px", backgroundColor: "#bbb", color: "white", border: "none", cursor: "pointer" },
};

export default RecipeList;
