(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('d3')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'd3'], factory) :
	(factory((global.KnobModule = {}),global.ng.core,global.d3));
}(this, (function (exports,core,d3) { 'use strict';

var Ng2KnobDirective = (function () {
    function Ng2KnobDirective(el) {
        this.el = el;
        this.valueChange = new core.EventEmitter();
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
            inputFormatter: function (v) { return v; },
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
    Ng2KnobDirective.prototype.ngOnInit = function () {
        this.inDrag = false;
        this.options = Object.assign(this.defaultOptions, this.options);
        this.draw();
    };
    /**
     * Actions when value or options change in host component
     */
    Ng2KnobDirective.prototype.ngOnChanges = function (changes) {
        if (this.defaultOptions != null && changes.options != null && changes.options.currentValue != null && this.value != null) {
            this.options = Object.assign(this.defaultOptions, changes.options.currentValue);
            this.draw();
        }
        if (this.defaultOptions != null && this.options != null && changes.value.currentValue != null && changes.value.previousValue != null && changes.value.currentValue !== changes.value.previousValue) {
            this.setValue(changes.value.currentValue);
        }
    };
    /**
     *   Convert from value to radians
     */
    Ng2KnobDirective.prototype.valueToRadians = function (value, valueEnd, angleEnd, angleStart, valueStart) {
        if (angleEnd === void 0) { angleEnd = 0; }
        if (angleStart === void 0) { angleStart = 0; }
        if (valueStart === void 0) { valueStart = 0; }
        valueEnd = valueEnd || 100;
        valueStart = valueStart || 0;
        angleEnd = angleEnd || 360;
        angleStart = angleStart || 0;
        return (Math.PI / 180) * ((((value - valueStart) * (angleEnd - angleStart)) / (valueEnd - valueStart)) + angleStart);
    };
    /**
     *   Convert from radians to value
     */
    Ng2KnobDirective.prototype.radiansToValue = function (radians, valueEnd, valueStart, angleEnd, angleStart) {
        valueEnd = valueEnd || 100;
        valueStart = valueStart || 0;
        angleEnd = angleEnd || 360;
        angleStart = angleStart || 0;
        return ((((((180 / Math.PI) * radians) - angleStart) * (valueEnd - valueStart)) / (angleEnd - angleStart)) + valueStart);
    };
    /**
     *   Create the arc
     */
    Ng2KnobDirective.prototype.createArc = function (innerRadius, outerRadius, startAngle, endAngle, cornerRadius) {
        var arc$$1 = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(startAngle)
            .endAngle(endAngle)
            .cornerRadius(cornerRadius);
        return arc$$1;
    };
    /**
     *   Draw the arc
     */
    Ng2KnobDirective.prototype.drawArc = function (svg, arc$$1, label, style, click, drag$$1) {
        var elem = svg.append('path')
            .attr('id', label)
            .attr('d', arc$$1);
        for (var key in style) {
            elem.style(key, style[key]);
        }
        elem.attr('transform', 'translate(' + (this.options.size / 2) + ', ' + (this.options.size / 2) + ')');
        if (this.options.readOnly === false) {
            if (click) {
                elem.on('click', click);
            }
            if (drag$$1) {
                elem.call(drag$$1);
            }
        }
        return elem;
    };
    /**
     *   Create the arcs
     */
    Ng2KnobDirective.prototype.createArcs = function () {
        var outerRadius = parseInt((this.options.size / 2).toString(), 10);
        var startAngle = this.valueToRadians(this.options.startAngle, 360);
        var endAngle = this.valueToRadians(this.options.endAngle, 360);
        if (this.options.scale.enabled) {
            outerRadius -= this.options.scale.width + this.options.scale.spaceWidth;
        }
        var trackInnerRadius = outerRadius - this.options.trackWidth;
        var changeInnerRadius = outerRadius - this.options.barWidth;
        var valueInnerRadius = outerRadius - this.options.barWidth;
        // interactInnerRadius = outerRadius - this.options.barWidth,
        var interactInnerRadius = 1;
        var trackOuterRadius = outerRadius;
        var changeOuterRadius = outerRadius;
        var valueOuterRadius = outerRadius;
        var interactOuterRadius = outerRadius;
        var diff;
        if (this.options.barWidth > this.options.trackWidth) {
            diff = (this.options.barWidth - this.options.trackWidth) / 2;
            trackInnerRadius -= diff;
            trackOuterRadius -= diff;
        }
        else if (this.options.barWidth < this.options.trackWidth) {
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
            }
            else {
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
    };
    /**
     *   Draw the arcs
     */
    Ng2KnobDirective.prototype.drawArcs = function (clickInteraction, dragBehavior) {
        var svg = d3.select(this.element)
            .append('svg')
            .attr('width', this.options.size)
            .attr('height', this.options.size);
        if (this.options.bgColor) {
            this.drawArc(svg, this.bgArc, 'bgArc', { 'fill': this.options.bgColor });
        }
        if (this.options.displayInput) {
            var fontSize = (this.options.size * 0.20) + 'px';
            if (this.options.fontSize !== 'auto') {
                fontSize = this.options.fontSize + 'px';
            }
            if (this.options.step < 1) {
                this.value = Number(this.value.toFixed(1));
            }
            var v = this.label || this.value;
            if (typeof this.options.inputFormatter === 'function') {
                v = this.options.inputFormatter(v);
            }
            var fontFamily = '';
            if (this.options.fontFamily !== 'Arial') {
                fontFamily = this.options.fontFamily;
            }
            var fontWeigth = '';
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
                var fontFamily_1 = '';
                if (this.options.subText.fontFamily !== 'Arial') {
                    fontFamily_1 = this.options.subText.fontFamily;
                }
                var fontWeight = '';
                if (this.options.subText.fontWeight !== 'normal') {
                    fontWeight = this.options.subText.fontWeight;
                }
                svg.append('text')
                    .attr('class', 'sub-text')
                    .attr('text-anchor', 'middle')
                    .attr('font-size', fontSize)
                    .attr('font-family', fontFamily_1)
                    .attr('font-weight', fontWeight)
                    .style('fill', this.options.subText.color)
                    .text(this.options.subText.text)
                    .attr('transform', 'translate(' + ((this.options.size / 2)) + ', ' + ((this.options.size / 2) + (this.options.size * 0.15) + this.options.subText.offset) + ')');
            }
        }
        if (this.options.scale.enabled) {
            var radius_1;
            var quantity_1;
            var data = void 0;
            var count_1 = 0;
            var angle_1 = 0;
            var startRadians_1 = this.valueToRadians(this.options.min, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min);
            var endRadians_1 = this.valueToRadians(this.options.max, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min);
            var diff_1 = 0;
            if (this.options.startAngle !== 0 || this.options.endAngle !== 360) {
                diff_1 = 1;
            }
            if (this.options.scale.type === 'dots') {
                var width_1 = this.options.scale.width;
                radius_1 = (this.options.size / 2) - width_1;
                quantity_1 = this.options.scale.quantity;
                var offset_1 = radius_1 + this.options.scale.width;
                data = d3.range(quantity_1).map(function () {
                    angle_1 = (count_1 * (endRadians_1 - startRadians_1)) - (Math.PI / 2) + startRadians_1;
                    count_1 = count_1 + (1 / (quantity_1 - diff_1));
                    return {
                        cx: offset_1 + Math.cos(angle_1) * radius_1,
                        cy: offset_1 + Math.sin(angle_1) * radius_1,
                        r: width_1
                    };
                });
                svg.selectAll('circle')
                    .data(data)
                    .enter().append('circle')
                    .attr({
                    r: function (d) {
                        return d.r;
                    },
                    cx: function (d) {
                        return d.cx;
                    },
                    cy: function (d) {
                        return d.cy;
                    },
                    fill: this.options.scale.color
                });
            }
            else if (this.options.scale.type === 'lines') {
                var height_1 = this.options.scale.height;
                radius_1 = (this.options.size / 2);
                quantity_1 = this.options.scale.quantity;
                data = d3.range(quantity_1).map(function () {
                    angle_1 = (count_1 * (endRadians_1 - startRadians_1)) - (Math.PI / 2) + startRadians_1;
                    count_1 = count_1 + (1 / (quantity_1 - diff_1));
                    return {
                        x1: radius_1 + Math.cos(angle_1) * radius_1,
                        y1: radius_1 + Math.sin(angle_1) * radius_1,
                        x2: radius_1 + Math.cos(angle_1) * (radius_1 - height_1),
                        y2: radius_1 + Math.sin(angle_1) * (radius_1 - height_1)
                    };
                });
                svg.selectAll('line')
                    .data(data)
                    .enter().append('line')
                    .attr({
                    x1: function (d) {
                        return d.x1;
                    },
                    y1: function (d) {
                        return d.y1;
                    },
                    x2: function (d) {
                        return d.x2;
                    },
                    y2: function (d) {
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
        }
        else {
            this.changeElem = this.drawArc(svg, this.changeArc, 'changeArc', { 'fill-opacity': 0 });
        }
        this.valueElem = this.drawArc(svg, this.valueArc, 'valueArc', { 'fill': this.options.barColor });
        var cursor = 'pointer';
        if (this.options.readOnly) {
            cursor = 'default';
        }
        this.drawArc(svg, this.interactArc, 'interactArc', { 'fill-opacity': 0, 'cursor': cursor }, clickInteraction, dragBehavior);
    };
    /**
     *   Draw knob component
     */
    Ng2KnobDirective.prototype.draw = function () {
        d3.select(this.element).select('svg').remove();
        var that = this;
        that.createArcs();
        var dragBehavior = d3.drag()
            .on('drag', dragInteraction)
            .on('end', clickInteraction);
        that.drawArcs(clickInteraction, dragBehavior);
        if (that.options.animate.enabled) {
            // that.valueElem.transition().ease(that.options.animate.ease).duration(that.options.animate.duration).tween('', function () {
            that.valueElem.transition().ease(that.animations[that.options.animate.ease]).duration(that.options.animate.duration).tween('', function () {
                var i = d3.interpolate(that.valueToRadians(that.options.startAngle, 360), that.valueToRadians(that.value, that.options.max, that.options.endAngle, that.options.startAngle, that.options.min));
                return function (t) {
                    var val = i(t);
                    that.valueElem.attr('d', that.valueArc.endAngle(val));
                    that.changeElem.attr('d', that.changeArc.endAngle(val));
                };
            });
        }
        else {
            that.changeArc.endAngle(this.valueToRadians(this.value, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min));
            that.changeElem.attr('d', that.changeArc);
            that.valueArc.endAngle(this.valueToRadians(this.value, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min));
            that.valueElem.attr('d', that.valueArc);
        }
        function dragInteraction() {
            that.inDrag = true;
            var x = d3.event.x - (that.options.size / 2);
            var y = d3.event.y - (that.options.size / 2);
            interaction(x, y, false);
        }
        function clickInteraction() {
            that.inDrag = false;
            var coords = d3.mouse(this.parentNode);
            var x = coords[0] - (that.options.size / 2);
            var y = coords[1] - (that.options.size / 2);
            interaction(x, y, true);
        }
        function interaction(x, y, isFinal) {
            var arc$$1 = Math.atan(y / x) / (Math.PI / 180);
            var delta;
            if ((x >= 0 && y <= 0) || (x >= 0 && y >= 0)) {
                delta = 90;
            }
            else {
                delta = 270;
                if (that.options.startAngle < 0) {
                    delta = -90;
                }
            }
            var radians = (delta + arc$$1) * (Math.PI / 180);
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
                    var v = that.label || this.value;
                    if (typeof that.options.inputFormatter === 'function') {
                        v = that.options.inputFormatter(v);
                    }
                    d3.select(that.element).select('#text').text(v + that.options.unit || '');
                }
            }
            that.valueChange.emit(that.value);
        }
    };
    /**
     *   Set a value
     */
    Ng2KnobDirective.prototype.setValue = function (newValue) {
        if ((!this.inDrag) && this.value >= this.options.min && this.value <= this.options.max) {
            var radians = this.valueToRadians(newValue, this.options.max, this.options.endAngle, this.options.startAngle, this.options.min);
            this.value = Math.round(((~~(((newValue < 0) ? -0.5 : 0.5) + (newValue / this.options.step))) * this.options.step) * 100) / 100;
            if (this.options.step < 1) {
                this.value = Number(this.value.toFixed(1));
            }
            this.changeArc.endAngle(radians);
            d3.select(this.element).select('#changeArc').attr('d', this.changeArc);
            this.valueArc.endAngle(radians);
            d3.select(this.element).select('#valueArc').attr('d', this.valueArc);
            if (this.options.displayInput) {
                var v = this.label || this.value;
                if (typeof this.options.inputFormatter === 'function') {
                    v = this.options.inputFormatter(v);
                }
                d3.select(this.element).select('#text').text(v + this.options.unit || '');
            }
        }
    };
    Ng2KnobDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[ui-knob]'
                },] },
    ];
    /** @nocollapse */
    Ng2KnobDirective.ctorParameters = function () { return [
        { type: core.ElementRef, },
    ]; };
    Ng2KnobDirective.propDecorators = {
        'value': [{ type: core.Input },],
        'label': [{ type: core.Input },],
        'options': [{ type: core.Input },],
        'valueChange': [{ type: core.Output },],
    };
    return Ng2KnobDirective;
}());

var KnobModule = (function () {
    function KnobModule() {
    }
    KnobModule.decorators = [
        { type: core.NgModule, args: [{
                    exports: [Ng2KnobDirective],
                    declarations: [Ng2KnobDirective]
                },] },
    ];
    /** @nocollapse */
    KnobModule.ctorParameters = function () { return []; };
    return KnobModule;
}());

exports.KnobModule = KnobModule;
exports.Ng2KnobDirective = Ng2KnobDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));
