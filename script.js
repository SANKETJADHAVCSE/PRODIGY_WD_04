const apiKey = '0d506206c90e877cf487c90ea5aee1d3'; // Replace with your actual OpenWeatherMap API key

document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        }, showError);
    } else {
        document.getElementById('weather-info').innerText = 'Geolocation is not supported by this browser.';
    }
});

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('weather-info').innerText = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('weather-info').innerText = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('weather-info').innerText = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('weather-info').innerText = "An unknown error occurred.";
            break;
    }
}

function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    fetchWeather(url);
}

function fetchWeatherByInput() {
    const location = document.getElementById('location-input').value.trim();
    if (!location) {
        document.getElementById('weather-info').innerText = 'Please enter a location.';
        return;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    fetchWeather(url);
}

function fetchWeather(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            document.getElementById('weather-info').innerText = `Error: ${error.message}`;
            console.error('Error fetching weather data:', error);
        });
}

function displayWeather(data) {
    const weatherInfo = `
        <h2>${data.name}</h2>
        <p>${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    document.getElementById('weather-info').innerHTML = weatherInfo;
}
