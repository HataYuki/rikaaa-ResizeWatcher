# rikaaa-ResizeWatcher.js
The plugin surveil resizing of elements.

[:heavy_exclamation_mark:] The plugin is copying the ResizeObserver, however it is not perfect system, but minimamaize the function.

## Description
- This is the plugin in order to supply similar function of ResizeObserver with brower of without ResizeObserver.
- [:heavy_exclamation_mark:] This plugin is not perfect system. Therefor it is not recomended to use as polyfill. Please be carefull, in case you use the plugin as polyfill.
- Although the plugin is not utilize the whole function of the ResizeObserve, It is recomended to use simiar function simple plugin, for example IE11.
- This plugin is copying the methodorogy of the ResizeObserver.
- [:heavy_exclamation_mark:]The plugin is not support SVG.

## Usage
```bash
import rikaaaResizeWatcher from 'rikaaa-ResizeWatcher.js'
```

```bash
var callback = function (entries) {
    entries.forEach(function (entry) {

        console.log(entry.target);
        console.log(entry.contentRect);

    });
}

var test2 = new rikaaaResizeWatcher(callback);

test2.observe(document.getElementById('target'));
```

## Constractor arguments
---
| argument | require | type | description |
---- | ---- | ---- | ----
| callback | require | Function | set the callback|


## Methods
----
| method | type |description |
---- | ---- | -----
| rikaaaResizeWatcher.observe(targetElement) | Element | Set the target of observed. |
| rikaaaResizeWatcher.unobserve(targetElement) | Element |　Set the target of unobserved. | 
| rikaaaResizeWatcher.disconnect() | none | Ends the moniter of observed.|


## Callback 
----
| argument | type　| description |
---- | ---- | ----
| entry.target | Element | ElementNode of observed. |
| entry.contentRect | boolean | The parameter of rectangle of observed. |