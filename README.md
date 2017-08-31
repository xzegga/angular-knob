# angular2-knob
ng-knob for Angular and TypeScript with D3v4
Angular 4 directive to Knob component powered by d3.js (without jQuery)


![screenshot](https://raw.githubusercontent.com/xzegga/angular2-knob/master/angular2-knob.png)

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
$ npm install angular2-knob --save
```

#### Usage

###### HTML:
```html
<div ui-knob [value]="value" [options]="options"></div>

```
```Importing Angular Knob Module & Directive 
import { KnobModule } from "angular2-knob";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [KnobModule]
  bootstrap: [AppComponent]
})

```

Options example in a simple component:
```
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  knOptions = {
    readOnly: true,
    subText: {
      enabled: true,
      text: 'Overall',
      color: '#000000',
      fontFamily: 'Roboto',
      font: '14',
      fontWeight: 'bold',
      offset: 7
    },
    unit: '%',
    fontSize: '32',
    fontWeigth: '700',
    fontFamily: 'Roboto',
    textColor: '#000000',
    trackWidth: 19,
    barWidth: 20,
    trackColor: '#D8D8D8',
    barColor: '#FF6F17',
    size: 140,
    valueformat: 'percent',
    value: 0,
    max: 100
  }
  value = 45; 
}
```