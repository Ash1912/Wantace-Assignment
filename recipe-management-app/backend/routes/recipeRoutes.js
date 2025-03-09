const express = require("express");
const Recipe = require("../models/recipe");
const router = express.Router();

// ✅ GET all recipes
router.get("/", async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ GET a single recipe by ID
router.get("/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "❌ Recipe not found" });

        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ POST new recipe
router.post("/", async (req, res) => {
    try {
        console.log("🔹 Incoming Data:", req.body); // ✅ Log received data
        const { title, ingredients, instructions, category } = req.body;

        const newRecipe = new Recipe({ title, ingredients, instructions, category });
        const savedRecipe = await newRecipe.save();

        console.log("✅ Saved Recipe:", savedRecipe); // ✅ Log saved data
        res.status(201).json(savedRecipe);
    } catch (error) {
        console.error("❌ Error saving recipe:", error);
        res.status(400).json({ message: error.message });
    }
});


// ✅ PUT (Update) a recipe
router.put("/:id", async (req, res) => {
    try {
        const { title, ingredients, instructions, category } = req.body;
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { title, ingredients, instructions, category },
            { new: true, runValidators: true }
        );

        if (!updatedRecipe) {
            return res.status(404).json({ message: "❌ Recipe not found" });
        }

        res.json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ DELETE a recipe
router.delete("/:id", async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

        if (!deletedRecipe) {
            return res.status(404).json({ message: "❌ Recipe not found" });
        }

        res.json({ message: "✅ Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
