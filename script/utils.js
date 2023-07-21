export class Utils {

    static MODULE_NAME = 'simple-countdown';

    static s_EVENT_NAME = `module.${Utils.MODULE_NAME}`;

    static timeInObj(millis) {
        let seconds = Math.floor(millis / 1000)

        let timeObject = {
             h : Math.floor(seconds / (60*60)),
             min : Math.floor((seconds/60) % 60),
             sec : Math.floor(seconds%60)
         }
        return timeObject;
     }
     
     static timeInMillis(objTime = {}) {
         let seconds = 0;
         seconds += objTime.h *60*60;
         seconds += objTime.min *60;
         seconds += objTime.sec *1;
         
         return seconds * 1000;
     }

}