document.addEventListener('DOMContentLoaded', function() {
    
    const searchInputs = document.querySelectorAll('input[type="text"]');

    // event listner for each input entered
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter'){
                searchInput(this.value, this)
            }
        }) 
    })
})

// Accordion + / - based on toggle
const toggleButtons = document.querySelectorAll('.toggle-icon');
toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
        if(this.textContent === '-'){
            this.textContent = '+';
        } else {
            this.textContent = '-';
        }
    })
})

async function searchInput(query, inputElement){
    // search food function
    if(!query || query.trim().length === 0){return;}
    
    try{
        const response = await fetch('/api/search-food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mealInput: query.trim()
            })
        })

        const data = await response.json();
        console.log(data);

        if(response.ok){
            displayInput(data.foodItemsRes, inputElement);
        }else {
            showError(data.error || 'Failed to search food items', inputElement);
        }
        }
    catch(error){
        console.error('Search error:', error);
        showError('Network error. Please check your connection.', inputElement);
    }
};

function displayInput(foods, inputElement) {
    // Only clear previous errors, keep previous food results
    clearPreviousErrors(inputElement);
    
    // display the food item function
    if(!foods || foods.length === 0){
        showError('No food items found', inputElement)
        return;
    }

    const results = document.createElement('div');
    results.className = 'food-results mt-2';
    results.style.maxHeight = '200px';
    results.style.overflowY = 'auto';
    results.style.border = '1px solid #ccc';
    results.style.padding = '10px';
    results.style.backgroundColor = '#f9f9f9';
    results.style.borderRadius = '5px';
    results.style.color = '#6fa870';

    foods.forEach(food => {
       const foodItem = document.createElement('div');
       foodItem.textContent = food.food_name + ' - ' + food.calories + ' calories';
       foodItem.className = 'food-item';
       results.appendChild(foodItem);
    })
     // Insert results after the input
    inputElement.parentNode.insertBefore(results, inputElement.nextSibling);
}

function showError(message, inputElement) {
    // show error messages on wrong/invalid input
    // Only clear previous errors, NOT food results
    clearPreviousErrors(inputElement);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-results';
    errorDiv.innerHTML = `<strong><i>${message}</i></strong>`
    errorDiv.style.color = 'red';

    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
}


function clearPreviousErrors(inputElement) {
    // Only clear error messages, keep food results
    const existingErrors = inputElement.parentNode.querySelectorAll('.error-results');
    existingErrors.forEach(error => error.remove());
}


function sendToBackend() {
    // send the food item to backend function
}



