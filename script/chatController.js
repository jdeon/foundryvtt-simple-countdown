import { CountDownForm } from "./CountDownForm.js";   
import { VISIBILITY_MODE } from "./models.js"

export function initChatController() {

    ChatLog.MESSAGE_PATTERNS["scd"] = new RegExp("^(/scd )([^]*)", "i");

    //scd is added after invalid so we need to put back invalid at the end
    let invalid = ChatLog.MESSAGE_PATTERNS["invalid"]
    delete ChatLog.MESSAGE_PATTERNS["invalid"]
    ChatLog.MESSAGE_PATTERNS["invalid"] = invalid

    //Chat message hooks
    Hooks.on("chatMessage", async function (chatlog, message, chatData) {
        if (!message.startsWith('/scd') || !game.user.isGM) return;

        let messageArgs = message.split(' ')

        //No function
        if (messageArgs.length <= 1) {
            return
        }

        let functionName = messageArgs[1]

        if(functionName !== "init"){
            ui.notifications.error(game.i18n.localize("SIMPLE-COUNTDOWN.Chat-Command.Unrecognized"));
            return
        }

        let seconds = 0
        let isPlaying = false
        let visibilityMode = VISIBILITY_MODE.OBSERVER
        for(let i = 2; i < messageArgs.length ; i++){
            if(isNaN(messageArgs[i])){
                if( messageArgs[i] === "--play" ){
                    isPlaying = true
                } else if (messageArgs[i] === "--visibilityMode" || messageArgs[i] === "-vm"){
                    i++
                    visibilityMode = messageArgs[i]
                }
            } else {
                seconds = messageArgs[i]
            }
        }

        const form = await  CountDownForm.showForm(visibilityMode)
        form._initCount = seconds * 1000;
        form._actualCount = seconds * 1000;
        form.updateInput();
        if(isPlaying){
            await CountDownForm.PLAY();
        } else {
            await CountDownForm.PAUSE();
        }

        return false;
    })
}