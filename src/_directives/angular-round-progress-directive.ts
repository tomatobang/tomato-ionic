/**
 * add by yipeng at 2017
 */

import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';

declare var Notification: any;
declare var window: any;
let hasFixRatio = false;
@Directive({
    selector: 'angular-round-progress'
})
export class AngularRoundProgressComponent {
    canvas: HTMLCanvasElement;

    width: any = 270;
    height: any = 270;
    outerCircleWidth: number = 25;
    innerCircleWidth: number = 5;
    outerCircleRadius: number = 115;
    innerCircleRadius: number = 80;

    labelFont: string = "40pt Arial";
    outerCircleBackgroundColor: string = "#505769";
    outerCircleForegroundColor: string = "#12eeb9";
    innerCircleColor: string = "#387ef5";

    labelColor: string = "#387ef5";

    timerStatusValue: any;

    /**
     * 只能发现
     */
    @Input()
    get timerStatus(): any {
        return this.timerStatusValue;
    }
    set timerStatus(val) {
        this.timerStatusValue = val;
        this.render();
    }


    @Output() scroll = new EventEmitter();

    constructor(private element: ElementRef) {
        let ele = this.element.nativeElement;
        this.canvas = document.createElement('canvas');
        // 下述方法无效
        // this.canvas.style.width = this.width;
        // this.canvas.style.height = this.height;
        ele.parentNode.replaceChild(this.canvas, ele);
        let ctx = this.canvas.getContext('2d');
        this.fixPixelRatio(ctx);
        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);
        this.canvas.setAttribute('class', "tomato-canvas-style");
    }

    fixPixelRatio(context) {
        if (!hasFixRatio) {
            let backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            let ratio = (window.devicePixelRatio || 1) / backingStore;
            this.width *= ratio;
            this.height *= ratio;
            this.outerCircleWidth *= ratio;
            this.innerCircleWidth *= ratio;
            this.outerCircleRadius *= ratio;
            this.innerCircleRadius *= ratio;

            if (ratio >=2){
                this.labelFont = "80pt Arial";
            }
            if (ratio >=3){
                this.labelFont = "120pt Arial";
            }

            hasFixRatio = true;
        }
    };

    render() {
        // Create the content of the canvas
        let ctx = this.canvas.getContext('2d');
        
        ctx.clearRect(0, 0, this.width, this.height);

        // The "background" circle
        let x = this.width / 2;
        let y = this.height / 2;
        ctx.beginPath();
        ctx.arc(x, y, this.outerCircleRadius, 0, Math.PI * 2, false);
        ctx.lineWidth = this.outerCircleWidth;
        ctx.strokeStyle = this.outerCircleBackgroundColor;
        ctx.stroke();

        // The inner circle
        ctx.beginPath();
        ctx.arc(x, y, this.innerCircleRadius, 0, Math.PI * 2, false);
        ctx.lineWidth = this.innerCircleWidth;
        ctx.strokeStyle = this.innerCircleColor;
        ctx.stroke();

        // The inner number
        ctx.font = this.labelFont;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.labelColor;
        ctx.fillText(this.timerStatusValue.label, x, y);

        // The "foreground" circle
        let startAngle = - (Math.PI / 2);

        let endAngle = ((Math.PI * 2) * this.timerStatusValue.percentage) - (Math.PI / 2);
        let anticlockwise = false;
        ctx.beginPath();
        ctx.arc(x, y, this.outerCircleRadius, startAngle, endAngle, anticlockwise);
        ctx.lineWidth = this.outerCircleWidth;
        ctx.strokeStyle = this.outerCircleForegroundColor;
        ctx.stroke();
    }
}