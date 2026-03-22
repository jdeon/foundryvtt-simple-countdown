import { CountDownForm } from "./script/CountDownForm.js";
import { registerSettings } from "./script/settings.js";
import { Utils } from "./script/utils.js";
import { addMenuButton } from "./script/uiController.js"
import { initApi } from "./script/apiController.js"
import { initChatController } from "./script/chatController.js"
import { ACTIONS, VISIBILITY_MODE } from "./script/models.js"


/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('add_countdown | Initializing simple-countdown');
    // Assign custom classes and constants here
    // Register custom module settings
    registerSettings();

    addMenuButton();
    initApi();
    initChatController();
    
    return loadTemplates(['modules/simple-countdown/template/countdown_panel.hbs']);
    
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
    console.log('add_countdown | ready to simple-countdown'); 
    listen()
});
  
  /**
  * Provides the main incoming message registration and distribution of socket messages on the receiving side.
  */
  function listen()
  {
     game.socket.on(Utils.s_EVENT_NAME, async (data) =>
     {
        if (typeof data !== 'object') { return; }
  
        if(game.user.isGM ){ return; }
  
        try
        {
            let formDisplay

            if(data.payload.visibilityMode === VISIBILITY_MODE.NONE){
               formDisplay = CountDownForm.getForm()

               if(formDisplay !== undefined){
                  formDisplay.close()
                  formDisplay = undefined
               }

            } else if(data.payload.toShow) {
                formDisplay = await CountDownForm.showForm(data.payload.visibilityMode)
             } else {
                formDisplay = CountDownForm.getForm()
             }

             if(formDisplay === undefined) {return ;}

           // Dispatch the incoming message data by the message type.
           switch (data.type)
           {
              case ACTIONS.INIT: 
                formDisplay.runTimer(data.type, data.payload,true); 
                break;
              case ACTIONS.PLAY:
               formDisplay.runTimer(data.type, data.payload,false); 
               break;
              case ACTIONS.PAUSE: 
                formDisplay.updateForm(data.type, data.payload);
                formDisplay.updateInput();
                break;
              case ACTIONS.RESET: 
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

  Hooks.on('pauseGame', (paused) => {
   const formDisplay = CountDownForm.getForm()

   if(formDisplay === undefined) {return ;}
  })