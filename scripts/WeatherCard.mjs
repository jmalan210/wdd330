import { formatDate } from "./utils.mjs";

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
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&current=temperature_2m,relative_humidity_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&start_date=${startDate}&end_date=${endDateStr}`;


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

        this.divElement.innerHTML = "";
        const card = document.createElement("div");
        card.classList.add("weather-card");

        //current weather
        const currentHTML = document.createElement("div");
        currentHTML.classList.add("weather-current");

        currentHTML.innerHTML =
            `<h3>Is it good birding weather in ${cityName}?</h3>
            <h4>${formatDate(current.time)}</h4>
            <p><strong>Current Time:</strong> ${formattedTime}
            <p><strong>Current Temp:</strong> ${current.temperature_2m}°F</p>
            <p><strong>Wind:</strong> ${current.wind_speed_10m} mph</p>
            <p><strong>Sunrise:</strong> ${new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
            `;
        
        card.appendChild(currentHTML);

        //3-day forecast
        const forecastDiv = document.createElement("div")
        forecastDiv.classList.add("three-day-forecast");
        const forecastHeader = document.createElement("h4");
        forecastHeader.textContent = "3-Day Forecast";
        forecastDiv.appendChild(forecastHeader);

        for (let i = 0; i < daily.time.length; i++){
            const dateStr = daily.time[i];
            const[year, month, day] = dateStr.split("-").map(Number);
            const date = new Date(year, month - 1, day);
            const formattedDate = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });     
           
            const dayForecast = document.createElement("div");
            dayForecast.classList.add("weather-day");
            dayForecast.innerHTML = `
            <strong>${formattedDate}</strong>:
            Min${daily.temperature_2m_min[i]}°F - Max ${daily.temperature_2m_max[i]}°F<br>
            Sunrise: ${new Date(daily.sunrise[i]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })},
            Sunset: ${new Date(daily.sunset[i]).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            `;
            forecastDiv.appendChild(dayForecast);

        };
        card.appendChild(forecastDiv);
        this.divElement.appendChild(card);
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

