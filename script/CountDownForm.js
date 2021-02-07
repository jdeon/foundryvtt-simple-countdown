
let displayMain = null;

export class CountDownForm extends FormApplication {
    
    constructor(object = {}, options = null) {
        super(object, options);
        this._play = false;
        this._initCount = 0;
        this._actualCount = 0;
        this._timerId = null;
    }
    
    static showForm() {
        if (!displayMain) {
            displayMain = new CountDownForm();
            //CountDownForm.setupHooks();
        }
        displayMain.render(true);
    }
    
    static timeInObj(seconds) {
       let timeObject = {
            h : Math.floor(seconds / (60*60)),
            min : Math.floor((seconds/60) % 60),
            sec : Math.floor(seconds%60)
        }
       return timeObject;
    }
    
    static timeInSec(objTime = {}) {
        let seconds = 0;
        seconds += objTime.h *60*60;
        seconds += objTime.min *60;
        seconds += objTime.sec *1;
        
        return seconds;
    }

    activateListeners(html) {
        //super.activateListeners(html);
        
        if (!game.user.isGM)
            return;

        
        $(html)
            .find("#countdown_btn_start")
            .click(event => {
                this._play = true;
            
                if(this._timerId == null){
                    this.initCountDown();
                    this._timerId = setInterval(this.timerRunning, 1000);
                }
  
                //this.render(false);
            });
        
        $(html)
            .find("#countdown_btn_pause")
            .click(event => {
                this._play = false;
                //this.render(false);
            });
        
        $(html)
            .find("#countdown_btn_reset")
            .click(event => {
                this.resetCountDown();
                this.updateInput();
                //this.render(false);
            });
    }
        
    get title() {
        return "Test countdown";
    }
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/dnd5e-Countdown/template/countdown_panel.html";
        // options.width = 520;
        // options.height = 520; // should be "auto", but foundry has problems with dynamic content
        options.resizable = true;
        options.title = "Countdown";
        return options;
    }
    /**
     * Provides data to the form, which then can be rendered using the handlebars templating engine
     */
    getData() {
        
        return {
            //now: DateTime.now().longDateSelect(game.settings.get("about-time", "calendarFormat")),
            //running: (PseudoClock.isRunning() === undefined || PseudoClock._globalRunning) && !game.paused,
            //@ts-ignore
            //isMaster: game.Gametime.isMaster(),
            //@ts-ignore
            isGM: game.user.isGM
        };
        
    }
    
    close() {
        displayMain = null;
        return super.close();
    }
    
    timerRunning(){
        if(displayMain._play && !game.paused){
            displayMain._actualCount -=1;
            
            if(displayMain._actualCount < 0){
                displayMain.resetCountDown();
            }
            
            displayMain.updateInput();
        }
    }
    
    updateInput(){
        const objTimer = CountDownForm.timeInObj(this._actualCount);
        document.getElementById("countdown_h_value").value = objTimer.h;
        document.getElementById("countdown_min_value").value = objTimer.min;
        document.getElementById("countdown_sec_value").value = objTimer.sec;
    }
    
    initCountDown(){
        const objTimer = {};
        objTimer.h = document.getElementById("countdown_h_value").value;
        objTimer.min = document.getElementById("countdown_min_value").value;
        objTimer.sec = document.getElementById("countdown_sec_value").value;
        
        let seconds = CountDownForm.timeInSec(objTimer);
        this._initCount = seconds;
        this._actualCount = seconds;  
    }
    
    resetCountDown(){
        this._play = false;
        this._actualCount = this._initCount;
        clearTimeout(this._timerId);
        this._timerId = null;
    }

    /*
    static setupHooks() {
        Hooks.on("updateWorldTime", SimpleCalendarDisplay.updateClock);
        Hooks.on("renderPause", SimpleCalendarDisplay.updateClock);
        Hooks.on("updateCombat", SimpleCalendarDisplay.updateClock);
        Hooks.on("deleteCombat", SimpleCalendarDisplay.updateClock);
        Hooks.on("about-time.clockRunningStatus", SimpleCalendarDisplay.updateClock);
    }
    */
}
