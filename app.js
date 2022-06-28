const searchBtn = document.querySelector('.search-btn')
const mealList = document.querySelector('#meal')
const mealDataContent = document.querySelector('.meal-details-content')
const mealDetails = document.querySelector('.meal-details')
const recipeCloseBtn = document.querySelector('.recipe-close-btn')
const backToCatagorybtn = document.querySelector('.back')
const title = document.querySelector('#title');


// Event Listener 
searchBtn.addEventListener('click' , getMealsList)
window.addEventListener('load' , loadCatagories)
backToCatagorybtn.addEventListener('click' , ()=>{
    document.querySelector('.search-control').value = '';
    loadCatagories()
})
recipeCloseBtn.addEventListener('click' , ()=> mealDetails.classList.remove('show'))


// Show Catagories On Load 
function loadCatagories()
{
    title.textContent = 'Catagories'
    backToCatagorybtn.classList.remove('show')
    fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then(response => response.json())
    .then(data => 
    {
        let html = ""
        data.categories.forEach(cat => 
        {
            html+= `
            <div class="meal-item">
                <div class="meal-img">
                    <img src=${cat.strCategoryThumb} alt="">
                </div>
                <h3 class="meal-name"></h3>
                <a href="#" class="recipe-btn" onclick="getByCat('${cat.strCategory}')" >${cat.strCategory}</a>
                </div>
            `
        })
        mealList.innerHTML = html;
    })
}


// Fetch By Catagory Name 
function getByCat(catagory){
    document.querySelector('.search-control').value = catagory;
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catagory}`)
    .then(response => response.json())
    .then(data => {
        showResults(data)
    })
}


// Fetch By Search Button 
function getMealsList(){
    let mealsInput = document.querySelector('.search-control').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mealsInput}`)
    .then(response => response.json())
    .then(data => {
        showResults(data)
    })
    
}

// Show The Results 
function showResults(data){
    backToCatagorybtn.classList.add('show')
    title.textContent = "Items"
    let html = ""
    if(data.meals){
        data.meals.forEach(meal => {
            html+= `
            <div class="meal-item" data-id=${meal.idMeal} onclick="showDetails(this)">
                <div class="meal-img">
                    <img src=${meal.strMealThumb} alt="">
                </div>
                <h3 class="meal-name">${meal.strMeal}</h3>
                <a href="#" class="recipe-btn" >Get Recipe</a>
             </div>
            `
        });
    }
    mealList.innerHTML = html;
}


function showDetails(item){
    const id = item.dataset.id;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(response => response.json())
    .then(data => {
        const meal = data.meals[0]
        mealDetails.classList.add('show')
        console.log(data);
        mealDataContent.innerHTML = `
            <div class="info">
                <img src=${meal.strMealThumb} alt="">
                <div class="info-txt">
                    <h2 class="name">${meal.strMeal}</h2>
                    <p class="cat">Catagory: ${meal.strCategory}</p>
                    <p class="cat">Origin: ${meal.strArea}</p>
                </div>
            </div>
            <span class="line"></span>
            <h2>How To Prepare</h2>
            <p class="instructions">${meal.strInstructions}</p>
            <a target="_blanck" href=${meal.strYoutube}>Watch Video</a>
        `
    })
}