export default (func:Function) => {
    let _func,
        allow = true;
    return function (...arg:any[]) {
        if (!allow) {
            func = null;
            return false;
        }
        _func = func.apply(this, arg);
        allow = false;
        return _func;
    }
}