import { formatDate, createMapModal, openGoogleMapModal } from "./utils.mjs";

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
    }

    async renderHotspots(hotspots) {
        const hotspotsHTML = hotspots.map(hotspot => {

            return `
                <li class="hotspot">
                <h4>${hotspot.locName}</h4>
                <div class="hotspot-info">
                <p><strong>Latest Observed Date:</strong>${formatDate(hotspot.latestObsDt)}</p>
                <p><strong>All Time Highest Number of Checklists:</strong>${hotspot.numChecklistsAllTime}</p>
                <p><strong>All Time Highest Number of Species:</strong>${hotspot.numSpeciesAllTime}</p>
                <p><strong>Latitude:</strong>${hotspot.lat}</p>
                <p><strong>Longitude:</strong>${hotspot.lng}</p>
                <p><strong>Country Code:</strong>${hotspot.countryCode}</p>
                <p><strong>Subnational Code 1:</strong>${hotspot.subnational1Code}</p>
                <p><strong>Subnational Code 2:</strong>${hotspot.subnational2Code}</p>
                <button class="mapBtn"
                data-lat="${hotspot.lat}"
                data-lng="${hotspot.lng}"
                data-name="${hotspot.locName}">
                See on a map
                </button>
                </div>
                </li>
                `;
        } )

        this.listElement.innerHTML = hotspotsHTML.join("");
    
        }

        }
   
