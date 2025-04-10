import {  registerNoteFormSubmitEventListener } from './form.js'; 
import { displayNotes, registerSearchOnChangeEvent } from './notes.js';


function init(){
    registerNoteFormSubmitEventListener()
    displayNotes()
    registerSearchOnChangeEvent()
}

init();






