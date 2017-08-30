# ng2-knob
ng-knob for Angular and TypeScript with D3v4
Angular 2 directive to Knob component powered by d3.js (without jQuery)

|------------------|--------------|-------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| skin             | object       | { type: 'simple', width: 10, color: 'rgba(255,0,0,.5)', spaceWidth: 5 }                               | Type: `simple` or `tron`                                                                     |
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
| subText          | object       | { enabled: false, text: '', color: 'gray', font: 'auto' }                                             | Subtext options                                                                              |
| bgColor          | string       | ''                                                                                                    | Background color                                                                             |
| bgFull           | string       | false                                                                                                 | Paints the background of the whole circle ignoring startAngle and endAngle                   |
| scale            | object       | { enabled: false, type: 'lines', color: 'gray', width: 4, quantity: 20, height: 10, spaceWidth: 15 }  | Scale options, type: `lines` or `dots`                                                       |
| step             | integer      | 1                                                                                                     | Step change, min `0.1`                                                                       |
| displayPrevious  | boolean      | false                                                                                                 | Display previous value (`true` or `false`)                                                   |
| min              | integer      | 0                                                                                                     | Min value (start value), only integer                                                        |
| max              | integer      | 100                                                                                                   | Max value (end value), only integer                                                          |
| dynamicOptions   | boolean      | false                                                                                                 | Dynamic change options (`true` or `false`)                                                   |

Contributing
-------

1. Fork the repo
2. Install dependencies: `npm install` and `bower install`
3. Run: `grunt`
4. Make your changes
5. Submit pull request

License
-------

Licensed under the MIT license
