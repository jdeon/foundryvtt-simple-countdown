import { CountDownForm } from "./CountDownForm.js";   

export function addMenuButton () {
  Hooks.on("getSceneControlButtons", (controls) => {
    const toolsNotesLength = Object.keys(controls.notes.tools).length
    controls.notes.tools["simple-countdown"] = {
      name: 'simple-countdown',
      title: 'Countdown',
      icon: 'far fa-hourglass',
      button: true,
      onClick: () => CountDownForm.showForm(),
      visible: game.user.isGM,
      order : toolsNotesLength + 1
    }
  });
}