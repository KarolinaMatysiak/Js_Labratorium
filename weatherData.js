const API_KEY = "74b6f9526661ce8c439966d51fe11e73"; 
const MAX_SAVED_LOCATIONS = 10;

export async function getWeatherData(cityName) {
    try {
        const city = await getCity(cityName);
        if (!city) return null;

        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city.cityName},${city.countryCode}&APPID=${API_KEY}&units=metric`);
        const weatherInfo = await response.json();
        
        if (weatherInfo) {
            return {
                temperature: weatherInfo.main.temp,
                humidity: weatherInfo.main.humidity,
                weatherIcon: weatherInfo.weather[0].icon
            };
        }
        return null;
    } catch (error) {
        console.error('Błąd podczas pobierania pogody:', error);
        return null;
    }
}

export async function saveCity(cityName){
    try {
        if (!await isCityInLocalStorage(cityName)) {
            const cityData = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`);
            const [cityFromAPI] = await cityData.json();
            
            if (cityFromAPI) {
                const citiesFromLocalStorage = JSON.parse(localStorage.getItem('cities') || '[]');
                citiesFromLocalStorage.push(cityFromAPI);
                localStorage.setItem('cities', JSON.stringify(citiesFromLocalStorage));
            }
        }
    } catch (error) {
        console.error('Błąd podczas pobierania miast:', error);
    }
}

export async function getCity(cityName){
    try {
        const citiesFromLocalStorage = JSON.parse(localStorage.getItem('cities') || '[]');
        
        if(await isCityInLocalStorage(cityName)){
            const city = citiesFromLocalStorage.find(city => 
                city.name.toLowerCase() === cityName.toLowerCase()
            );
            return {
                cityName: city.name,
                countryCode: city.country
            };
        }

        const cityData = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`);
        const [cityFromAPI] = await cityData.json();
        
        if (cityFromAPI) {
            return {
                cityName: cityFromAPI.name,
                countryCode: cityFromAPI.country
            };
        }
        
        return null;
    } catch (error) {
        console.error('Błąd podczas pobierania miasta:', error);
        return null;
    }
}

async function isCityInLocalStorage(cityName){
    const citiesFromLocalStorage = JSON.parse(localStorage.getItem('cities') || '[]');
    const existingCity = citiesFromLocalStorage.find(city => 
        city.name.toLowerCase() === cityName.toLowerCase()
    );
    
    if(existingCity){
        return true;
    }
    return false;
}

export function getSavedLocations() {
    return JSON.parse(localStorage.getItem('savedLocations') || '[]');
}

export function addToSavedLocations(cityInfo) {
    const savedLocations = getSavedLocations();
    

    const cityExists = savedLocations.some(loc => 
        loc.cityName.toLowerCase() === cityInfo.cityName.toLowerCase() &&
        loc.countryCode === cityInfo.countryCode
    );

    if (!cityExists && savedLocations.length < MAX_SAVED_LOCATIONS) {
        savedLocations.push(cityInfo);
        localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
        return true;
    }
    return false;
}

export function removeFromSavedLocations(cityName, countryCode) {
    const savedLocations = getSavedLocations();
    const updatedLocations = savedLocations.filter(loc => 
        !(loc.cityName.toLowerCase() === cityName.toLowerCase() && 
          loc.countryCode === countryCode)
    );
    localStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
} 