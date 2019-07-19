import onebang from './onbang';
import debounce from './debounce';

export default (func: Function, interval: number) => {
    let req = null;
    let startTime = null;

    let firstFunc = onebang(func);
    const lastFunc = debounce(func, interval);
    
    const clearFirstFunc = debounce(() => {
        firstFunc = onebang(func);
        startTime = null;
        cancelAnimationFrame(req);
    }, interval);

    return function (...arg: any[]) {
        firstFunc.apply(this, arg);
        req = requestAnimationFrame((timestamp) => {
            if (startTime === null) startTime = timestamp;
            const elapsedTime = timestamp - startTime;
            if (elapsedTime >= interval) {
                startTime = null;
                cancelAnimationFrame(req);
                return func.apply(this, arg);
            }
        });
        clearFirstFunc();
        return lastFunc.apply(this,arg);
    }
}