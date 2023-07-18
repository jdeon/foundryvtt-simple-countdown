import { CountDownForm } from "./script/CountDownForm.js";
import { registerSettings } from "./script/settings.js";

/**
 * Defines the event name to send all messages to over  `game.socket`.
 *
 * @type {string}
 */
export const s_EVENT_NAME = 'module.simple-countdown';


/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('add_countdown | Initializing add_countdown');
    // Assign custom classes and constants here
    // Register custom module settings
    registerSettings();
    
    return loadTemplates(['modules/simple-countdown/template/countdown_panel.html']);
    
});

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
    CountDownForm.showForm(); //TODO add button
    listen()
});
  
  /**
  * Provides the main incoming message registration and distribution of socket messages on the receiving side.
  */
  function listen()
  {
     game.socket.on(s_EVENT_NAME, (data) =>
     {
        if (typeof data !== 'object') { return; }
  
        if(! game.user.isGM){ return; }
  
        try
        {
            let formDisplay

            if(data.payload.toShow) {
                formDisplay = CountDownForm.showForm()
             } else {
                formDisplay = CountDownForm.getForm()
             }

           // Dispatch the incoming message data by the message type.
           switch (data.type)
           {
              case CountDownForm.actions.INIT: 
                formDisplay.initPlay(data.type, data.payload); 
                break;
              case CountDownForm.actions.PLAY:
              case CountDownForm.actions.PAUSE: 
                formDisplay.updateForm(data.type, data.payload); 
                break;
              case CountDownForm.actions.RESET: 
                formDisplay.updateForm(data.type, data.payload); 
                formDisplay.resetCountDown();
                formDisplay.updateInput();
                break;
           }

        }
        catch (err)
        {
           console.error(err);
        }
     });
  }