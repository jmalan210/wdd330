import { loadHeaderFooter, getCoordinates, getBirdData, getBirdSuggestions } from "./utils.mjs";
import BirdList from "./BirdList.mjs";
import { EBIRD_API_KEY } from "./config.mjs";

loadHeaderFooter();

const locForm = document.getElementById("loc-form");


locForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const locationInput = document.getElementById("location").value;
    if (!location) {
        return;
    }
    const coordinates = await getCoordinates(locationInput);
    if (!coordinates) {
        console.error("Location not found");
        return;
    }

    const { lat, lon } = coordinates;

    const selectedRadioButton = document.querySelector('input[name="dataType"]:checked').value;
    
    const birdDataSource = (lat, lon) => {
        switch (selectedRadioButton) {
        case 'recent':
            return getBirdData(`https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lon}&back=7&maxResults=30`);
            
        case 'recent-notable':
           return getBirdData(`https://api.ebird.org/v2/data/obs/geo/recent/notable?lat=${lat}&lng=${lon}&back=7&maxResults=30`);
           
        
    }

    }
    
    
    const birdList = new BirdList(birdDataSource, document.querySelector("#bird-list"), locationInput, selectedRadioButton);
    await birdList.init(lat, lon);
  
});


