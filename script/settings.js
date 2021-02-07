import { CountDownForm } from "./CountDownForm.js";

export const registerSettings = function () {
    // Register any custom module settings here
    let modulename = "dnd5e-countdown";   

    game.settings.register("dnd5e-countdown", "store", {
        name: "Save Action Countdown",
        hint: "Don't touch this",
        default: {},
        type: Object,
        scope: 'world',
        config: false,
        onChange: CountDownForm.reload
    });
};