import { formatDate, createMapModal, openGoogleMapModal, restoreFavButtons } from "./utils.mjs";

export default class HotspotList {
    constructor(dataSource, listElement, location, dataType) {
        this.location = location;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.dataType = dataType;

        this.listElement.addEventListener("click", (e) => {
            if (e.target.classList.contains("mapBtn")) {
                // console.log("button clicked");
                const { lat, lng, name } = e.target.dataset;
                createMapModal();
                openGoogleMapModal(lat, lng, name);
            }
        });
    }
    
    async init(lat, lon) {
        let hotspots = await this.dataSource(lat, lon);
        const hotspotList = new Set();
        hotspots = hotspots.filter(hotspot => {
            if (hotspotList.has(hotspot.locId)) return false;
            hotspotList.add(hotspot.locId);
            return true;
        });

        hotspots = hotspots.slice(0, 10);
        this.hotspots = hotspots;
        const title = document.getElementById("list-title");
        title.innerHTML = `Hotspots for <span id="title-loc">${this.location}</span>`;
        this.renderHotspots(this.hotspots);

        await this.renderHotspots(this.hotspots);
        restoreFavButtons();
    }

    async renderHotspots(hotspots) {
        const hotspotsHTML = hotspots.map(hotspot => {

            return `
                <li class="hotspot">
                <h4>${hotspot.locName}</h4>
                <div class="hotspot-info">
                <p><strong>Latest Observed Date:</strong> ${formatDate(hotspot.latestObsDt)}</p>
                <p><strong>All Time Highest Number of Checklists:</strong> ${hotspot.numChecklistsAllTime}</p>
                <p><strong>All Time Highest Number of Species:</strong> ${hotspot.numSpeciesAllTime}</p>
                <p><strong>Latitude:</strong> ${hotspot.lat}</p>
                <p><strong>Longitude:</strong> ${hotspot.lng}</p>    
                <button class="mapBtn"
                data-lat="${hotspot.lat}"
                data-lng="${hotspot.lng}"
                data-name="${hotspot.locName}">
                See on a map
                </button>
                <button class="fav-btn"
                data-locid="${hotspot.locId}"
                data-name="${hotspot.locName}"
                data-lat="${hotspot.lat}"
                data-lng="${hotspot.lng}"
                aria-label="Favorite this hotspot">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="heart-icon">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 
                3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3
                19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                </button>
                </div>
                </li>
                `;
        } )

        this.listElement.innerHTML = hotspotsHTML.join("");
        
    
        }

        }
   
