import { Utils } from "./utils.js";
import { CountDownForm } from "./CountDownForm.js";   

export function initApi () {
	game.modules.get(Utils.MODULE_NAME).api = {
		init: ( seconds, visibilityMode) => {
			if (!game.user.isGM) return

			return CountDownForm.showForm(visibilityMode).then(( form ) => {
				form._initCount = seconds * 1000;
				form._actualCount = seconds * 1000;
				form.updateInput();
			});

		},
		start: ( seconds, visibilityMode) => {
			if (!game.user.isGM) return

			return CountDownForm.showForm(visibilityMode).then(( form ) => {
				if( seconds ) {
					form._initCount = seconds * 1000;
					form._actualCount = seconds * 1000;
					form.updateInput();
				}
				return CountDownForm.PLAY();
			});

		},
		pause: () => {
			if (!game.user.isGM) return

			return CountDownForm.PAUSE();
		},
		reset: () => {
			if (!game.user.isGM) return

			return CountDownForm.RESET();
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