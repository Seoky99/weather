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

function GIFByWeather(condition) {
    const GIFDirectory = {
        Clear: "https://api.giphy.com/v1/gifs/0Styincf6K2tvfjb5Q?api_key=4qIV756QRnYzWpZz4I7BQDEdw7iakPcZ&rating=g",
        Overcast: "https://api.giphy.com/v1/gifs/dBXNPw0XBdF1n82BBf?api_key=4qIV756QRnYzWpZz4I7BQDEdw7iakPcZ&rating=g",
        "Partially cloudy": "https://api.giphy.com/v1/gifs/gs2ubveMcc2zPVNceK?api_key=4qIV756QRnYzWpZz4I7BQDEdw7iakPcZ&rating=g",
        Precip: "https://api.giphy.com/v1/gifs/YkAelW2UG3aIHbqEZq?api_key=4qIV756QRnYzWpZz4I7BQDEdw7iakPcZ&rating=g",
        Snow: "https://api.giphy.com/v1/gifs/6YNgoTEPs6vZe?api_key=4qIV756QRnYzWpZz4I7BQDEdw7iakPcZ&rating=g",
        Sunshine: "https://api.giphy.com/v1/gifs/uqpK3SuxEY4W9YQvdg?api_key=4qIV756QRnYzWpZz4I7BQDEdw7iakPcZ&rating=g",
        other: "https://api.giphy.com/v1/gifs/8v6Z3YyULB5Q0Skbac?api_key=4qIV756QRnYzWpZz4I7BQDEdw7iakPcZ&rating=g",
    }
    return (condition in GIFDirectory) ? GIFDirectory[condition] : GIFDirectory["other"];
}

function createGIF(condition) {

    const fetchPromise = fetch(GIFByWeather(condition), {mode: 'cors'})

    const returnPromise = fetchPromise
    .then(response => {
        if(!response.ok) {
            throw new Error(response.status);
        }
        return response.json(); 
    }).then(result => {
        return result.data.images.original.url; 
    }).catch(err => console.log(err));
    return returnPromise;
} 

async function adjustDOM(searchQuery) {
    const data = await submitRequest(searchQuery); 
    
    createGIF(data.currentConditions.conditions).then(url => {
        const gifcontainer = document.querySelector(".img-container div");
        gifcontainer.replaceChildren();
        const img = document.createElement("img");
        img.src = url; 
        img.height = "400";
        img.width = "400";
        gifcontainer.appendChild(img);
    }).catch(err => {
        throw new Error(err);
    });

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
