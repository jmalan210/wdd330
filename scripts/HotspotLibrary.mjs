import { formatDate, createMapModal, openGoogleMapModal } from "./utils.mjs";
export default class HotspotLibrary {

    constructor(listElement) {
        this.listElement = listElement;
        this.hotspots = JSON.parse(localStorage.getItem("favHotSpots")) || [];

        createMapModal();

        this.listElement.addEventListener("click", e => {
            if (e.target.classList.contains("remove-hotspot")) {
                this.removeHotspotFromLibrary(e.target.dataset.id);
            }
        })

    }

    async render() {
        this.listElement.innerHTML = "";
        if (this.hotspots.length === 0) {
            this.listElement.innerHTML = `No hotspots stored yet!`
            return
        }
        for (const h of this.hotspots) {
            const hotspotListItem = document.createElement("li");
            hotspotListItem.classList.add("favHotspotLi");

            const existingNotes = h.notes
                ? h.notes
                    .map((note, index) =>
                        ` <li class="attached-note" data-note-index="${index}">
                            <button class="delete-note">x</button>
                            <p><strong>${formatDate(new Date(note.date))}: </strong> ${note.text}</p>
                            </li>`).join("") : "";

            hotspotListItem.innerHTML = `
            <div class="card-header">
            <button class="remove-hotspot" data-id=${h.locId}>x</button>
            <h4>${h.locName}</h4>
            <div></div>
            </div>
            <div class="hotspot-details">
            <p><strong>Lat:</strong> ${h.lat}</p>
            <p><strong>Lng:</strong> ${h.lng}</p>
            <button class="map-button"
                data-lat="${h.lat}"
                data-lng="${h.lng}"
                data-name="${h.locName}">
                See on a map
                </button>
            <p><strong>Notes:</strong></p>
            <ul id="notes-${h.locId}">${existingNotes}</ul>
            <textarea id="note-${h.locId}" class="note-text-area" placeholder="enter notes about this hotspot"></textarea>
             <button id="save-${h.locId}" class="save-note">Save Note</button>
             </div>
        `
            this.listElement.appendChild(hotspotListItem);

            hotspotListItem.querySelector(`#save-${h.locId}`).addEventListener("click", () => {
                this.saveNoteForHotspot(h.locId);

              
            });
             hotspotListItem.querySelector(`.map-button`).addEventListener("click", (e) => {
                 const { lat, lng, name } = e.target.dataset;
                 openGoogleMapModal(lat, lng, name);
            } )

            const notesList = hotspotListItem.querySelector(`#notes-${h.locId}`);
            notesList.addEventListener("click", e => {
                if (e.target.classList.contains("delete-note")) {
                    const li = e.target.closest("li");
                    const noteIndex = li.dataset.noteIndex;
                    this.deleteNoteForHotspot(h.locId, noteIndex)
                }
            });

        }
    }

    removeHotspotFromLibrary(locId) {
        const li = this.listElement.querySelector(`.remove-hotspot[data-id=${locId}]`).closest("li");
        li.classList.add("removing");
        setTimeout(() => {
            this.hotspots = this.hotspots.filter(h => h.locId !== String(locId));
            this.updateLocalStorage();
            li.remove();
        }, 500);
    }

    saveNoteForHotspot(locId) {
        
        const hotspot = this.hotspots.find(h => h.locId === locId);
        if (!hotspot) return;
    
        const textarea = document.getElementById(`note-${locId}`);
        const noteText = textarea.value.trim();
        if (!noteText) return;
    
        if (!hotspot.notes) hotspot.notes = [];
        const note = {
            text: noteText,
            date: new Date().toISOString()
    
        };
        
        hotspot.notes.push(note);
    
        this.updateLocalStorage();
        this.renderNotes(hotspot);
    
        textarea.value = "";
    
    }

    deleteNoteForHotspot(locId, noteIndex) {
    const hotspot = this.hotspots.find(h => h.locId === locId);
    if (!hotspot || !hotspot.notes) return;

    hotspot.notes.splice(Number(noteIndex), 1);
        this.updateLocalStorage();
        this.renderNotes(hotspot);

       
    }
    renderNotes(hotspot) {
                const notesList = document.getElementById(`notes-${hotspot.locId}`);
                notesList.innerHTML = "";
                hotspot.notes.forEach((note, index) => {
                const li = document.createElement("li");
                li.classList.add("attached-note");
                li.dataset.noteIndex = index;
                li.innerHTML = `<button class="delete-note">x</button><p><strong>${formatDate(new Date(note.date))}:</strong> ${note.text}</p>`;
                notesList.appendChild(li);
                })
                
    }
    
    updateLocalStorage() {
        localStorage.setItem("favHotSpots", JSON.stringify(this.hotspots));
    }


}