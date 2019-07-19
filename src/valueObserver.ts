export default (firstVal: any, func: Function, option: { observValKeyName?: string; } = { observValKeyName:'watch'}) => {
    let _func,
        _firstval = firstVal,
        _watchKeyName = option.observValKeyName;
    
    return function ({ } = {}) {
        let originalArgument = [],
            watchVal = null;
        for (let i = 0; i < arguments.length; i++) {
            if (!(arguments[i]) || !(arguments[i].constructor == Object)) {
                originalArgument.push(arguments[i]);

            } else {
                watchVal = arguments[i][_watchKeyName];
                delete arguments[i][_watchKeyName]
                if (Object.keys(arguments[i]).length > 0) {
                    originalArgument.push(arguments[i]);
                }
            }
        }
        if (_firstval === watchVal) {
            return false;
        }
        _firstval = watchVal;
        _func = func.apply(this, originalArgument);
        return _func;
    }
}