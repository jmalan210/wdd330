export function createMapModal() {
    if (document.getElementById("map-modal")) return;

    const modal = document.createElement('dialog');
    modal.id = "map-modal";
    modal.className = "modal";

    modal.innerHTML = `
    <div class="modal-content">
    <span id="close-map">&times;</span>
    <h2 id="map-title"></h2>
    <iframe id="googleMap" width="100%" height="400" style="border:0," loading="lazy"</iframe>
    </div>

    `

    document.body.appendChild(modal);

    document.getElementById("close-map").onClick = () => modal.style.display = "none";
    modal.onClick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };
}

export function openGoogleMapModal(lat, lng, name) {
    const modal = document.getElementById("map-modal");
    const title = document.getElementById("map-title");
    const iframe = document.getElementById("googleMap");

    title.textContent = name;
    iframe.src = `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;

    modal.style.display = "block";
}