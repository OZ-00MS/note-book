const newNoteBtn = document.getElementById("newNoteBtn");
const searchBtn = document.getElementById("searchBtn");
const newNoteForm = document.getElementById("newNoteForm");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const notesContainer = document.getElementById("notesContainer");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const emptyStateNewNoteBtn = document.getElementById("emptyStateNewNoteBtn");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editIndex = null;

// Show/hide forms
newNoteBtn.onclick = () => { newNoteForm.classList.remove("hidden"); };
cancelBtn.onclick = () => { newNoteForm.classList.add("hidden"); clearForm(); };
emptyStateNewNoteBtn.onclick = () => { newNoteForm.classList.remove("hidden"); emptyState.classList.add("hidden"); };
searchBtn.onclick = () => { searchContainer.classList.toggle("hidden"); };

// Clear inputs
function clearForm() {
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";
    editIndex = null;
}

// Save note
saveBtn.onclick = () => {
    const title = document.getElementById("noteTitle").value.trim();
    const content = document.getElementById("noteContent").value.trim();
    if (!title) return alert("Note must have a title!");
    const note = { title, content };
    if (editIndex !== null) {
        notes[editIndex] = note;
        editIndex = null;
    } else {
        notes.push(note);
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    clearForm();
    newNoteForm.classList.add("hidden");
    renderNotes();
};

// Render notes
function renderNotes(filter="") {
    notesContainer.innerHTML = "";
    const filtered = notes.filter(n => n.title.toLowerCase().includes(filter.toLowerCase()));
    if(filtered.length === 0){
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
    }
    filtered.forEach((note, idx) => {
        const card = document.createElement("div");
        card.className = "note-card";
        card.innerHTML = `
            <div class="note-title">${note.title}</div>
            <div class="note-content-text">${note.content}</div>
            <div class="note-actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;
        card.querySelector(".edit").onclick = () => {
            document.getElementById("noteTitle").value = note.title;
            document.getElementById("noteContent").value = note.content;
            newNoteForm.classList.remove("hidden");
            editIndex = notes.indexOf(note);
        };
        card.querySelector(".delete").onclick = () => {
            if(confirm("Delete this note?")){
                notes.splice(notes.indexOf(note),1);
                localStorage.setItem("notes", JSON.stringify(notes));
                renderNotes(searchInput.value);
            }
        };
        notesContainer.appendChild(card);
    });
}

searchInput.oninput = () => renderNotes(searchInput.value);

renderNotes();
