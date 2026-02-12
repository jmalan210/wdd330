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

// export async function getWikiBirdDetails(pageId) {
//     const url = 'https://en.wikipedia.org/w/api.php?' +
//         new URLSearchParams({
//             action: "query",
//             pageids: pageId,
//             prop: "extracts|pageimages",
//             exintro: true,
//             explaintext: true,
//             piprop: "thumbnail",
//             pithumbsize: 400,
//             format: "json",
//             origin: "*"
//         });
//     const res = await fetch(url);
//     const data = await res.json();
//     return data.query.pages[pageId];
   
// }

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

export function getGoogleMap(lat, lng, name) {
    const modal = document.getElementById()
}