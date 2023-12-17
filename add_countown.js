import { CountDownForm } from "./script/CountDownForm.js";
import { registerSettings } from "./script/settings.js";
import { Utils } from "./script/utils.js";


/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('add_countdown | Initializing simple-countdown');
    // Assign custom classes and constants here
    // Register custom module settings
    registerSettings();

    Hooks.on("getSceneControlButtons", (controls) => {
      controls[0].tools.push({
      name: 'simple-countdown',
      title: 'Countdown',
      icon: 'far fa-hourglass',
      button: true,
      onClick: () => CountDownForm.showForm(),
      visible: game.user.isGM
      })
  });
    
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
    console.log('add_countdown | ready to simple-countdown'); 
    listen()
});
  
  /**
  * Provides the main incoming message registration and distribution of socket messages on the receiving side.
  */
  function listen()
  {
     game.socket.on(Utils.s_EVENT_NAME, (data) =>
     {
        if (typeof data !== 'object') { return; }
  
        if(game.user.isGM){ return; }
  
        try
        {
            let formDisplay

            if(data.payload.toShow) {
                formDisplay = CountDownForm.showForm(data.payload.visibilityMode)
             } else {
                formDisplay = CountDownForm.getForm()
             }

             if(formDisplay === undefined) {return ;}

           // Dispatch the incoming message data by the message type.
           switch (data.type)
           {
              case CountDownForm.actions.INIT: 
                formDisplay.play(data.type, data.payload,true); 
                break;
              case CountDownForm.actions.PLAY:
               formDisplay.play(data.type, data.payload,false); 
               break;
              case CountDownForm.actions.PAUSE: 
                formDisplay.updateForm(data.type, data.payload);
                formDisplay.updateInput();
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

  Hooks.on('pauseGame', (paused) => {
   const formDisplay = CountDownForm.getForm()

   if(formDisplay === undefined) {return ;}

   formDisplay.pauseTimerRotating(paused)
  })