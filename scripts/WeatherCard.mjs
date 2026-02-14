import { formatDate, windDir } from "./utils.mjs";

export default class {

    constructor(divElement) {
       
        this.divElement = document.getElementById("weather-data");
    }

    async getWeather(lat, lng) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const startDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 3);
        const endDateStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&start_date=${startDate}&end_date=${endDateStr}`;


    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
    }
    
    render(weatherData, cityName = "") {
        const current = weatherData.current;
        const daily = weatherData.daily;
        const time = new Date(current.time);
        const formattedTime = time.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })
        console.log(current.temperature_2m);

        this.divElement.querySelectorAll(".weather-current, .three-day-forecast").forEach(el => el.remove());
        // const card = document.createElement("div");
        // card.classList.add("weather-card");

        //current weather
        const currentBox = document.getElementById("weather-today");

        currentBox.innerHTML =
            `<div class="wthrToday">
            <h3>Today in <span>${cityName}</span></h3>
            <h4><strong>${formatDate(current.time)}</strong></h4>
            <p class="time"><strong>${formattedTime}</strong></p>
            <p class="current-temp"><strong>${Math.round(current.temperature_2m)}°F</strong></p>
            <p class="rel-hum"><strong>Rel. Humidity:</strong> ${current.relative_humidity_2m}%</p>
            <p class="wind"><strong>Wind:</strong> ${Math.round(current.wind_speed_10m)} mph ${windDir(current.wind_direction_10m)}</p>
            
            <p class="sunrise"><strong>Sunrise:</strong> ${new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
            <p class="sunset"><strong>Sunset:</strong> ${new Date(daily.sunset[0]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
            </div>
            `;
        
        // this.divElement.appendChild(currentBox);

        //3-day forecast
        const threeDayBox = document.getElementById("weather-forecast");
        threeDayBox.innerHTML = "";
        const forecastHeader = document.createElement("h3");
        forecastHeader.textContent = "3-Day Forecast";
        threeDayBox.appendChild(forecastHeader);

        for (let i = 0; i < Math.min(3, daily.time.length); i++){
            const dateStr = daily.time[i];
            const[year, month, day] = dateStr.split("-").map(Number);
            const date = new Date(year, month - 1, day);
            const formattedDate = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
            
           
            const dayForecast = document.createElement("div");
            dayForecast.classList.add("weather-day");
            dayForecast.innerHTML = `
            <p class="forecast-date"><strong>${formattedDate}</strong></p>
            <p><strong>Min:</strong> ${Math.round(daily.temperature_2m_min[i])}°F</p>
            <p><strong>Max:</strong> ${Math.round(daily.temperature_2m_max[i])}°F</p>
            <p><strong>Sunrise:</strong> ${new Date(daily.sunrise[i]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
            <p><strong>Sunset:</strong> ${new Date(daily.sunset[i]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
            
            `;
            threeDayBox.appendChild(dayForecast);

        };
       
        // this.divElement.appendChild(threeDayBox);
    }
    
    async show(lat, lng, cityName = "") {
        try {
            const data = await this.getWeather(lat, lng);
            this.render(data, cityName);

        } catch (err) {
            console.error("weather fetch error", err);

    }
}
}

