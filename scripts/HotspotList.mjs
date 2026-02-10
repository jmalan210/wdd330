import { formatDate } from "./utils.mjs";

export default class HotspotList {
    constructor(dataSource, listElement, location, dataType) {
        this.location = location;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.dataType = dataType;
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
        const hotspotsHTML = await Promise.all(hotspots.map(async hotspot => {
            return (
                `<li class="hotspot">
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
                
                `
            )
        }));

        this.listElement.innerHTML = hotspotsHTML.join("");
    }
}