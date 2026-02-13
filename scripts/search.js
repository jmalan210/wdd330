import { loadHeaderFooter, getCoordinates, getBirdData, getHotspotData, saveSighting, saveFavHotspot, removeFavHotspot } from "./utils.mjs";
import BirdList from "./BirdList.mjs";
// import BirdSearch from "./BirdSearch.mjs";
import HotspotList from "./HotspotList.mjs";
import WeatherCard from "./WeatherCard.mjs";


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

    const { lat, lon } = coordinates;

    const selectedRadioButton = document.querySelector('input[name="dataType"]:checked').value;
    
    const dataSource = (lat, lon) => {
        switch (selectedRadioButton) {
            case 'recent':
                return getBirdData(`https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lon}&back=7&maxResults=30`);
            
            case 'recentNotable':
                return getBirdData(`https://api.ebird.org/v2/data/obs/geo/recent/notable?lat=${lat}&lng=${lon}&back=7&maxResults=30`);
            
            case 'hotspots':
                return getHotspotData(`https://api.ebird.org/v2/ref/hotspot/geo?lat=${lat}&lng=${lon}&fmt=json`);
        }
    };
    const classesList = {
        recent: BirdList,
        recentNotable: BirdList,
        hotspots: HotspotList
    };
    
    const classList = classesList[selectedRadioButton];
    const list = new classList(dataSource, document.querySelector("#bird-list"), locationInput, selectedRadioButton);
    await list.init(lat, lon);

   
    const weatherCard = new WeatherCard("weather-data");
    await weatherCard.show(lat, lon, locationInput);
  
});


document.addEventListener("click", (e) => {
    const flipTrigger = e.target.closest(".binocBtn, .flip-back");
    if (!flipTrigger) return;

    const card = flipTrigger.closest(".bird");
    card.classList.toggle("flipped");

});

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("seen-bird")) return;
    const btn = e.target.dataset;

    const sighting = {
        speciesCode: btn.species,
        commonName: btn.name,
        scientificName: btn.sci,
        dateRecorded: new Date().toISOString()

    };

    saveSighting(sighting);

    e.target.textContent = "✓ Seen!"
    e.target.classList.add("seen");
    e.target.disabled = true;
});

document.addEventListener("click", (e) => {
   
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;

    const locId = btn.dataset.locid;
    const locName = btn.dataset.name;

    btn.classList.toggle("favorited");

    if (btn.classList.contains("favorited")) {
        saveFavHotspot(locId, locName);
    } else {
        removeFavHotspot(locId);
   
    }
});

    

   


