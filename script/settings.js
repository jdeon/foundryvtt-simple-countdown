import { Utils } from "./utils.js";

export const registerSettings = function () {
    
    game.settings.register(Utils.MODULE_NAME, "sync-deltatime", {
        name: "Synchronisation deltatime",
        hint: "Interval in seconds where the remaining time is synchronize with the clients",
        default: 10,
        type: Number,
        scope: 'world',
        config: true,
    });
    
};