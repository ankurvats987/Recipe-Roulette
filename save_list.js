const homeBtn = document.getElementById("home-btn");

const recipeList = document.getElementById("recipe-list");
const recipeBox = document.getElementById("recipe-box");

let savedRecipes = [];

homeBtn.onclick = function () {
    window.location.href = "index.html";
}

recipeList.addEventListener('click', (event) => {
    if (event.target && event.target.matches(".delete-btn")) {
        const card = event.target.closest(".recipe-box");

        if (card) {
            const index = Array.from(recipeList.children).indexOf(card);
            card.classList.add("slide-out");

            setTimeout(() => {
                card.remove();
                deleteRecipe(index);
            }, 300);
        }
    } else if (event.target && event.target.closest(".recipe-box")) {
        const card = event.target.closest(".recipe-box");
        const clickedRecipe = savedRecipes[Array.from(recipeList.children).indexOf(card)];

        window.location.href = `index.html?recipe=${clickedRecipe.idMeal}`;

    }

});

function deleteRecipe(index) {
    savedRecipes = savedRecipes.filter((_, i) => i !== index);
    localStorage.setItem('saved-recipes', JSON.stringify(savedRecipes));
}

function formatTimeStamp(timestamp) {
    let currentDate = new Date();
    let savedDate = new Date(timestamp);

    if (currentDate.toDateString() === savedDate.toDateString()) {
        return "Today";
    } 
    
    currentDate.setDate(currentDate.getDate() - 1);
    if (currentDate.toDateString() === savedDate.toDateString()) {
        return "Yesterday";
    }

    return savedDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function deleteDummyBoxes() {
    const dummyBoxes = recipeList.querySelectorAll(".skeleton");
    dummyBoxes.forEach((box) => box.remove());
}

async function downloadImage(imageUrl) {
    const response = await fetch(imageUrl);
    const imageData = await response.blob();

    return imageData;
}

async function displaySavedRecipes() {
    let savedRecipesObj = JSON.parse(localStorage.getItem("saved-recipes"));

    deleteDummyBoxes();

    if (Array.isArray(savedRecipesObj)) {
        savedRecipes = savedRecipesObj;
        for (let recipe of savedRecipes) {
            const imageBlob = await downloadImage(recipe.strMealThumb);

            let recipeBox = document.createElement("article");

            recipeBox.innerHTML = `
                <img src="${URL.createObjectURL(imageBlob)}" class="box-thumb">
                <div class="box-metadata">
                    <div class="metadata-header">
                        <span class="box-date">
                        ${formatTimeStamp(recipe.timeStamp)}</span>
                        <i title="Delete Recipe" class="delete-btn material-icons" style="font-size:16px;color:red">delete</i>
                    </div>
                    <span class="box-name">${recipe.strMeal}</span>
                </div>
                `;

            recipeBox.classList.add("recipe-box");

            recipeList.appendChild(recipeBox);
        };
    } 
}

displaySavedRecipes();
