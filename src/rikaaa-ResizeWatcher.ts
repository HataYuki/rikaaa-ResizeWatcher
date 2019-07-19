import Controller from './Controller';

const controller = new Controller(); 

export default class rikaaaResizeWatcher{
    public targets: Element[] = [];
    public entries: any = [];

    constructor(public callback:Function) {
        controller.init(this);
    }

    public observe(target: Element) {
        const exist = this.targets.includes(target);
        if (!exist) this.targets.push(target);
        controller.observe();
    }
    public unobserve(target: Element) {
        this.targets = this.targets.filter(existTarget => existTarget !== target);
        controller.unobserve();
    }
    public disconnect() {
        this.targets = [];
        controller.disconnect();
    }

    private static calculateContentRect(target: Element) {
        return Controller.calculateContentRect(target);
    }
    private static isDisplay(target: Element): boolean {
        return Controller.isDisplay(target);
    }
    private static get THROTTLE_INTERVAL() {
        return Controller.THROTTLE_INTERVAL;
    }
    private static get CONTROLLER() {
        return controller;
    }
}