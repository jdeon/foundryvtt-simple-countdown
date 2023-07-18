import { Utils } from "./utils.js"

let displayMain = null;

export const s_EVENT_NAME = 'module.simple-countdown';

export class CountDownForm extends FormApplication {

    constructor(object = {}, options = {}) {
        super(object, options);
        this._play = false;
        this._initCount = 0;
        this._actualCount = 0;
        this._timerId = null;
        this._action = null;
    }

    static actions = {
        INIT : "INIT",
        PLAY : "PLAY",
        PAUSE : "PAUSE",
        RESET : "RESET"
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/simple-countdown/template/countdown_panel.html";
        // options.width = 520;
        // options.height = 520; // should be "auto", but foundry has problems with dynamic content
        options.resizable = false;
        options.title = "Countdown";
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
        
        $(html)
            .find("#countdown_btn_start")
            .click(event => {
                this._play = true;
            
                if(this._timerId == null){
                    this.initCountDown();
                    this._timerId = setInterval(this.timerRunning, 100);
                    this._action = CountDownForm.actions.INIT;
                } else {
                    this._action = CountDownForm.actions.PLAY;
                }
            
                this.save();
            });
        
        $(html)
            .find("#countdown_btn_pause")
            .click(event => {
                this._play = false;
                this._action = CountDownForm.actions.PAUSE;
                this.save();
            });
        
        $(html)
            .find("#countdown_btn_reset")
            .click(event => {
                this.resetCountDown();
                this.updateInput();
                this._action = CountDownForm.actions.RESET;
                this.save();
            });
    }
        
    get title() {
        return "Countdown";
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
        if(displayMain._play && !game.paused){
            displayMain._actualCount -= .1;
            
            if(displayMain._actualCount < 0){
                displayMain.resetCountDown();
            }
            
            displayMain.updateInput();
        }
    }
    
    updateInput(){
        let seconds = parseInt(this._actualCount)
        const objTimer = Utils.timeInObj(seconds);
        document.getElementById("countdown_h_value").value = objTimer.h;
        document.getElementById("countdown_min_value").value = objTimer.min;
        document.getElementById("countdown_sec_value").value = objTimer.sec;
    }
    
    initCountDown(){
        const objTimer = {};
        objTimer.h = document.getElementById("countdown_h_value").value;
        objTimer.min = document.getElementById("countdown_min_value").value;
        objTimer.sec = document.getElementById("countdown_sec_value").value;
        
        let seconds = Utils.timeInSec(objTimer);
        this._initCount = seconds;
        this._actualCount = seconds;  
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
