import { loadHeaderFooter, getCoordinates, getBirdData, getWikiBirdData, getHotspotData } from "./utils.mjs";
import BirdList from "./BirdList.mjs";
// import BirdSearch from "./BirdSearch.mjs";
import HotspotList from "./HotspotList.mjs";


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
  
});

// const searchForm = document.getElementById("search-form");

// searchForm.addEventListener("submit", async (e) => {
//     e.preventDefault(); 
//     const searchInput = document.getElementById("bird-name").value;
    
//     const birdSearch = new BirdSearch(getWikiBirdData, document.querySelector("#bird-list"));
    
//     const details = await birdSearch.init(searchInput);
//     console.log(details);
// });


document.addEventListener("click", (e) => {
    const flipTrigger = e.target.closest(".binocBtn, .flip-back");
    if (!flipTrigger) return;

    const card = flipTrigger.closest(".bird");
    card.classList.toggle("flipped");

});



