import { loadHeaderFooter, getCoordinates, getBirdData, getHotspotData, saveSighting, removeSighting, saveFavHotspot, removeFavHotspot, initHamburgerMenu } from "./utils.mjs";
import BirdList from "./BirdList.mjs";
// import BirdSearch from "./BirdSearch.mjs";
import HotspotList from "./HotspotList.mjs";
import WeatherCard from "./WeatherCard.mjs";


loadHeaderFooter();
initHamburgerMenu();

const locForm = document.getElementById("loc-form");
const searchPageMap = document.getElementById("map");


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
    
    const weatherCard = new WeatherCard("weather-data");
    await weatherCard.show(lat, lon, locationInput);

    searchPageMap.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.classList.add("searchPageMap")
    iframe.src = `https://www.google.com/maps?q=${lat},${lon}&z=4&output=embed`;
    iframe.width="100%";
    iframe.height="100%";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    
    searchPageMap.appendChild(iframe);
  
    const classList = classesList[selectedRadioButton];
    const list = new classList(dataSource, document.querySelector("#bird-list"), locationInput, selectedRadioButton);
    await list.init(lat, lon);

   
    
});


document.addEventListener("click", (e) => {
    const flipTrigger = e.target.closest(".binocBtn, .flip-back");
    if (!flipTrigger) return;

    const card = flipTrigger.closest(".bird");
    card.classList.toggle("flipped");

});

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("seen-bird")) return;
    const checkbox = e.target;
    const {species, name, sci } = checkbox.dataset;

    const sighting = {
        speciesCode: species,
        comName: name,
        sciName: sci,
        dateRecorded: new Date().toISOString()

    };

    if (checkbox.checked) {

         saveSighting(sighting);
    } else {
        removeSighting(species);
    }
});

document.addEventListener("click", (e) => {
   
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;

    const locId = btn.dataset.locid;
    const locName = btn.dataset.name;
    const lat = btn.dataset.lat;
    const lng = btn.dataset.lng

    btn.classList.toggle("favorited");

    if (btn.classList.contains("favorited")) {
        saveFavHotspot(locId, locName, lat, lng);
    } else {
        removeFavHotspot(locId);
   
    }
});

    

   


