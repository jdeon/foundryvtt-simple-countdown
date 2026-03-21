import { Utils } from "./utils.js"
import { ACTIONS, VISIBILITY_MODE } from "./models.js"
const { ApplicationV2, HandlebarsApplicationMixin  } = foundry.applications.api

let displayMain = null;

export class CountDownForm extends HandlebarsApplicationMixin (ApplicationV2) {

    constructor(object = {}, options = {}, visibilityMode) {
        super(object, options);
        this._isPlaying = false;
        this._initCount = 0;        //in ms
        this._actualCount = 0;      //in ms
        this._timerId = null;
        this._action = null;
        this._nextSync = game.settings.get(Utils.MODULE_NAME, "sync-deltatime") * 1000;
        this._lastUpdate = Date.now()
        this._inputs = {}
        this._visibilityMode = visibilityMode ? visibilityMode : VISIBILITY_MODE.OBSERVER
    }

    /***********************************************************
     *************** Needed by application v2 - BEGIN  *********
     **********************************************************/
    static DEFAULT_OPTIONS = {
        id: "countdown-form",
        form: {
            //handler: TemplateApplication.#onSubmit,
            closeOnSubmit: true,
        },
        position: {
            width: 200,
            height: "auto",
        },
        tag: "form", // The default is "div"
        window: {
            resizable: false
        },
        actions: {
            play: CountDownForm.PLAY,
            pause: CountDownForm.PAUSE,
            reset: CountDownForm.RESET,
            sync: CountDownForm.SYNC
        }
    }

    static PARTS = {
        countdownPanel: {
            template: "./modules/simple-countdown/template/countdown_panel.hbs"
        }
    }

    get title() {
        return game.i18n.localize("SIMPLE-COUNTDOWN.Overlay.Title");
    }

    /**
     * Provides data to the form, which then can be rendered using the handlebars templating engine
     */
    _prepareContext() {
        return {
            isGM: game.user.isGM,
            showTimer: game.user.isGM || this._visibilityMode === VISIBILITY_MODE.OBSERVER
        };
    }

    _onRender(context, options) {
        this._initButton()
        this.updateVisibilityModeHighlight(this._visibilityMode)

        this.element.querySelectorAll("#countdown_visibility .item").forEach((item) => item.addEventListener("click", event => {
            this._visibilityMode = event.currentTarget.dataset['mode'];

            this.updateVisibilityModeHighlight(this._visibilityMode)

            this.save(true)
        }))

        if(this._isPlaying){
            this.element.querySelector("#countdown_panel").classList.add("playing")
        }
    }
    
    close() {
        if(null !== displayMain && null !== displayMain._timerId){
            clearTimeout(displayMain._timerId);
        }
        displayMain = null;
        return super.close();
    }
    /***********************************************************
     *************** Needed by application v2 - END  *********
     **********************************************************/
    
    static async showForm(visibilityMode) {
        if (!displayMain) {
            displayMain = new CountDownForm({},{id : 'countdown-form'}, visibilityMode ?? VISIBILITY_MODE.OBSERVER);

            await displayMain.render(true, {});
        } else if(visibilityMode !== undefined && visibilityMode !== displayMain._visibilityMode){
            displayMain._visibilityMode = visibilityMode
            await displayMain.render()
        }

        return displayMain;
    }

    static getForm(){
        return displayMain;
    }

    static async PLAY () {
        const form = await CountDownForm.showForm()
        form._setIsPlaying(true);
        
        if(form._timerId == null){
            form._initCountDown();
            form._timerId = setInterval(form._timerInterval, 100);
            form._action = ACTIONS.INIT;
        } else {
            form._action = ACTIONS.PLAY;
        }
    
        form.save(true);
    }

    static async PAUSE () {
        const form = await CountDownForm.showForm()
        form._setIsPlaying(false);
        form._action = ACTIONS.PAUSE;
        form.updateInput()
        form.save(true);
    }

    static async RESET () {
        const form = await CountDownForm.showForm()
        form.resetCountDown();
        form.updateInput();
        form._action = ACTIONS.RESET;

        form.save(true);
    }

    static async SYNC () {
        const form = await CountDownForm.showForm()
        form.save(false);
        form._nextSync = game.settings.get(Utils.MODULE_NAME, "sync-deltatime") * 1000;
    }

    _initButton(){
        this._inputs.hoursField = this.element.querySelector("#countdown_h_value")
        this._inputs.minutesField = this.element.querySelector("#countdown_min_value")
        this._inputs.secondsField = this.element.querySelector("#countdown_sec_value")
    }

    get title() {
        return game.i18n.localize("SIMPLE-COUNTDOWN.Overlay.Title");
    }

    _setIsPlaying(isPlaying){
        this._isPlaying = isPlaying

        if(isPlaying){
            this.element.querySelector("#countdown_panel").classList.add("playing")
        } else {
            this.element.querySelector("#countdown_panel").classList.remove("playing")
        }
    }

    _timerInterval(){
        const now = Date.now()
        const deltatime = now - displayMain._lastUpdate;

        if(displayMain._isPlaying && !game.paused){
            displayMain._actualCount -= deltatime;
            
            if(displayMain._actualCount < 0){
                displayMain.resetCountDown();
            }
            
            displayMain.updateInput();

            if(game.user.isGM){
                displayMain._nextSync -= deltatime;
                if(displayMain._nextSync < 0){
                    displayMain.save(false)
                    displayMain._nextSync = game.settings.get(Utils.MODULE_NAME, "sync-deltatime") * 1000;
                }
            }
        }

        displayMain._lastUpdate = now
    }
    
    updateForm(action, payload){
        this._action = action;

        this._setIsPlaying(action === ACTIONS.INIT  || action === ACTIONS.PLAY);
        this._initCount = payload.initCount;
        this._actualCount = payload.remaningCount;
    }

    runTimer(action, payload, isInit){
        this._setIsPlaying(true);
        if(isInit && null !== this._timerId){
            clearTimeout(this._timerId);
            this._timerId = null;
        }

        if(this._timerId === null){
            this._timerId = setInterval(this._timerInterval, 100);
        }
        
        this.updateForm(action, payload)
    }
    
    updateInput(){
        let seconds = parseInt(this._actualCount)
        const objTimer = Utils.timeInObj(seconds);

        if(!this._inputs.hoursField){
            this._initButton()
        }

        if(this._inputs.hoursField && this._inputs.minutesField && this._inputs.secondsField ){
            this._inputs.hoursField.value = objTimer.h;
            this._inputs.minutesField.value = objTimer.min;
            this._inputs.secondsField.value = objTimer.sec;
        }
    }

    updateVisibilityModeHighlight(visibilityMode){
        this.element.querySelectorAll("#countdown_visibility .item").forEach((item) => {
            if(item.dataset['mode'] === visibilityMode){
                item.classList.add('active')
            } else {
                item.classList.remove('active')
            }
        })
    }
    
    _initCountDown(){
        const objTimer = {};

        if(!this._inputs.hoursField){
            this._initButton()
        }

        if(this._inputs.hoursField && this._inputs.minutesField && this._inputs.secondsField ){
            objTimer.h = this._inputs.hoursField.value;
            objTimer.min = this._inputs.minutesField.value;
            objTimer.sec = this._inputs.secondsField.value;
        }
        
        const millis = Utils.timeInMillis(objTimer);
        this._initCount = millis;
        this._actualCount = millis;
        this._lastUpdate = Date.now()  
    }
    
    resetCountDown(){
        this._setIsPlaying(false);
        this._actualCount = this._initCount;
        clearTimeout(this._timerId);
        this._timerId = null;
    }

    save(toShow){
        if(game.user.isGM){
            let data = {
                initCount : this._initCount,
                remaningCount : this._actualCount,
                visibilityMode : this._visibilityMode,
                toShow : toShow
            }

            game.socket.emit(Utils.s_EVENT_NAME, {
                type: this._action,
                payload: data
            });
        }
    }
}
