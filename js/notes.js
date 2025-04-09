let notes = [];

//akcja ratunkowa na odswiezenie strony
const storedNotes = localStorage.getItem("notes");
if (storedNotes) {
  notes = JSON.parse(storedNotes);
}

export function saveNotesData(note) {
  if (!note) {
    return;
  }

  notes.push({...note, id: crypto.randomUUID()});
  localStorage.setItem("notes", JSON.stringify(notes));
}

export function displayNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  notes.forEach((note) => {
    const noteContainer = createNoteElement(note);
    notesContainer.appendChild(noteContainer);
  });
}

function createNoteElement(note) {
  const noteContainer = document.createElement("div");
  const headerElement = createHeaderElement(note);
  const noteContentElement = createNoteContentElement(note);
  const buttonsContainer = createButtonsElement(note);

  noteContainer.className = "notes";
  noteContainer.style.backgroundColor = note.noteColor;

  noteContainer.replaceChildren(
    buttonsContainer,
    headerElement,
    noteContentElement
  );

  registerNoteClickEvent(noteContainer);

  return noteContainer;
}


function createHeaderElement(note) {
    const noteHeader = document.createElement("div");
    const noteTitle = document.createElement("h3");
    const noteTags = document.createElement("span");
    
    noteHeader.className = "note-header";
    noteTitle.textContent = `${
        note.noteTitle.charAt(0).toUpperCase() + note.noteTitle.slice(1)
    }`;
    noteTags.textContent = `#${note.noteTags.toLowerCase().replace(/ /g, "_")}`;
    
    noteHeader.append(noteTitle, noteTags);
    
    return noteHeader;
}

function createNoteContentElement(note) {
    const noteContent = document.createElement("p");
    
    noteContent.className = "notes-content";
    noteContent.textContent = note.noteContent;
    
    return noteContent;
}

function createButtonsElement(note) {
  const deleteBtn = createDeleteButton(note);
  const pinBtn = createPinButton(note);
  const buttonsContainer = document.createElement("div");

  buttonsContainer.className = "note-buttons-container";

  buttonsContainer.append(pinBtn, deleteBtn);

  return buttonsContainer;
}

function createDeleteButton(note) {
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "note-buttons";
  deleteBtn.id = note.id;

  const deleteBtnImg = document.createElement("img");
  deleteBtnImg.src = "../styles/assets/trash_607318.png";
  deleteBtnImg.alt = "delete";
  deleteBtnImg.width = 11;
  

  deleteBtn.appendChild(deleteBtnImg);

  deleteBtn.addEventListener('click', function(event) {
    const index = notes.findIndex(note => note.id === this.id);
    if (index === -1){
        return;
    }

    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    location.reload();
  })

  return deleteBtn;
}

function createPinButton(note) {
  const pinBtn = document.createElement("button");
  pinBtn.className = "note-buttons";

  const pinBtnImg = document.createElement("img");
  pinBtnImg.src = "../styles/assets/pin_12060883.png";
  pinBtnImg.alt = "pin";
  pinBtnImg.width = 11;

  pinBtn.appendChild(pinBtnImg);

  

  return pinBtn;
}

function registerNoteClickEvent(noteElement) {
  noteElement.addEventListener("click", () => {
    const content = noteElement.querySelector(".notes-content");

    if (noteElement.classList.contains("expanded")) {
      content.scrollTop = 0;
    }
    noteElement.classList.toggle("expanded");
  });
}



// export const getNotesFromStorage = () => JSON.parse(localStorage.getItem("notes")) || [];

// // Usuwanie notatki
// export const deleteNote = (index) => {
//     let notes = getNotes();
//     notes.splice(index, 1);
//     saveNotes(notes);
// };

// // Dodawanie nowej notatki
// export const addNote = (newNote) => {
//     let notes = getNotes();
//     if (newNote.pinned) {
//         notes.unshift(newNote); // Dodaj na początek, jeśli przypięta
//     } else {
//         notes.push(newNote);    // Dodaj na koniec, jeśli nieprzypięta
//     }
//     saveNotes(notes);
// };

// export const pinNote = (index) => {
//     let notes = getNotes();  // Pobierz wszystkie notatki
//     const note = notes[index]; // Zidentyfikuj notatkę według indeksu
//     note.pinned = true;  // Zmieniamy status na przypięty
//     saveNotes(notes);  // Zapisujemy zaktualizowaną tablicę notatek w localStorage
//     renderNotes();  // Renderujemy notatki ponownie, żeby pokazać zmiany
// };

// // Renderowanie notatek
// export const renderNotes = () => {
//     const notesContainer = document.getElementById("notesContainer");
//     notesContainer.innerHTML = ""; // Wyczyść zawartość

//     let notes = getNotes();
//     // Sortujemy notatki alfabetycznie (np. według tytułu)
//     notes.sort((a, b) => a.title.localeCompare(b.title));

//     notes.forEach((note, index) => {
//         const noteElement = document.createElement("div");
//         noteElement.classList.add("note");
//         if (note.pinned) {
//             noteElement.classList.add("pinned");  // Wizualne przypięcie
//         }
//         noteElement.style.backgroundColor = note.color;
//         noteElement.innerHTML = `
//             <h3>${note.title}</h3>
//             <p>${note.content}</p>
//             <small>${new Date(note.createdDate).toLocaleString()}</small>
//             <button class="delete-btn" data-index="${index}">Usuń</button>
//             <button class="pin-btn" data-index="${index}">Przypnij</button> <!-- Przycisk przypinania -->
//         `;
//         notesContainer.appendChild(noteElement);
//     });

//     // Event listener do usuwania notatek
//     document.querySelectorAll(".delete-btn").forEach(button => {
//         button.addEventListener("click", function () {
//             const index = this.getAttribute("data-index");
//             deleteNote(index);
//             renderNotes();  // Po usunięciu notatki ponownie renderujemy
//         });
//     });

//     // Event listener do przypinania notatek
//     document.querySelectorAll(".pin-btn").forEach(button => {
//         button.addEventListener("click", function () {
//             const index = this.getAttribute("data-index");
//             pinNote(index); // Wywołanie funkcji pinNote
//         });
//     });
// };
