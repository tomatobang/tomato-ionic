import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

declare var window: any;

@Directive({
  selector: '[angularRoundProgress]',
})
export class AngularRoundProgressDirective {
  canvas: HTMLCanvasElement;

  width: any = 270;
  height: any = 270;
  outerCircleWidth = 12;
  innerCircleWidth = 3;
  outerCircleRadius = 110;
  innerCircleRadius = 80;

  labelFont = '40pt lighter 微软雅黑';
  outerCircleBackgroundColor = '#8C8C8C';
  outerCircleForegroundColor = '#F97271';
  innerCircleColor = '#F97271';

  labelColor = '#F97271';

  timerStatusValue: any;

  @Input()
  get timerStatus(): any {
    return this.timerStatusValue;
  }
  set timerStatus(val) {
    this.timerStatusValue = val;
    this.render();
  }

  constructor(private element: ElementRef, private renderer: Renderer2) {
    const ele = this.element.nativeElement;
    this.canvas = this.renderer.createElement('canvas');
    ele.parentNode.replaceChild(this.canvas, ele);
    const ctx = this.canvas.getContext('2d');
    this.fixPixelRatio(ctx);
    this.renderer.setAttribute(this.canvas, 'width', this.width);
    this.renderer.setAttribute(this.canvas, 'height', this.height);
    this.renderer.setAttribute(this.canvas, 'class', 'tomato-canvas-style');
  }

  fixPixelRatio(context) {
    const backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    const ratio = (window.devicePixelRatio || 1) / backingStore;
    this.width *= ratio;
    this.height *= ratio;
    this.outerCircleWidth *= ratio;
    this.innerCircleWidth *= ratio;
    this.outerCircleRadius *= ratio;
    this.innerCircleRadius *= ratio;

    if (ratio >= 2) {
      this.labelFont = '80pt  lighter 微软雅黑';
    }
    if (ratio >= 3) {
      this.labelFont = '120pt  lighter 微软雅黑';
    }
  }

  render() {
    // Create the content of the canvas
    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.width, this.height);

    // The "background" circle
    const x = this.width / 2;
    const y = this.height / 2;
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
    const startAngle = -(Math.PI / 2);

    const endAngle =
      Math.PI * 2 * this.timerStatusValue.percentage - Math.PI / 2;
    const anticlockwise = false;
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.arc(x, y, this.outerCircleRadius, startAngle, endAngle, anticlockwise);
    ctx.lineWidth = this.outerCircleWidth;
    ctx.strokeStyle = this.outerCircleForegroundColor;
    ctx.stroke();
  }
}
