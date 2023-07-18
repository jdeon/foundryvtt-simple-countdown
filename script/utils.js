export class Utils {

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

}