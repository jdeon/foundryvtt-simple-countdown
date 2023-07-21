import { Utils } from "./utils.js";

export const registerSettings = function () {
    
    game.settings.register(Utils.MODULE_NAME, "sync-deltatime", {
        name:  game.i18n.localize("SIMPLE-COUNTDOWN.Settings.SyncDeltaTime.name"),
        hint:  game.i18n.localize("SIMPLE-COUNTDOWN.Settings.SyncDeltaTime.hint"),
        default: 10,
        type: Number,
        scope: 'world',
        config: true,
    });
    
};