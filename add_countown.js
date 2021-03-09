import { CountDownForm } from "./script/CountDownForm.js";
import { registerSettings } from "./script/settings.js";

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('add_countdown | Initializing add_countdown');
    // Assign custom classes and constants here
    // Register custom module settings
    registerSettings();
    
    return loadTemplates(['modules/dnd5e-Countdown/template/countdown_panel.html']);
    
});
let operations;

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
    //TODO
});
/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {
    console.log('add_countdown | ready to add_countdown'); 
    //CountDownForm.showForm();
});