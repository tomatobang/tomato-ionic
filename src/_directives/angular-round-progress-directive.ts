/**
 * add by yipeng at 2017
 */

import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';

declare var Notification: any;

@Directive({
    selector: 'angular-round-progress'
})
export class AngularRoundProgressComponent {
    canvas: HTMLCanvasElement;

    width: any = "320";
    height: any = "320";
    outerCircleWidth: string = "25";
    innerCircleWidth: string = "5";
    outerCircleRadius: string = "145";
    innerCircleRadius: string = "100";

    labelFont: string = "50pt Arial";
    outerCircleBackgroundColor: string = "#505769";
    outerCircleForegroundColor: string = "#12eeb9";
    innerCircleColor: string = "#12eeb9";

    labelColor: string = "#12eeb9";

    timerStatusValue:any;

    /**
     * 只能发现
     */
    @Input()
    get timerStatus():any {
        return this.timerStatusValue;
    }
    set timerStatus(val) {
        this.timerStatusValue = val;
        this.render();
    }


    @Output() scroll = new EventEmitter();

    constructor(private element: ElementRef) {
        var ele = this.element.nativeElement;
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);
        ele.parentNode.replaceChild(this.canvas, ele);
    }

    render() {
        // Create the content of the canvas
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.width, this.height);

        // The "background" circle
        var x = this.width / 2;
        var y = this.height / 2;
        ctx.beginPath();
        ctx.arc(x, y, parseInt(this.outerCircleRadius), 0, Math.PI * 2, false);
        ctx.lineWidth = parseInt(this.outerCircleWidth);
        ctx.strokeStyle = this.outerCircleBackgroundColor;
        ctx.stroke();

        // The inner circle
        ctx.beginPath();
        ctx.arc(x, y, parseInt(this.innerCircleRadius), 0, Math.PI * 2, false);
        ctx.lineWidth = parseInt(this.innerCircleWidth);
        ctx.strokeStyle = this.innerCircleColor;
        ctx.stroke();

        // The inner number
        ctx.font = this.labelFont;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.labelColor;
        ctx.fillText(this.timerStatusValue.label, x, y);

        // The "foreground" circle
        var startAngle = - (Math.PI / 2);

        var endAngle = ((Math.PI * 2) * this.timerStatusValue.percentage) - (Math.PI / 2);
        var anticlockwise = false;
        ctx.beginPath();
        ctx.arc(x, y, parseInt(this.outerCircleRadius), startAngle, endAngle, anticlockwise);
        ctx.lineWidth = parseInt(this.outerCircleWidth);
        ctx.strokeStyle = this.outerCircleForegroundColor;
        ctx.stroke();
    }
}