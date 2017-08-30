# ng2-knob
ng-knob for Angular and TypeScript with D3v4
Angular 4 directive to Knob component powered by d3.js (without jQuery)

Features
-------
- very easy to implement
- without jQuery dependencies
- powered by d3.js v4
- configurable minimum, maximum values and step
- animated
- great ability to configure
- configurable scale
- touch, click and drag events implemented

#### Dependencies

- Angular 4
- D3.js V4
- @types/d3-selection@^1.1.0

#### Browser Support

- Chrome, Firefox, Safari, Opera, IE9+

Get started
-------

#### Installation
You can also use bower to install the component:
```bash
$ bower install ng2-knob --save
```

#### Usage

###### HTML:
```html
<div ui-knob [value]="value" [label]="label"
         [options]="donutOptions"></div>

```
