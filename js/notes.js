let notes = [];
let notesFilterText = "";

//akcja ratunkowa na odswiezenie strony
const storedNotes = localStorage.getItem("notes");
if (storedNotes) {
  notes = JSON.parse(storedNotes);
}

export function saveNotesData(note) {
  if (!note) {
    return;
  }

  notes.push({
    ...note,
    id: crypto.randomUUID(),
    pinned: note.pinned ?? false,
  });
  localStorage.setItem("notes", JSON.stringify(notes));
}

export function displayNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  const filteredNotes = filterNotes(notes, notesFilterText);
  filteredNotes.forEach((note) => {
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
  noteTitle.textContent = note.noteTitle.toUpperCase();
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
  const editBtn = createEditButton(note);
  const buttonsContainer = document.createElement("div");

  buttonsContainer.className = "note-buttons-container";

  buttonsContainer.append(pinBtn, editBtn, deleteBtn);

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

  deleteBtn.addEventListener("click", deleteNote);

  return deleteBtn;
}

function deleteNote(event) {
  const noteId = event.currentTarget.id;
  const index = notes.findIndex((note) => note.id === noteId);
  if (index === -1) {
    return;
  }

  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

function createPinButton(note) {
  const pinBtn = document.createElement("button");
  pinBtn.id = note.id;
  pinBtn.className = "note-buttons";

  if (note.pinned) {
    pinBtn.classList.add("pinned");
  }

  const pinBtnImg = document.createElement("img");
  pinBtnImg.src = "../styles/assets/pin_12060883.png";
  pinBtnImg.alt = "pin";
  pinBtnImg.width = 11;

  pinBtn.appendChild(pinBtnImg);

  pinBtn.addEventListener("click", pinNoteToTop);

  return pinBtn;
}

function pinNoteToTop(event) {
  const noteId = event.currentTarget.id;
  const index = notes.findIndex((note) => note.id === noteId);
  if (index === -1) return;

  notes[index].pinned = !notes[index].pinned;

  const [deletedNote] = notes.splice(index, 1);

  if (deletedNote.pinned) {
    notes.unshift(deletedNote);
  } else {
    notes.push(deletedNote);
  }

  localStorage.setItem("notes", JSON.stringify(notes));

  displayNotes();
}

function createEditButton(note) {
  const editBtn = document.createElement("button");
  editBtn.className = "note-buttons";

  const editBtnImg = document.createElement("img");
  editBtnImg.src = "../styles/assets/pencil.png";
  editBtnImg.alt = "edit";
  editBtnImg.width = 11;
  editBtn.appendChild(editBtnImg);

  editBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    enableEditMode(note);
  });

  return editBtn;
}

function enableEditMode(note) {
  const noteElement = document.getElementById(note.id).closest('.notes');
  
  
  const existingForm = noteElement.querySelector('.edit-form');
  if (existingForm) {
    return; 
  }
  
  const titleElement = noteElement.querySelector('h3');
  const contentElement = noteElement.querySelector('.notes-content');
  
  const editForm = document.createElement('div');
  editForm.className = 'edit-form';
  
  const titleInput = document.createElement('input');
  titleInput.value = note.noteTitle;
  titleInput.className = 'edit-title';
  
  const contentInput = document.createElement('textarea');
  contentInput.value = note.noteContent;
  contentInput.className = 'edit-content';
  
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'buttons-container';
  
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.className = 'edit-save-btn';
  
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'edit-cancel-btn';
  
  buttonsContainer.append(saveButton, cancelButton);
  editForm.append(titleInput, contentInput, buttonsContainer);
  
  titleElement.style.display = 'none';
  contentElement.style.display = 'none';
  
  contentElement.parentNode.insertBefore(editForm, contentElement);
  
  saveButton.addEventListener('click', function() {
    saveChanges(note, titleInput.value, contentInput.value);
  });
  
  cancelButton.addEventListener('click', function() {
    cancelEdit();
  });
}

function saveChanges(note, newTitle, newContent) {
  const noteIndex = notes.findIndex(function(n) {
    return n.id === note.id;
  });
  
  if (noteIndex !== -1) {
    notes[noteIndex].noteTitle = newTitle;
    notes[noteIndex].noteContent = newContent;
    
    localStorage.setItem("notes", JSON.stringify(notes));
    
    displayNotes();
  }
}

function cancelEdit() {
  displayNotes();
}

function registerNoteClickEvent(noteElement) {
  noteElement.addEventListener("click", () => {
    const content = noteElement.querySelector(".notes-content");

    if (noteElement.classList.contains("expandedText")) {
      content.scrollTop = 0;
    }
    noteElement.classList.toggle("expandedText");
  });
}

export function registerSearchOnChangeEvent() {
  const searchBar = document.getElementById("searchBar");

  searchBar.addEventListener("input", (event) => {
    notesFilterText = event.target.value;
    displayNotes();
  });
}

function filterNotes(notes, filterText) {
  if (!filterText) {
    return notes;
  }

  return notes.filter(
    (note) =>
      isTitleMatching(note, filterText) ||
      isTagMatching(note, filterText) ||
      isContentMatching(note, filterText)
  );
}

function isTitleMatching(note, filterText) {
  return note.noteTitle.toLowerCase().includes(filterText.toLowerCase());
}

function isTagMatching(note, filterText) {
  return note.noteTags.toLowerCase().includes(filterText.toLowerCase());
}

function isContentMatching(note, filterText) {
  return note.noteContent.toLowerCase().includes(filterText.toLowerCase());
}
