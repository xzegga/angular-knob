import { Component } from '@angular/core';
import { KnobOptions } from '@xmlking/ngx-knob';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngx-knob';

  knOptions = {
    readOnly: true,
    size: 140,
    unit: '%',
    textColor: '#000000',
    fontSize: '32',
    fontWeigth: '700',
    fontFamily: 'Roboto',
    valueFormat: 'percent',
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
  };
  value = 45;
}
