import {Directive, ElementRef, OnInit, Input, Output, EventEmitter} from '@angular/core';
import * as d3 from 'd3';
import 'd3-selection-multi';

export interface Options {
  skin?: {
    type: string;
    width: number;
    color: string;
    spaceWidth: number;
  },
  animate?: {
    enabled: true,
    duration: number;
    ease: string;
  },
  size: number;
  startAngle: number;
  endAngle: number;
  unit: string;
  displayInput: true,
  inputFormatter: any;
  readOnly: boolean;
  trackWidth: number;
  barWidth: number;
  trackColor: string;
  barColor: string;
  prevBarColor: string;
  textColor: string;
  barCap: number;
  trackCap: number;
  fontSize: string;
  fontWeigth: string;
  fontFamily: string;
  subText: {
    enabled: false,
    text: '',
    fontFamily: string;
    fontWeight: string;
    color: string;
    font: string;
    offset: number;
  },
  bgColor: string;
  bgFull: false,
  scale: {
    enabled: false,
    type: string;
    color: string;
    width: number;
    quantity: number;
    height: number;
    spaceWidth: number;
  },
  step: number;
  displayPrevious: false,
  min: number;
  max: number;
  dynamicOptions: false
};

@Directive({
  selector: '[ui-knob]'
})
export class Ng2KnobDirective implements OnInit {
  element: HTMLElement;
  @Input() value: number;
  @Input() label: number;
  @Input() options: any;
  @Output() valueChange = new EventEmitter<number>();

  inDrag: Boolean;
  bgArc: any;
  trackArc: any;
  changeArc: any;
  valueArc: any;
  interactArc: any;
  hoopArc: any;
  changeElem: any;
  valueElem: any;
  defaultOptions: Options;
  animations: any;

  constructor(private el: ElementRef) {

    // All that need to be instanciated before bindings
    this.element = this.el.nativeElement;
    this.value = 0;
    this.defaultOptions = {
      skin: {
        type: 'simple',
        width: 10,
        color: 'rgba(255,0,0,.5)',
        spaceWidth: 5
      },
      animate: {
        enabled: true,
        duration: 1000,
        ease: 'bounce'
      },
      size: 200,
      startAngle: 0,
      endAngle: 360,
      unit: '',
      displayInput: true,
      inputFormatter: function (v: any) { return v; },
      readOnly: false,
      trackWidth: 50,
      barWidth: 50,
      trackColor: 'rgba(0,0,0,0)',
      barColor: 'rgba(255,0,0,.5)',
      prevBarColor: 'rgba(0,0,0,0)',
      textColor: '#222',
      barCap: 0,
      trackCap: 0,
      fontSize: 'auto',
      fontWeigth: '400',
      fontFamily: 'Arial',
      subText: {
        enabled: false,
        text: '',
        fontFamily: 'Arial',
        fontWeight: 'normal',
        color: 'gray',
        font: 'auto',
        offset: 0
      },
      bgColor: '',
      bgFull: false,
      scale: {
        enabled: false,
        type: 'lines',
        color: 'gray',
        width: 4,
        quantity: 20,
        height: 10,
        spaceWidth: 15
      },
      step: 1,
      displayPrevious: false,
      min: 0,
      max: 100,
      dynamicOptions: false
    };

    this.animations = {
      linear: d3.easeLinear,
      bounce: d3.easeBounce
    };
  }

  /**
   * Implement this interface to execute custom initialization logic after your directive's data-bound properties have been initialized.
   * ngOnInit is called right after the directive's data-bound properties have been checked for the first time, and before any of its children have been checked.
   * It is invoked only once when the directive is instantiated.
   */
  ngOnInit() {
    this.inDrag = false;
    this.options = (<any>Object).assign(this.defaultOptions, this.options);
    this.draw();
  }

  /**
   * Actions when value or options change in host component
   */
  ngOnChanges(changes:any) {

    if (this.defaultOptions != null && changes.options != null && changes.options.currentValue != null && this.value != null) {
      this.options = (<any>Object).assign(this.defaultOptions, changes.options.currentValue);
      this.draw();
    }

    if (this.defaultOptions != null && this.options != null && changes.value && changes.value.currentValue != null && changes.value.previousValue != null && changes.value.currentValue !== changes.value.previousValue) {
      this.setValue(changes.value.currentValue);
    }
  }

  /**
   *   Convert from value to radians
   */
  valueToRadians(value: number, valueEnd: number, angleEnd: number = 0, angleStart: number = 0, valueStart: number = 0) {
    valueEnd = valueEnd || 100;
    valueStart = valueStart || 0;
    angleEnd = angleEnd || 360;
    angleStart = angleStart || 0;
    return (Math.PI / 180) * ((((value - valueStart) * (angleEnd - angleStart)) / (valueEnd - valueStart)) + angleStart);
  }
  /**
   *   Convert from radians to value
   */
  radiansToValue(radians: number, valueEnd: number, valueStart: number, angleEnd: number, angleStart: number) {
    valueEnd = valueEnd || 100;
    valueStart = valueStart || 0;
    angleEnd = angleEnd || 360;
    angleStart = angleStart || 0;
    return ((((((180 / Math.PI) * radians) - angleStart) * (valueEnd - valueStart)) / (angleEnd - angleStart)) + valueStart);
  }
  /**
   *   Create the arc
   */
  createArc(innerRadius: number, outerRadius: number, startAngle?: number, endAngle?: number, cornerRadius?: number): any {
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle)
      .cornerRadius(cornerRadius);
    return arc;
  }
  /**
   *   Draw the arc
   */
  drawArc(svg: any, arc: any, label: string, style: any, click?: any, drag?: any) {
    const elem = svg.append('path')
      .attr('id', label)
      .attr('d', arc);

    for (const key in style) {
      elem.style(key, style[key]);
    }

    elem.attr('transform', 'translate(' + (this.options.size / 2) + ', ' + (this.options.size / 2) + ')');

    if (this.options.readOnly === false) {
      if (click) {
        elem.on('click', click);
      }
      if (drag) {
        elem.call(drag);
      }
    }
    return elem;
  }
  /**
   *   Create the arcs
   */
  createArcs() {
    let outerRadius = parseInt((this.options.size / 2).toString(), 10);
    const startAngle = this.valueToRadians(this.options.startAngle, 360);
    const endAngle = this.valueToRadians(this.options.endAngle, 360);
    if (this.options.scale.enabled) {
      outerRadius -= this.options.scale.width + this.options.scale.spaceWidth;
    }
    let trackInnerRadius = outerRadius - this.options.trackWidth;
    let changeInnerRadius = outerRadius - this.options.barWidth;
    let valueInnerRadius = outerRadius - this.options.barWidth;
      // interactInnerRadius = outerRadius - this.options.barWidth,
    const interactInnerRadius = 1;

    let trackOuterRadius = outerRadius;
    let changeOuterRadius = outerRadius;
    let valueOuterRadius = outerRadius;
    let interactOuterRadius = outerRadius;
    let diff;

    if (this.options.barWidth > this.options.trackWidth) {
      diff = (this.options.barWidth - this.options.trackWidth) / 2;
      trackInnerRadius -= diff;
      trackOuterRadius -= diff;
    } else if (this.options.barWidth < this.options.trackWidth) {
      diff = (this.options.trackWidth - this.options.barWidth) / 2;
      changeOuterRadius -= diff;
      valueOuterRadius -= diff;
      changeInnerRadius -= diff;
      valueInnerRadius -= diff;
      // interactInnerRadius = outerRadius - this.options.trackWidth;
    }
    if (this.options.bgColor) {
      if (this.options.bgFull) {
        this.bgArc = this.createArc(0, outerRadius, 0, Math.PI * 2);
      } else {
        this.bgArc = this.createArc(0, outerRadius, startAngle, endAngle);
      }
    }
    if (this.options.skin.type === 'tron') {
      trackOuterRadius = trackOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      changeOuterRadius = changeOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      valueOuterRadius = valueOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      interactOuterRadius = interactOuterRadius - this.options.skin.width - this.options.skin.spaceWidth;
      this.hoopArc = this.createArc(outerRadius - this.options.skin.width, outerRadius, startAngle, endAngle);
    }

    this.trackArc = this.createArc(trackInnerRadius, trackOuterRadius, startAngle, endAngle, this.options.trackCap);
    this.changeArc = this.createArc(changeInnerRadius, changeOuterRadius, startAngle, startAngle, this.options.barCap);
    this.valueArc = this.createArc(valueInnerRadius, valueOuterRadius, startAngle, startAngle, this.options.barCap);
    this.interactArc = this.createArc(interactInnerRadius, interactOuterRadius, startAngle, endAngle);
  }
  /**
   *   Draw the arcs
   */
  drawArcs(clickInteraction: any, dragBehavior: any) {
    const svg = d3.select(this.element)
      .append('svg')
      .attr('width', this.options.size)
      .attr('height', this.options.size);

    if (this.options.bgColor) {
      this.drawArc(svg, this.bgArc, 'bgArc', { 'fill': this.options.bgColor });
    }

    if (this.options.displayInput) {
      let fontSize: string = (this.options.size * 0.20) + 'px';
      if (this.options.fontSize !== 'auto') {
        fontSize = this.options.fontSize + 'px';
      }
      if (this.options.step < 1) {
        this.value = Number(this.value.toFixed(1));
      }
      let v = this.label || this.value;
      if (typeof this.options.inputFormatter === 'function') {
        v = this.options.inputFormatter(v);
      }
      let fontFamily: string = '';
      if (this.options.fontFamily !== 'Arial') {
        fontFamily = this.options.fontFamily;
      }
       let fontWeigth: string = '';
      if (this.options.fontWeigth !== '400') {
        fontWeigth = this.options.fontWeigth;
      }
      svg.append('text')
        .attr('id', 'text')
        .attr('class', 'text-value')
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('font-weight', fontWeigth)
        .attr('font-family', fontFamily)
        .style('fill', this.options.textColor)
        .text(v + this.options.unit || '')
        .attr('transform', 'translate(' + ((this.options.size / 2)) + ', ' + ((this.options.size / 2) + (this.options.size * 0.06)) + ')');

      if (this.options.subText.enabled) {
        fontSize = (this.options.size * 0.07) + 'px';
        if (this.options.subText.font !== 'auto') {
          fontSize = this.options.subText.font + 'px';
        }
        let fontFamily = '';
        if (this.options.subText.fontFamily !== 'Arial') {
          fontFamily = this.options.subText.fontFamily;
        }
        let fontWeight = '';
        if (this.options.subText.fontWeight !== 'normal') {
          fontWeight = this.options.subText.fontWeight;
        }
        svg.append('text')
          .attr('class', 'sub-text')
          .attr('text-anchor', 'middle')
          .attr('font-size', fontSize)
          .attr('font-family', fontFamily)
          .attr('font-weight', fontWeight)
          .style('fill', this.options.subText.color)
          .text(this.options.subText.text)
          .attr('transform', 'translate(' + ((this.options.size / 2)) + ', ' + ((this.options.size / 2) + (this.options.size * 0.15) + this.options.subText.offset) + ')');
      }
    }
    if (this.options.scale.enabled) {
      let radius: number;
      let quantity: number;
      let data;
      let count: number = 0;
      let angle: number = 0;
      const startRadians = this.valueToRadians(this.options.min, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min);
      const endRadians = this.valueToRadians(this.options.max, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min);
      let diff = 0;
      if (this.options.startAngle !== 0 || this.options.endAngle !== 360) {
        diff = 1;
      }
      if (this.options.scale.type === 'dots') {
        const width = this.options.scale.width;
        radius = (this.options.size / 2) - width;
        quantity = this.options.scale.quantity;
        const offset: number = radius + this.options.scale.width;
        data = d3.range(quantity).map(function () {
          angle = (count * (endRadians - startRadians)) - (Math.PI / 2) + startRadians;
          count = count + (1 / (quantity - diff));
          return {
            cx: offset + Math.cos(angle) * radius,
            cy: offset + Math.sin(angle) * radius,
            r: width
          };
        });
        svg.selectAll('circle')
          .data(data)
          .enter().append('circle')
          .attrs({
            r: function (d: { r:any }) {
              return d.r;
            },
            cx: function (d: { cx:number }) {
              return d.cx;
            },
            cy: function (d: { cy:number }) {
              return d.cy;
            },
            fill: this.options.scale.color
          });
      } else if (this.options.scale.type === 'lines') {
        const height = this.options.scale.height;
        radius = (this.options.size / 2);
        quantity = this.options.scale.quantity;
        data = d3.range(quantity).map(function () {
          angle = (count * (endRadians - startRadians)) - (Math.PI / 2) + startRadians;
          count = count + (1 / (quantity - diff));
          return {
            x1: radius + Math.cos(angle) * radius,
            y1: radius + Math.sin(angle) * radius,
            x2: radius + Math.cos(angle) * (radius - height),
            y2: radius + Math.sin(angle) * (radius - height)
          };
        });
        svg.selectAll('line')
          .data(data)
          .enter().append('line')
          .attrs({
            x1: function (d: { x1:number }) {
              return d.x1;
            },
            y1: function (d: { y1:number }) {
              return d.y1;
            },
            x2: function (d: { x2:number }) {
              return d.x2;
            },
            y2: function (d: { y2:number }) {
              return d.y2;
            },
            'stroke-width': this.options.scale.width,
            'stroke': this.options.scale.color
          });
      }
    }
    if (this.options.skin.type === 'tron') {
      this.drawArc(svg, this.hoopArc, 'hoopArc', { 'fill': this.options.skin.color });
    }
    this.drawArc(svg, this.trackArc, 'trackArc', { 'fill': this.options.trackColor });
    if (this.options.displayPrevious) {
      this.changeElem = this.drawArc(svg, this.changeArc, 'changeArc', { 'fill': this.options.prevBarColor });
    } else {
      this.changeElem = this.drawArc(svg, this.changeArc, 'changeArc', { 'fill-opacity': 0 });
    }
    this.valueElem = this.drawArc(svg, this.valueArc, 'valueArc', { 'fill': this.options.barColor });
    let cursor = 'pointer';
    if (this.options.readOnly) {
      cursor = 'default';
    }
    this.drawArc(svg, this.interactArc, 'interactArc', { 'fill-opacity': 0, 'cursor': cursor }, clickInteraction, dragBehavior);
  }
  /**
   *   Draw knob component
   */
  draw() {
    d3.select(this.element).select('svg').remove();
    const that = this;

    that.createArcs();

    const dragBehavior = d3.drag()
      .on('drag', dragInteraction)
      .on('end', clickInteraction);

    that.drawArcs(clickInteraction, dragBehavior);

    if (that.options.animate.enabled) {
      // that.valueElem.transition().ease(that.options.animate.ease).duration(that.options.animate.duration).tween('', function () {
      that.valueElem.transition().ease(that.animations[that.options.animate.ease]).duration(that.options.animate.duration).tween('', function () {
        const i = d3.interpolate(that.valueToRadians(that.options.startAngle, 360), that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
        return function (t: any) {
          const val = i(t);
          that.valueElem.attr('d', that.valueArc.endAngle(val));
          that.changeElem.attr('d', that.changeArc.endAngle(val));
        };
      });
    } else {
      that.changeArc.endAngle(this.valueToRadians(this.value, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min));
      that.changeElem.attr('d', that.changeArc);
      that.valueArc.endAngle(this.valueToRadians(this.value, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min));
      that.valueElem.attr('d', that.valueArc);
    }

    function dragInteraction() {
      that.inDrag = true;
      const x = d3.event.x - (that.options.size / 2);
      const y = d3.event.y - (that.options.size / 2);
      interaction(x, y, false);
    }

    function clickInteraction() {
      that.inDrag = false;
      const coords = d3.mouse(this.parentNode);
      const x = coords[0] - (that.options.size / 2);
      const y = coords[1] - (that.options.size / 2);
      interaction(x, y, true);
    }

    function interaction(x: any, y: any, isFinal: any) {
      const arc = Math.atan(y / x) / (Math.PI / 180);
      let delta;

      if ((x >= 0 && y <= 0) || (x >= 0 && y >= 0)) {
        delta = 90;
      } else {
        delta = 270;
        if (that.options.startAngle < 0) {
          delta = -90;
        }
      }

      const radians = (delta + arc) * (Math.PI / 180);
      that.value = that.radiansToValue(radians, that.options.max, that.options.min, that.options.endAngle, that.options.startAngle);
      if (that.value >= that.options.min && that.value <= that.options.max) {
        that.value = Math.round(((~~(((that.value < 0) ? -0.5 : 0.5) + (that.value / that.options.step))) * that.options.step) * 100) / 100;
        if (that.options.step < 1) {
          that.value = Number(that.value.toFixed(1));
        }
        that.valueArc.endAngle(that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
        that.valueElem.attr('d', that.valueArc);
        if (isFinal) {
          that.changeArc.endAngle(that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
          that.changeElem.attr('d', that.changeArc);
        }
        if (that.options.displayInput) {
          let v = that.label || that.value;
          if (typeof that.options.inputFormatter === 'function') {
            v = that.options.inputFormatter(v);
          }
          d3.select(that.element).select('#text').text(v + that.options.unit || '');
        }
      }
      that.valueChange.emit(that.value);
    }
  }
  /**
   *   Set a value
   */
  setValue(newValue: any) {
    if ((!this.inDrag) && this.value >= this.options.min && this.value <= this.options.max) {
      const radians = this.valueToRadians(newValue, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min);
      this.value = Math.round(((~~(((newValue < 0) ? -0.5 : 0.5) + (newValue / this.options.step))) * this.options.step) * 100) / 100;
      if (this.options.step < 1) {
        this.value = Number(this.value.toFixed(1));
      }
      this.changeArc.endAngle(radians);
      d3.select(this.element).select('#changeArc').attr('d', this.changeArc);
      this.valueArc.endAngle(radians);
      d3.select(this.element).select('#valueArc').attr('d', this.valueArc);
      if (this.options.displayInput) {
        let v = this.label || this.value;
        if (typeof this.options.inputFormatter === 'function') {
          v = this.options.inputFormatter(v);
        }
        d3.select(this.element).select('#text').text(v + this.options.unit || '');
      }
    }
  }

}
