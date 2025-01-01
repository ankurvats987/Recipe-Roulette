const recipeName = document.getElementById("recipe-name");
const recipeMetaData = document.getElementsByClassName("recipe-metadata");
const recipeSteps =  document.getElementById("recipe-steps");
const recipeThumb = document.getElementById("recipe-thumb");
const recipeIngredientsWrapper = document.getElementById("ingredient-wrapper");
const dummyIngredients = document.getElementById("dummy-ingredients");

const header = document.getElementsByTagName("header");

const savedRecipeBtn = document.getElementById("show-saved-btn");
const saveRecipeBtn = document.getElementById("save-recipe-btn");
const saveContinueBtn = document.getElementById("save-continue-btn");
const alreadyContinueBtn = document.getElementById("already-continue-btn");
const cancelBtn = document.getElementById("cancel-btn");
const deleteBtn = document.getElementById("delete-btn");

const savedRecipeDialog = document.getElementById("saved-dialog");
const deleteRecipeDialog = document.getElementById("delete-dialog");
const alreadyThereDialog = document.getElementById("already-there-dialog");

let foodData = [];
let recipeId;

function generateRandomNumber () {
    const randomValue1 = Math.floor(Math.random() * (2 - 1 + 1)) + 1; // Random integer between 1 and 2
    const randomValue2 = Math.floor(Math.random() * (4 - 3 + 1)) + 3; // Random integer between 3 and 4

    const formattedValue = `${randomValue1} - ${randomValue2}`;

   return formattedValue;
}

savedRecipeBtn.onclick = function () {
    window.location.href = "saved_recipes.html";
}

saveRecipeBtn.addEventListener('click', () => {
    if (foodData) {
        if (recipeId) {
            deleteRecipeDialog.showModal();
            deleteRecipeDialog.style.visibility = "visible";
        } else {
            let savedRecipes = JSON.parse(
                localStorage.getItem("saved-recipes"));

            if (savedRecipes && Array.isArray(savedRecipes)) {
                for (let recipe of savedRecipes) {
                    if (recipe.idMeal === foodData.idMeal) {
                        alreadyThereDialog.showModal();
                        alreadyThereDialog.style.visibility = "visible";
                        console.log("Already saved");
    
                        return;
                    }
                }
            }

            let currentTimestamp = Date.now();
            foodData.timeStamp = currentTimestamp;

            if (!Array.isArray(savedRecipes)) {
                savedRecipes = [];
            }

            savedRecipes.push(foodData);
            localStorage.setItem("saved-recipes", JSON.stringify(savedRecipes));

            savedRecipeDialog.showModal();
            savedRecipeDialog.style.visibility = "visible"; 
        }
    } else {
        alert("The data hasn't loaded yet.")
    }    
});

saveContinueBtn.addEventListener('click', () => {
    savedRecipeDialog.close();
    savedRecipeDialog.style.visibility = "hidden";
});

alreadyContinueBtn.addEventListener('click', () => {
    alreadyThereDialog.close();
    alreadyThereDialog.style.visibility = "hidden";
})

cancelBtn.addEventListener('click', () => {
    deleteRecipeDialog.close();
    deleteRecipeDialog.style.visibility = "hidden";
});

deleteBtn.addEventListener('click', () => {
    let savedRecipes = JSON.parse(localStorage.getItem("saved-recipes"));

    savedRecipes = savedRecipes.filter((recipe) => recipe.idMeal != recipeId);
    console.log(savedRecipes);
    localStorage.setItem("saved-recipes", JSON.stringify(savedRecipes));

    deleteRecipeDialog.close();
    deleteRecipeDialog.style.visibility = "hidden";

    window.location.href = "saved_recipes.html";
});

async function downloadImage(imageUrl) {
    const response = await fetch(imageUrl);
    const imageData = await response.blob();

    return imageData;
}

async function getData(URL) {
    const response = await fetch(URL);
    const data = await response.json();
    const foodData = data.meals[0];

    return foodData;
}

async function displayData() {
    const queryParams = new URLSearchParams(window.location.search);
    recipeId = queryParams.get("recipe");

    if (recipeId) {
        updateChanges();
        foodData = await getData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
    } else {
        foodData = await getData("https://www.themealdb.com/api/json/v1/1/random.php");
    }

    const recipeImageBlob = await downloadImage(foodData.strMealThumb);

    recipeThumb.classList.toggle("skeleton");
    recipeThumb.src = URL.createObjectURL(recipeImageBlob);
    recipeName.classList.toggle("skeleton");
    recipeName.textContent = foodData.strMeal;
    
    recipeMetaData[0].querySelector("span").classList.toggle("skeleton");
    recipeMetaData[0].querySelector("span").textContent = 
    foodData.strCategory;

    recipeMetaData[1].querySelector("span").classList.toggle("skeleton");
    recipeMetaData[1].querySelector("span").textContent = 
    foodData.strArea;

    recipeMetaData[2].querySelector("span").classList.toggle("skeleton");
    recipeMetaData[2].querySelector("span").textContent = generateRandomNumber();

    recipeSteps.textContent = foodData.strInstructions;

    dummyIngredients.remove();
    for (let index = 0; index < 20; index++) {
        const key = `strIngredient${index + 1}`;
        const ingredientName = foodData[key];
        const ingredientBlob = await downloadImage(`https://www.themealdb.com/images/ingredients/${ingredientName}.png`);


        if (ingredientName) {
            const ingredientWrapper = document.createElement("article");
            ingredientWrapper.innerHTML = `<div class="img-wrapper">
                                    <img src="${URL.createObjectURL(ingredientBlob)}">
                                </div>
                                <span>${ingredientName}</span>
                                `;
            ingredientWrapper.classList.add("ingredient");
        
            recipeIngredientsWrapper.appendChild(ingredientWrapper);
        }

        
    }

    
}

function updateChanges() {
    const buttonContainer = document.getElementById("button-container");
    const homeBtn = document.createElement("button");
    homeBtn.id = "show-saved-btn";
    homeBtn.textContent =  "Home";
    homeBtn.onclick = () => window.location.href = "index.html";

    buttonContainer.appendChild(homeBtn);
    saveRecipeBtn.textContent = "Delete Recipe";
}


displayData();