export default (func: Function, interval: number) => {
    let timer = null;
    return function (...arg: any[]) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            return func.apply(this, arg);
        }, interval);
    }
}