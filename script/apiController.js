import { Utils } from "./utils.js";
import { CountDownForm } from "./CountDownForm.js";   
import { VISIBILITY_MODE } from "./models.js"

export function initApi () {
	game.modules.get(Utils.MODULE_NAME).api = {
		init: async ( seconds, isPlaying, visibilityMode) => {
			if (!game.user.isGM) return

			const form = await  CountDownForm.showForm(visibilityMode)
			form._initCount = seconds * 1000;
			form._actualCount = seconds * 1000;
			form.updateInput();
			if(isPlaying){
				await CountDownForm.PLAY();
			} else {
				await CountDownForm.PAUSE();
			}
			
		},
		start: () => {
			if (!game.user.isGM) return

			return CountDownForm.PLAY();

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
			if (!game.user.isGM) return

			const form = CountDownForm.getForm();
			if(form){
				form._visibilityMode = VISIBILITY_MODE.NONE
            	form.save(true)
				form.close();
			}
		},
		updateVisibilityMode: async (newVisibilityMode) => {
			if (!game.user.isGM) return

			const form = await CountDownForm.showForm(newVisibilityMode)
			form.updateVisibilityModeHighlight(newVisibilityMode)
			form.updateInput();
            form.save(true)
		}
	}
}