import { Utils } from "./utils.js"

let displayMain = null;

export class CountDownForm extends FormApplication {

    constructor(object = {}, options = {}) {
        super(object, options);
        this._play = false;
        this._initCount = 0;        //in ms
        this._actualCount = 0;      //in ms
        this._timerId = null;
        this._action = null;
        this._nextSync = game.settings.get(Utils.MODULE_NAME, "sync-deltatime") * 1000;
        this._lastUpdate = Date.now()
        this._inputs = {}
    }

    static actions = {
        INIT : "INIT",
        PLAY : "PLAY",
        PAUSE : "PAUSE",
        RESET : "RESET"
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.title = game.i18n.localize("SIMPLE-COUNTDOWN.Overlay.Title"),
        options.template = "modules/simple-countdown/template/countdown_panel.html";
        options.height = "auto"
        options.resizable = false;
        return options;
    }
    
    static showForm() {
        if (!displayMain) {
            let idCss;
            
            if (game.user.isGM){
                idCss = 'countdown-form-GM';
            } else {
                idCss = 'countdown-form'
            }
            
            displayMain = new CountDownForm({},{id : idCss});
        }

        displayMain.render(true, {});

        return displayMain;
    }

    static getForm(){
        return displayMain;
    }

    activateListeners(html) {
        //super.activateListeners(html);

        this._initButton(html)
        
        
        this._inputs.playButton.click(event => {
            this._play = true;
        
            if(this._timerId == null){
                this.initCountDown();
                this._timerId = setInterval(this.timerRunning, 100);
                this._action = CountDownForm.actions.INIT;
            } else {
                this._action = CountDownForm.actions.PLAY;
            }

            this._inputs.playButton.addClass('hidded')
            this._inputs.pauseButton.removeClass('hidded')
        
            this.save(true);
        });
        
        this._inputs.pauseButton.click(event => {
            this._play = false;
            this._action = CountDownForm.actions.PAUSE;

            this._inputs.pauseButton.addClass('hidded')
            this._inputs.playButton.removeClass('hidded')

            this.save(true);
        });
        
        this._inputs.resetButton.click(event => {
            this.resetCountDown();
            this.updateInput();
            this._action = CountDownForm.actions.RESET;
  
            this._inputs.pauseButton.addClass('hidded')
            this._inputs.playButton.removeClass('hidded')

            this.save(true);
        });

        this._inputs.syncButton.click(event => {
            this.save(false);
            this._nextSync = game.settings.get(Utils.MODULE_NAME, "sync-deltatime") * 1000;
        });
    }
        
    get title() {
        return game.i18n.localize("SIMPLE-COUNTDOWN.Overlay.Title");
    }

    /**
     * Provides data to the form, which then can be rendered using the handlebars templating engine
     */
    getData() {
        
        return {
            isGM: game.user.isGM
        };
        
    }
    
    close() {
        if(null !== displayMain && null !== displayMain._timerId){
            clearTimeout(displayMain._timerId);
        }
        displayMain = null;
        return super.close();
    }

    _initButton(html){
        this._inputs.playButton = $(html).find("#countdown_btn_start")
        this._inputs.pauseButton = $(html).find("#countdown_btn_pause")
        this._inputs.resetButton = $(html).find("#countdown_btn_reset")
        this._inputs.syncButton = $(html).find("#countdown_btn_sync")

        this._inputs.hoursField = $(html).find("#countdown_h_value")
        this._inputs.minutesField = $(html).find("#countdown_min_value")
        this._inputs.secondsField = $(html).find("#countdown_sec_value")
    }

    
    updateForm(action, payload){
        this._action = action;

        this._play = action === CountDownForm.actions.INIT  || action === CountDownForm.actions.PLAY;
        this._initCount = payload.initCount;
        this._actualCount = payload.remaningCount;
    }

    initPlay(action, payload){
        this._play = true;
        if(null !== this._timerId){
            clearTimeout(this._timerId);
        }
        this._timerId = setInterval(this.timerRunning, 100);
        
        this.updateForm(action, payload)
    }
    
    timerRunning(){
        const now = Date.now()
        const deltatime = now - displayMain._lastUpdate;

        if(displayMain._play && !game.paused){
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
    
    updateInput(){
        let seconds = parseInt(this._actualCount)
        const objTimer = Utils.timeInObj(seconds);
        this._inputs.hoursField.val(objTimer.h);
        this._inputs.minutesField.val(objTimer.min);
        this._inputs.secondsField.val(objTimer.sec);
    }
    
    initCountDown(){
        const objTimer = {};
        objTimer.h = this._inputs.hoursField.val();
        objTimer.min = this._inputs.minutesField.val();
        objTimer.sec = this._inputs.secondsField.val();
        
        const millis = Utils.timeInMillis(objTimer);
        this._initCount = millis;
        this._actualCount = millis;
        this._lastUpdate = Date.now()  
    }
    
    resetCountDown(){
        this._play = false;
        this._actualCount = this._initCount;
        clearTimeout(this._timerId);
        this._timerId = null;
    }

    save(toShow){
        if(game.user.isGM){
            let data = {
                initCount : this._initCount,
                remaningCount : this._actualCount,
                toShow : toShow
            }

            game.socket.emit(Utils.s_EVENT_NAME, {
                type: this._action,
                payload: data
            });
        }
    }
}
