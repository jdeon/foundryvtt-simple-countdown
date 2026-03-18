import { Utils } from "./utils.js";
import { CountDownForm } from "./CountDownForm.js";   

export function initApi () {
	game.modules.get(Utils.MODULE_NAME).api = {
		init: ( seconds, visibilityMode) => {
			if (!game.user.isGM) return

			CountDownForm.showForm().then(( form ) => {
				form._initCount = seconds * 1000;
				form._actualCount = seconds * 1000;
				form.updateInput();
			});

		},
		start: ( seconds, visibilityMode) => {
			if (!game.user.isGM) return

			CountDownForm.showForm().then(( form ) => {
				form._initCount = seconds * 1000;
				form._actualCount = seconds * 1000;
				form.updateInput();
				CountDownForm.PLAY.call(form);
			});

		},
		pause: () => {
			if (!game.user.isGM) return

			CountDownForm.PAUSE.call(form);
		},
		reset: () => {
			if (!game.user.isGM) return

			CountDownForm.RESET.call(form);
		},
		close: () => {
			const form = CountDownForm.getForm();
			if(form){
				form.close();
			}
		},
		updateVisibilityMode: (newVisibilityMode) => {
			if (!game.user.isGM) return

			this._visibilityMode = newVisibilityMode
            this.save(true)
		}
	}
}