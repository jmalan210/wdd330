import { loadHeaderFooter, getCoordinates, getBirdData, getBirdSuggestions } from "./utils.mjs";
import BirdList from "./BirdList.mjs";
import { EBIRD_API_KEY } from "./config.mjs";

loadHeaderFooter();

const locForm = document.getElementById("loc-form");


locForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const locationInput = document.getElementById("location").value;
    if (!locationInput) {
        return;
    }
    const coordinates = await getCoordinates(locationInput);
    if (!coordinates) {
        console.error("Location not found");
        return;
    }

    const SERVER_URL = location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://server-4abf.onrender.com";
    
    const { lat, lon: lng } = coordinates;

    const selectedRadioButton = document.querySelector('input[name="dataType"]:checked').value;
    
    const birdDataSource = (lat, lng) => {
        
        switch (selectedRadioButton) {
            case 'recent':
                
            case 'recent-notable':
                return getBirdData(`${SERVER_URL}/birds/${selectedRadioButton}?lat=${lat}&lng=${lng}`);
        }

    }
    
    
    const birdList = new BirdList(birdDataSource, document.querySelector("#bird-list"), locationInput, selectedRadioButton);
    await birdList.init(lat, lng);
  
});


