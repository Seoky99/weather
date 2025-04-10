async function submitRequest(searchQuery) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchQuery}?key=23TQH9KDEMJ6FHV2TD6WZDNBN`,
            {mode: 'cors'});
        if (!response.ok) {
            throw new Error(`${response.status}`);
        } 
        return response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

async function adjustDOM(searchQuery) {
    const data = await submitRequest(searchQuery); 

    let conditions = document.querySelector(".result-container #current-weather");
    let temperature = document.querySelector(".result-container #current-temp");

    conditions.textContent = data.currentConditions.conditions; 
    temperature.textContent = data.currentConditions.temp; 
}

function handleButtons() {
    const input = document.querySelector("#search-input");
    const submitButton = document.querySelector("form button");

    const test = document.querySelector("#test");
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        input.setCustomValidity("");

        if (!(input.validity.valid)) {
            input.reportValidity(); 
            return; 
        }

        try {
            await adjustDOM(input.value);
        } catch (err) {
            if (err.message === "400") {
                input.setCustomValidity("Please type a valid location.");
                input.reportValidity();
            } else {
                test.textContent = "Sorry! Server error";
            }

        } 
    }); 
} 


handleButtons(); 
//get 400: bad request