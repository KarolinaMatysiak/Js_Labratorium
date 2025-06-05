import { getWeatherData, getCity, saveCity, getSavedLocations, addToSavedLocations, removeFromSavedLocations } from './weatherData.js';

let updateInterval;

function isCacheValid(timestamp) {
    const fiveMinutes = 5 * 60 * 1000;
    const now = Date.now();
    return (now - timestamp) < fiveMinutes;
}

async function displayWeatherForCity(cityName, cityInfo) {
    const weatherCache = localStorage.getItem('weatherCache');
    if (weatherCache) {
        const cache = JSON.parse(weatherCache);
        if (cache[cityName] && isCacheValid(cache[cityName].timestamp)) {
            weatherDisplay(cache[cityName].data, cityInfo);
            return;
        }
    }

    const weatherInfo = await getWeatherData(cityName);
    if (weatherInfo && cityInfo) {
        const newCache = JSON.parse(localStorage.getItem('weatherCache') || '{}');
        newCache[cityName] = {
            timestamp: Date.now(),
            data: weatherInfo
        };
        localStorage.setItem('weatherCache', JSON.stringify(newCache));
        
        weatherDisplay(weatherInfo, cityInfo);
    }
}

function setupAutoUpdate(cityName, cityInfo) {
    clearInterval(updateInterval);
    updateInterval = setInterval(() => displayWeatherForCity(cityName, cityInfo), 5 * 60 * 1000);
}

export function getSearchBarValue() {
    return document.getElementById("searchBar").value;
}

export async function handleCitySearch() {
    const cityInput = getSearchBarValue();
    
    await saveCity(cityInput);
    const cityInfo = await getCity(cityInput);
    
    if (cityInfo) {
        addToSavedLocations(cityInfo);
        displaySavedLocations();
        await displayWeatherForCity(cityInput, cityInfo);
        setupAutoUpdate(cityInput, cityInfo);
    }
}

function weatherDisplay(weatherInfo, cityInfo) {
    const container = document.getElementById("weatherDisplay");
    const searchInput = getSearchBarValue();
    
    if (!searchInput.trim()) {
        container.innerHTML = '';
        return;
    }
    
    if (!weatherInfo || !cityInfo) {
        container.innerHTML = 'Nie znaleziono miasta';
        return;
    }
    
    container.innerHTML = '';
    const weatherIconContainer = document.createElement("div");
    const weatherIcon = document.createElement("img");
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo.weatherIcon}@2x.png`;
    weatherIcon.alt = 'Weather icon';
    weatherIconContainer.appendChild(weatherIcon);
    
    const cityName = document.createElement("h2");
    const temp = document.createElement("p");
    const dampness = document.createElement("p");
    
    cityName.textContent = `${cityInfo.cityName}, ${cityInfo.countryCode}`;
    temp.textContent = `Temperatura: ${weatherInfo.temperature}°C`;
    dampness.textContent = `Wilgotność: ${weatherInfo.humidity}%`;
    container.append(weatherIconContainer, cityName, temp, dampness);
}

export async function displaySavedLocations() {
    const savedLocations = getSavedLocations();
    const container = document.createElement('div');
    container.className = 'saved-locations';
    
    if (savedLocations.length > 0) {
        const title = document.createElement('h3');
        title.textContent = 'Zapisane lokalizacje:';
        container.appendChild(title);
        
        for (const location of savedLocations) {
            const locationItem = document.createElement('div');
            locationItem.className = 'location-item';
            
            const locationText = document.createElement('span');
            locationText.textContent = `${location.cityName}, ${location.countryCode}`;
            locationText.style.cursor = 'pointer';
            locationText.onclick = async () => {
                const weatherInfo = await getWeatherData(location.cityName);
                weatherDisplay(weatherInfo, location);
            };
            
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Usuń';
            removeButton.onclick = () => {
                removeFromSavedLocations(location.cityName, location.countryCode);
                displaySavedLocations();
            };
            
            locationItem.appendChild(locationText);
            locationItem.appendChild(removeButton);
            container.appendChild(locationItem);
        }
    }
    

    const existingContainer = document.querySelector('.saved-locations');
    if (existingContainer) {
        existingContainer.replaceWith(container);
    } else {
        document.body.appendChild(container);
    }
}


window.addEventListener('load', async () => {
    displaySavedLocations();
    const savedLocations = getSavedLocations();
    if (savedLocations.length > 0) {
        const lastCity = savedLocations[savedLocations.length - 1];
        // Wyświetl pogodę i ustaw aktualizacje
        await displayWeatherForCity(lastCity.cityName, lastCity);
        setupAutoUpdate(lastCity.cityName, lastCity);
    }
}); 