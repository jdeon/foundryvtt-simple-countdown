export class Utils {

    static MODULE_NAME = 'simple-countdown';

    static s_EVENT_NAME = `module.${Utils.MODULE_NAME}`;

    static timeInObj(millis) {
        let seconds = Math.floor(millis / 1000)

        let timeObject = {
             h : String(Math.floor(seconds / (60*60))),
             min : String(Math.floor((seconds/60) % 60)),
             sec : String(Math.floor(seconds%60))
         }
        return timeObject;
     }
     
     static timeInMillis(objTime = {}) {
         let seconds = 0;
         seconds += Number(objTime.h === "" ? 0 : objTime.h) *60*60;
         seconds += Number(objTime.min === "" ? 0 : objTime.min) *60;
         seconds += Number(objTime.sec === "" ? 0 : objTime.sec) *1;
         
         return seconds * 1000;
     }

}