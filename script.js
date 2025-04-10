async function submitRequest(searchQuery) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchQuery}?key=23TQH9KDEMJ6FHV2TD6WZDNBN`,
            {mode: 'cors'});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        } 
        return response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

/*async function test() {
    try {
        console.log(await submitRequest("Londo2asddasn"));
        console.log("success");
    } catch(err) {
        console.log(err);
    }
}

test().catch(() => {console.log("success!!")}); */

async function adjustDOM(searchQuery) {
    const data = await submitRequest(searchQuery); 

    let conditions = document.querySelector(".result-container #current-weather");
    let temperature = document.querySelector(".result-container #current-temp");

    conditions.textContent = data.currentConditions.conditions; 
    temperature.textContent = data.currentConditions.temp; 
}

function handleButtons() {
    const form = document.querySelector("form");
    const input = document.querySelector("#search-input");

    const test = document.querySelector("#test");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            await adjustDOM(input.value);
        } catch (err) {
            test.textContent = err;
            console.log("here!");
        }
    }); 
} 


handleButtons(); 
//get 400: bad request