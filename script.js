//DOM
const recipeIdInput = document.getElementById('recipeId');
const titleInput = document.getElementById('title');
const ingredientsInput = document.getElementById('ingredients');
const instructionsInput = document.getElementById('instructions');
const cuisineInput = document.getElementById('cuisine');
const addOrUpdateBtn = document.getElementById('addOrUpdateBtn');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchText');
const filterCuisineInput = document.getElementById('filterCuisine');
const recipesListContainer = document.getElementById('recipesList');

// Array to store all recipes, loaded from Local Storage.
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

// Displays recipes on the page. 
function displayRecipes(recipeList) {
    // 1. Clear the current list.
    recipesListContainer.innerHTML = '';

    // 2. Show a message if no recipes are found.
    if (recipeList.length === 0) {
        recipesListContainer.innerHTML = '<p class="card">No recipes found.</p>';
        return;
    }

    // 3. Create and add card for each recipe.
    recipeList.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';

        // Pass the recipe's ID as a string.
        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <p class="cuisine">Cuisine: ${recipe.cuisine || 'Not Specified'}</p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions || 'No instructions.'}</p>
            <div class="actions">
                <button class="btn btn-edit" onclick="editRecipe('${recipe.id}')">Edit</button>
                <button class="btn btn-delete" onclick="deleteRecipe('${recipe.id}')">Delete</button>
            </div>
        `;
        recipesListContainer.appendChild(recipeCard);
    });
}

// Saves recipes to Local Storage.
function saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Adds a new recipe or updates one. 
function addOrUpdateRecipe() {
    const id = recipeIdInput.value;
    const title = titleInput.value.trim();
    const ingredients = ingredientsInput.value.trim();

    // Validate required fields.
    if (!title || !ingredients) {
        alert('Title and Ingredients are required.');
        return;
    }

    if (id) {
        // If ID exists, it's an update.
        const recipeToUpdate = recipes.find(r => r.id === id);
        if (recipeToUpdate) {
            recipeToUpdate.title = title;
            recipeToUpdate.ingredients = ingredients;
            recipeToUpdate.instructions = instructionsInput.value.trim();
            recipeToUpdate.cuisine = cuisineInput.value;
        }
    } else {
        // If no ID, it's a new recipe.
        const newRecipe = {
            id: Date.now().toString(), // Create a unique ID.
            title,
            ingredients,
            instructions: instructionsInput.value.trim(),
            cuisine: cuisineInput.value,
        };
        recipes.push(newRecipe);
    }

    saveRecipes();      // Save changes.
    displayRecipes(recipes); // Refresh the display.
    resetForm();        // Clear the form.
}

// Prepares the form for editing. 
function editRecipe(id) {
    const recipeToEdit = recipes.find(r => r.id === id);
    if (recipeToEdit) {
        // Fills form fields with recipe data.
        recipeIdInput.value = recipeToEdit.id;
        titleInput.value = recipeToEdit.title;
        ingredientsInput.value = recipeToEdit.ingredients;
        instructionsInput.value = recipeToEdit.instructions;
        cuisineInput.value = recipeToEdit.cuisine;
        addOrUpdateBtn.textContent = 'Update Recipe'; // Change button text.
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top.
    }
}

// Deletes a recipe.
function deleteRecipe(id) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        // Filter out the recipe to be deleted.
        recipes = recipes.filter(r => r.id !== id);
        saveRecipes();      // Save changes.
        displayRecipes(recipes); // Refresh the display.
    }
}

// Clears the form fields. 
function resetForm() {
    document.getElementById('recipeForm').reset();
    recipeIdInput.value = ''; // Clear the hidden ID.
    addOrUpdateBtn.textContent = 'Add Recipe'; // Restore button text.
}

// Filters recipes by search and cuisine. 
function searchAndFilter() {
    const searchText = searchInput.value.toLowerCase();
    const filterCuisine = filterCuisineInput.value.toLowerCase();

    const filteredRecipes = recipes.filter(recipe => {
        const searchMatch = recipe.title.toLowerCase().includes(searchText) || recipe.ingredients.toLowerCase().includes(searchText);
        const cuisineMatch = !filterCuisine || (recipe.cuisine && recipe.cuisine.toLowerCase() === filterCuisine);
        
        return searchMatch && cuisineMatch;
    });

    displayRecipes(filteredRecipes);
}

// Assign functions to events.
addOrUpdateBtn.addEventListener('click', addOrUpdateRecipe);
resetBtn.addEventListener('click', resetForm);
searchInput.addEventListener('input', searchAndFilter);
filterCuisineInput.addEventListener('change', searchAndFilter);

// Display all recipes on initial page load.
displayRecipes(recipes);