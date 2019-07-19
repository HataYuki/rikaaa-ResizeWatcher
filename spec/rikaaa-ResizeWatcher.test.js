const assert = require('assert');
const rikaaaResizeWatcher = require('../rikaaa-ResizeWatcher.dev.js');
const sinon = require('sinon');

describe('rikaaa-rikaaaResizeWatcher.js', () => {
    
    let wrap,
        container,
        target;
    
    const sampleEntries = {
        isBorderBoxFalse:null,
        isBorderBoxTrue:null,
    }

    let rw1, spy1, rw2, spy2;
    
    let counter = 0;
    
    let INTERVAL = rikaaaResizeWatcher.THROTTLE_INTERVAL;

    before(function () {
        console.log('before');
        document.body.innerHTML = __html__['rikaaa-ResizeWatcher.test.html']; //view html    
        
        wrap      = document.getElementById('wrap');
        container = document.getElementById('container');
        target = document.getElementById('target');

        sampleEntries.isBorderBoxFalse = [{
            contentRect: {
                bottom: 500,
                height: 500,
                left: 50,
                right: 550,
                top: 0,
                width: 500,
                x: 50,
                y: 0,
            },
            target: target,
        }];

        sampleEntries.isBorderBoxTrue = [{
            contentRect: {
               bottom: 440,
               height: 440,
               left: 47,
               right: 440,
               top: 0,
               width: 393,
               x: 47,
               y: 0,
            },
            target: target,
        }]; 

        // const test1 = new rikaaaResizeWatcher(entries => {
        // //    console.log(entries);
            
        // });
        // test1.observe(target);

        // var callback = function (entries) {
        //     entries.forEach(function (entry) {

        //         console.log(entry.target);
        //         console.log(entry.contentRect);

        //     });
        // }

        // var test2 = new rikaaaResizeWatcher(callback);

        // test2.observe(document.getElementById('target'));

        // test2.observe(wrap);

        // console.log(test1.entries);
        
        // console.log(test2.entries);
        


    });
    // it ('a', () => {
    //     assert(true);
    // });
    it('observe', done => {
        counter++;

        spy1 = sinon.spy();
        spy2 = sinon.spy();

        target.style.display = 'none';

        rw1 = new rikaaaResizeWatcher(spy1);
        rw2 = new rikaaaResizeWatcher(spy2);

        rw1.observe(wrap);
        rw1.observe(container);
        rw1.observe(target);
       
        rw2.observe(target);
        rw2.observe(target);
        rw2.observe(target);

        setTimeout(function () {    
            
            assert(rw1.entries.length === 3);
            assert(rw2.entries.length === 1);

            assert(spy1.callCount === 1);
            assert(spy2.callCount === 0);

            const rw1Arg = spy1.getCall(0).args[0];
            
            assert(rw1Arg.length === 2);

            assert(rw1Arg[0].target === wrap);
            assert(rw1Arg[1].target === container);

            done();
        }, INTERVAL * counter);
       
    });

    it('unobserve', done => {
        counter++;

        rw1.unobserve(wrap);
        rw1.unobserve(container);
        rw1.unobserve(target);
        
        rw2.unobserve(wrap);
        rw2.unobserve(container);
        rw2.unobserve(target);
       
        setTimeout(function () {
            
             assert(rw1.entries.length === 0);
             assert(rw2.entries.length === 0);

            done();
        }, INTERVAL * counter);
    });

    it('disconnect', done => {
        counter++;

        rw1.observe(target);
        rw2.observe(target);
        rw1.disconnect();
        target.style.display = 'block';
        
        setTimeout(function () {
            assert(spy1.callCount === 1);
            assert(spy2.callCount === 1);

            rw2.disconnect();
            target.style.width = '2000px';

            counter++;
            setTimeout(function () {
                assert(spy2.callCount === 1);
                target.style.width = '';
                done();
            },INTERVAL*counter);
        },INTERVAL * counter);
    });

    it('dom chenge', done => {
        counter++;

        spy1 = sinon.spy();
        spy2 = sinon.spy();

        rw1 = new rikaaaResizeWatcher(spy1);
        rw2 = new rikaaaResizeWatcher(spy2);

        rw1.observe(target);
        rw2.observe(target);

        target.style.display = 'none';

        setTimeout(function () {

            console.log(spy1.callCount);
            
            assert(spy1.callCount === 1);
            assert(spy2.callCount === 1);

            const arg1 = spy1.getCall(0).args[0];
            const arg2 = spy2.getCall(0).args[0];

            for (let key in arg1[0].contentRect) {
                assert(arg1[0].contentRect[key] === 0);
                assert(arg2[0].contentRect[key] === 0);
            }

            done();
        },INTERVAL*counter);
    });

    it('is display check', done => {
        counter++;
        
        setTimeout(function () {
            assert(rikaaaResizeWatcher.isDisplay(target) === false);
            assert(rikaaaResizeWatcher.isDisplay(container) === true);
            done();
        }, INTERVAL * counter);
    });

    it('contentRect check', done => {
        counter++;
        
        setTimeout(function () {
            target.style.display = '';
            const contentRect_boxsizing = rikaaaResizeWatcher.calculateContentRect(target);
            wrap.classList.remove('boxsizing');
            const contentRect = rikaaaResizeWatcher.calculateContentRect(target);

            const borderboxTrue = sampleEntries.isBorderBoxTrue[0].contentRect;
            const borderboxFalse = sampleEntries.isBorderBoxFalse[0].contentRect;

            for (let key in borderboxTrue) {
                assert(contentRect_boxsizing[key] === borderboxTrue[key]);
                assert(contentRect[key] === borderboxFalse[key]);
            }

            done();
        },INTERVAL * counter);
        
    });
});