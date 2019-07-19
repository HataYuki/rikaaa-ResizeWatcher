import isDisplay from './isDisplay';

interface contentRect {
    width:  number,
    height: number,
    right:  number,
    left:   number,
    top:    number,
    bottom: number,
    x:      number,
    y:      number,
}

export default (target: Element): contentRect => {
    const style = getComputedStyle(target, '');

    const targetBounding = target.getBoundingClientRect();
    
    const parser = (px: any) => (px === ' ') ? 0 : parseFloat(px || '0px');    

    const paddingTop      = parser(style.paddingTop);
    const paddingBottom   = parser(style.paddingBottom);
    const paddingLeft     = parser(style.paddingLeft);
    const paddingRight    = parser(style.paddingRight);

    const borderTop       = parser(style.borderTopWidth);
    const borderBottom    = parser(style.borderBottomWidth);
    const borderLeft      = parser(style.borderLeftWidth);
    const borderRight     = parser(style.borderRightWidth);
    
    const paddingHorizon  = paddingTop  + paddingBottom;
    const paddingVertical = paddingLeft + paddingRight;
    
    const borderHorizon   = borderTop   + borderBottom;
    const borderVertical  = borderLeft  + borderRight;

    const width           = targetBounding.width  - paddingVertical - borderVertical;
    const height          = targetBounding.height - paddingHorizon  - borderHorizon;
    
    const contentRect = (isDisplay(target)) ?
        {
            width:  width,
            height: height,
            x:      paddingLeft,
            y:      paddingTop,
            top:    paddingTop,
            left:   paddingLeft,
            bottom: paddingTop + height,
            right:  paddingLeft + width,
        } :
        {
            width:  0,
            height: 0,
            x:      0,
            y:      0,
            top:    0,
            left:   0,
            bottom: 0,
            right:  0,
        };
    
    return Object.freeze(contentRect);
}