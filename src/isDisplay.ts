export default (target: any): boolean => {
    let result:boolean = false;

    const style = target.currentStyle || getComputedStyle(target, '');
    result = (style.display === 'none') ? false : true;
    return result;
};