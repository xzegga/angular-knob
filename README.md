# angular-knob
Angular directive for Knob component using d3.js v4 without jQuery dependencies


![screenshot](https://raw.githubusercontent.com/xzegga/angular2-knob/master/assets/angular2-knob.png)

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

- Angular 2+
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

###### IMPORTING ANGULAR MODULE:
```Angular
import { KnobModule } from "angular2-knob";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [KnobModule]
  bootstrap: [AppComponent]
})

```
###### HTML USE:
```html
<div ui-knob [value]="value" [options]="knOptions"></div>

```

###### CONFIGURING OPTIONS IN ANGULAR COMPONENT:
```Angular
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  knOptions = {
    readOnly: true,
    size: 140,
    unit: '%',
    textColor: '#000000',
    fontSize: '32',
    fontWeigth: '700',
    fontFamily: 'Roboto',
    valueformat: 'percent',
    value: 0,
    max: 100,
    trackWidth: 19,
    barWidth: 20,
    trackColor: '#D8D8D8',
    barColor: '#FF6F17',
    subText: {
      enabled: true,
      fontFamily: 'Verdana',
      font: '14',
      fontWeight: 'bold',
      text: 'Overall',
      color: '#000000',
      offset: 7
    },
  }
  value = 45; 
}
```

Options
-------

###### You can pass these options to the initialize function to set a custom look and feel for the plugin.

| Property         | Type         | Default                                                                                               | Description                                                                                  |
|------------------|--------------|-------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| animate          | object       | { enabled: true, duration: 1000, ease: 'bounce' }                                                     | Duration in milliseconds, Ease: `linear`, `bounce`, `sin`, `cubic`, `quad`, `exp`, `circle`  |
| size             | integer      | 200                                                                                                   | Size of knob in px. It will always be a square                                               |
| startAngle	     | integer      | 0                                                                                                     | Start angle in degrees                                                                       |
| endAngle         | integer      | 360                                                                                                   | End angle in degrees                                                                         |
| unit             | string       | ''                                                                                                    | Unit values                                                                                  |
| displayInput     | boolean      | true                                                                                                  | Display input value (`true` or `false`)                                                      |
| inputFormatter     | function      | function(value){ return value; }                                                                   | Formats the input value **before appending the `unit`** and displaying it to the DOM                                                      |
| readOnly         | boolean      | false                                                                                                 | Disabled change value (`true` or `false`)                                                    |
| trackWidth       | integer      | 50                                                                                                    | Width track bar in px                                                                        |
| barWidth         | integer      | 50                                                                                                    | Width bar value in px                                                                        |
| trackColor       | string       | 'rgba(0,0,0,0)'                                                                                       | Color track bar                                                                              |
| barColor         | string       | 'rgba(255,0,0,.5)'                                                                                    | Color bar value                                                                              |
| prevBarColor     | string       | 'rgba(0,0,0,0)'                                                                                       | Color bar previous value                                                                     |
| textColor        | string       | '#222'                                                                                                | Text color                                                                                   |
| barCap           | integer      | 0                                                                                                     | Defines how the ending of the bar line looks like in radius                                  |
| trackCap         | integer      | 0                                                                                                     | Defines how the ending of the track line looks like in radius                                |
| fontSize         | string       | 'auto'                                                                                                | Font size in px. `auto`: automatic change                                                    |
| subText          | object       | { enabled: false, text: '', fontFamily: 'Arial', fontWeight: 'normal', color: 'gray', font: 'auto', offset: 0 }                                             | Subtext options                                                                              |
| bgColor          | string       | ''                                                                                                    | Background color                                                                             |
| bgFull           | string       | false                                                                                                 | Paints the background of the whole circle ignoring startAngle and endAngle                   |
| scale            | object       | { enabled: false, type: 'lines', color: 'gray', width: 4, quantity: 20, height: 10, spaceWidth: 15 }  | Scale options, type: `lines` or `dots`                                                       |
| step             | integer      | 1                                                                                                     | Step change, min `0.1`                                                                       |
| displayPrevious  | boolean      | false                                                                                                 | Display previous value (`true` or `false`)                                                   |
| min              | integer      | 0                                                                                                     | Min value (start value), only integer                                                        |
| max              | integer      | 100                                                                                                   | Max value (end value), only integer                                                          |
| dynamicOptions   | boolean      | false                                                                                                 | Dynamic change options (`true` or `false`)                                                   |
