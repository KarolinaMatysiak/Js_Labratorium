import {saveNotesData} from './notes.js'


export function registerNoteFormSubmitEventListener(){
    
    const form = document.getElementById("noteForm");
    
    form.addEventListener("submit", (event) => handleNoteFormSubmitData(event));

}

function handleNoteFormSubmitData(event) {

    // event.preventDefault();
    const formData = new FormData(event.target)
    const formProps = Object.fromEntries(formData);
    
    saveNotesData(formProps);
}

