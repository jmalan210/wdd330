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

export async function getBirdData(lat, lon) {
    const response = await fetch(`https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lon}`, {
        headers: { "X-eBirdApiToken": EBIRD_API_KEY }
    
        
    })
    const birds = await response.json();
    console.log(birds)
    return birds
};
    
export function formatDate(dateString) {
    if (!dateString) return "unknown";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric"}).format(new Date(dateString));
}



