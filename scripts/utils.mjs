import {LOCATIONIQ_API_KEY, EBIRD_API_KEY} from "./config.mjs"

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  return await response.text();
}

export async function loadHeaderFooter(){
    const templateHeader = await loadTemplate("./partials/header.html");
    const templateFooter = await loadTemplate("./partials/footer.html");

    const header = document.querySelector("#dynamic-header");
    const footer = document.querySelector("#dynamic-footer");
    

    renderWithTemplate(templateHeader, header, null);
    renderWithTemplate(templateFooter, footer);
        
    const year = document.querySelector("#current-year");
    year.textContent = new Date().getFullYear();

}

export async function getCoordinates(location) {
    const response = await fetch(`https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(location)}&format=json&`);
    const data = await response.json();

    if (data.length === 0) {
        return null;
    }

    const lat = data[0].lat;
    const lon = data[0].lon;
    // console.log(lat);
    // console.log(lon);
    return { lat, lon }
    
    
};

export async function getReadableLocation(lat, lng) {
    const url = `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url);
    if (!res.ok) return "Unknown location";
    const data = await res.json();
    return data.display_name;
}

export async function getBirdData(url) {
    const response = await fetch(url, {
        headers: { "X-eBirdApiToken": EBIRD_API_KEY }
    
        
    });
    if (!response.ok) {
        throw new Error (`eBird API error: ${response.status}`);
        
    }
    const birds = await response.json();
    console.log(birds)
    return birds
};

export async function getHotspotData(url) {
    const response = await fetch(url, {
        headers: { "X-eBirdApiToken": EBIRD_API_KEY }
    
        
    });
    if (!response.ok) {
        throw new Error (`eBird API error: ${response.status}`);
        
    }
    const hotspots = await response.json();
    console.log(hotspots);
    return hotspots;
}
    
export function formatDate(dateString) {
    if (!dateString) return "unknown";
    // const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric"}).format(new Date(dateString));
}

export async function getWikiBirdPics(bird) {
    const namesToTry = [bird.sciName, `${bird.comName} (bird)`, bird.comName];
    for (let name of namesToTry) {
        if (!name) continue;
   
        const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=pageimages&redirects=1&titles=${encodeURIComponent(name)}&pithumbsize=800`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            const pages = data.query?.pages;
            if (!pages) continue;
            const page = Object.values(pages)[0];
            const imgUrl = page?.thumbnail?.source;
            if (imgUrl) return imgUrl;
        
        } catch (err) {
            console.warn("Wikipedia fetch error:", name, err);
        }
    }

    return "/images/placeholder.svg";
}

export async function getWikiBirdData(query) {
    const url = `https://en.wikipedia.org/w/api.php?` +
        new URLSearchParams({
            action: "query",
            list: "search",
            srsearch: query,
            format: "json",
            origin: "*"
        });
    
    const res = await fetch(url);
    const data = await res.json();
    return data.query.search;
   
    
};



export async function getWikiExtractByName(birdName) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&format=json&origin=*&titles=${encodeURIComponent(birdName)}`;
    const res = await fetch(url);
    const data = await res.json();
    const page = Object.values(data.query.pages)[0];
    return page.extract || "";

       
}

export function wikiTitleCase(name) {
    return name.toLowerCase().replace(/^\w/, c => c.toUpperCase());
    
}

export function createMapModal() {
    if (document.getElementById("map-modal")) return;

    const modal = document.createElement('div');
    modal.id = "map-modal";
    modal.className = "modal";

    modal.innerHTML = `
    <div class="modal-content">
    <span id="close-map">X</span>
    <h2 id="map-title"></h2>
    <iframe id="googleMap" width="100%" height="400" style="border:0," loading="lazy"</iframe>
    </div>

    `

    document.body.appendChild(modal);

    const closeBtn = document.getElementById("close-map");
    closeBtn.onclick = () => modal.style.display = "none";

    
    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };
}

export function openGoogleMapModal(lat, lng, name) {
    const modal = document.getElementById("map-modal");
    const title = document.getElementById("map-title");
    const iframe = document.getElementById("googleMap");

    title.textContent = name;
    iframe.src = `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;

    if (typeof modal.showModal === "function") {
        modal.showModal();
    } else {

        modal.style.display = "block";
    }
}

export function windDir(deg) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

    return directions[Math.round(deg / 22.5) % 16];


}

export function saveSighting(bird) {
    const key = "seenBirds";
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    if (stored.some(b => b.speciesCode === bird.speciesCode)) return;
    stored.push(bird);
    localStorage.setItem(key, JSON.stringify(stored));
    console.log("Saved:", bird);
}

export function restoreSeenButtons() {
    const seen = JSON.parse(localStorage.getItem("seenBirds")) || [];
    
    document.querySelectorAll(".seen-bird").forEach(checkbox => {
        if (seen.some(b => b.speciesCode === checkbox.dataset.species)) {
            checkbox.checked = true;
        }
    }
    );
}

export function removeSighting(speciesCode) {
    const stored = JSON.parse(localStorage.getItem("seenBirds")) || [];
    const filtered = stored.filter(b => b.speciesCode !== speciesCode);
    localStorage.setItem("seenBirds", JSON.stringify(filtered));
}

export function saveFavHotspot(locId, locName) {
    const key = "favHotSpots";
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    if (!stored.some(h => h.locId === locId)) {

        stored.push({ locId, locName });
    localStorage.setItem(key, JSON.stringify(stored));
    }
   
    console.log("Saved:", stored);
}

export function removeFavHotspot(locId) {
    const key = "favHotSpots";
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    const filtered = stored.filter(h => h.locId !== locId);
    localStorage.setItem(key, JSON.stringify(filtered));
    console.log("removed, new list:", filtered);
}

export function restoreFavButtons() {
    const stored = JSON.parse(localStorage.getItem("favHotSpots")) || [];
    document.querySelectorAll(".fav-btn").forEach(btn => {
        const locId = btn.dataset.locid;
        if (stored.some(h => h.locId === locId)) {
            btn.classList.add("favorited");
        }
    });
}

export function displayBirdLibrary(listElement) {
    
    const birds = JSON.parse(localStorage.getItem("seenBirds")) || [];
    if (birds.length === 0) {
        listElement.innerHTML = `No birds stored yet!`;
    } else {
        birds.forEach(b => {
            const birdListItem = document.createElement("li");
            birdListItem.innerHTML = `
            <p><strong>Name:</strong> ${b.commonName}</p>
           <p><strong>Scientific Name:</strong> ${b.scientificName}</p>
           <p><strong>Date Recorded:</strong> ${b.dateRecorded}</p>
        `
            listElement.appendChild(birdListItem);
        }
        )
    }
}

export function displayHotspotLibrary(listElement) {
   
    const hotspots = JSON.parse(localStorage.getItem("favHotSpots")) || [];
    if (hotspots.length === 0) {
        listElement.innerHTML = `No hotspots stored yet!`;
    } else {
        hotspots.forEach(h => {
            const hotspotListItem = document.createElement("li");
            hotspotListItem.innerHTML = `
            <p><strong>Name:</strong> ${h.locName}</p>
            <p><strong>ID:</strong> ${h.locId}</p>
        `
            listElement.appendChild(hotspotListItem);
        })
    }
}