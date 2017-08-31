import { ElementRef, OnInit, EventEmitter } from '@angular/core';
export declare class Ng2KnobDirective implements OnInit {
    private el;
    element: HTMLElement;
    value: number;
    label: number;
    options: any;
    valueChange: EventEmitter<number>;
    inDrag: Boolean;
    bgArc: any;
    trackArc: any;
    changeArc: any;
    valueArc: any;
    interactArc: any;
    hoopArc: any;
    changeElem: any;
    valueElem: any;
    defaultOptions: {};
    animations: any;
    constructor(el: ElementRef);
    /**
     * Implement this interface to execute custom initialization logic after your directive's data-bound properties have been initialized.
     * ngOnInit is called right after the directive's data-bound properties have been checked for the first time, and before any of its children have been checked.
     * It is invoked only once when the directive is instantiated.
     */
    ngOnInit(): void;
    /**
     * Actions when value or options change in host component
     */
    ngOnChanges(changes: any): void;
    /**
     *   Convert from value to radians
     */
    valueToRadians(value: number, valueEnd: number, angleEnd?: number, angleStart?: number, valueStart?: number): number;
    /**
     *   Convert from radians to value
     */
    radiansToValue(radians: any, valueEnd: any, valueStart: any, angleEnd: any, angleStart: any): any;
    /**
     *   Create the arc
     */
    createArc(innerRadius: any, outerRadius: any, startAngle?: any, endAngle?: any, cornerRadius?: any): any;
    /**
     *   Draw the arc
     */
    drawArc(svg: any, arc: any, label: any, style: any, click?: any, drag?: any): any;
    /**
     *   Create the arcs
     */
    createArcs(): void;
    /**
     *   Draw the arcs
     */
    drawArcs(clickInteraction: any, dragBehavior: any): void;
    /**
     *   Draw knob component
     */
    draw(): void;
    /**
     *   Set a value
     */
    setValue(newValue: any): void;
}
