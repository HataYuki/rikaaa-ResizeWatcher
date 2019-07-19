import rikaaaResizeWatcher from './rikaaa-ResizeWatcher';
import throttle from './throttle';
import debounce from './debounce';
import valueObserver from './valueObserver';
import onebang from './onbang';

import calculateContentRect from './calculateContentRect';
import isDisplay from './isDisplay';

import './Array.prototype.includes';

export default class Controller{
    private instanceOfResizeWatcher: rikaaaResizeWatcher[] = [];
    private targetsAll: Element[] = [];

    private entriesContaner: rikaaaResizeWatcher[];

    private firstCallback: Function;

    private watcher_binded: Function | any;

    private mo;
    private mutationObserverConfig = {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
    };

    constructor() {
        this.watcher_binded = throttle(Controller.watcher.bind(null, this), Controller.THROTTLE_INTERVAL);
        this.mo = new MutationObserver(this.watcher_binded);

        this.firstCallback = debounce(onebang((entriesContaner: rikaaaResizeWatcher[]) => {
            entriesContaner.forEach(entries => {
                const callbackArg = entries.entries.map(entry => {
                    const isDisplay = Controller.isDisplay(entry.target);
                    
                    if (isDisplay) return Object.freeze(
                        {
                            target: entry.target,
                            contentRect: entry.contentRect,
                        }
                    )
                }).filter(entry => typeof entry !== 'undefined');
                
                if (callbackArg.length !== 0) entries.callback(callbackArg);
            });
        }),Controller.THROTTLE_INTERVAL);
    }

    public init(instance:rikaaaResizeWatcher) {
        this.instanceOfResizeWatcher.push(instance);
    }
    public observe() {
        this.targetsAll = Controller.updateTargetsAll(this);
        if (this.targetsAll.length !== 0) Controller.onWatcher(this);

        this.entriesContaner = Controller.calculateEntriesContaner(this.instanceOfResizeWatcher);
        this.firstCallback(this.entriesContaner);
    }
    public unobserve() {
        this.targetsAll = Controller.updateTargetsAll(this);
        this.entriesContaner = Controller.calculateEntriesContaner(this.instanceOfResizeWatcher);
    }
    public disconnect() {
        this.targetsAll = Controller.updateTargetsAll(this);
        this.entriesContaner = Controller.calculateEntriesContaner(this.instanceOfResizeWatcher);

        if (this.targetsAll.length === 0) {
            Controller.offWatcher(this);
        }
    }

    private static watcher(instances: Controller) {
        instances.entriesContaner.forEach(entries => {
            const callbackArg = entries.entries.map(entry => {
                const currentContentRect = Controller.calculateContentRect(entry.target);
                const isResized = entry.valueObserver({ watch: Controller.contentRectWHToStr(currentContentRect) });

                if (isResized) entry.contentRect = currentContentRect;

                if (isResized) return Object.freeze(
                    {
                        target: entry.target,
                        contentRect: entry.contentRect,
                    }
                );
            }).filter(entry => typeof entry !== 'undefined');
            
            if (callbackArg.length !== 0) entries.callback(callbackArg);
        });
    }
    private static calculateEntriesContaner(instances: rikaaaResizeWatcher[]): rikaaaResizeWatcher[]{
        return instances.map(instance => {
            const entries = instance.targets.map(target => {
                const contentRect = Controller.calculateContentRect(target);
                return {
                    contentRect: contentRect,
                    target: target,
                    valueObserver: valueObserver(Controller.contentRectWHToStr(contentRect), () => true),
                }
            });

            instance.entries = entries;

            return instance;
        });
    }
    private static contentRectWHToStr(contentRect): String{
        return `${contentRect.width}${contentRect.height}`;
    }
    private static updateTargetsAll(instance: Controller): Element[]{
        return instance.instanceOfResizeWatcher.map(instance => instance.targets).reduce((a, c) => a.concat(c), []);
    }
    private static onWatcher(instance: Controller) {
        instance.mo.disconnect();
        instance.mo.observe(document.getElementsByTagName('html')[0], instance.mutationObserverConfig);

        window.addEventListener('resize', instance.watcher_binded, false);
    }
    private static offWatcher(instance: Controller) {
        instance.mo.disconnect();

        window.removeEventListener('resize', instance.watcher_binded);
    }
    public static calculateContentRect(target:Element) {
        return calculateContentRect(target)
    }
    public static isDisplay(target:Element):boolean {
        return isDisplay(target);
    }
    public static get THROTTLE_INTERVAL() {
        return 33;
    }


}