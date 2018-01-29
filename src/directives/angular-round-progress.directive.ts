import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

declare var window: any;
let hasFixRatio = false;
@Directive({
  selector: '[angularRoundProgress]'
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

  constructor(private element: ElementRef) {
    const ele = this.element.nativeElement;
    this.canvas = document.createElement('canvas');
    // 下述方法无效
    // this.canvas.style.width = this.width;
    // this.canvas.style.height = this.height;
    ele.parentNode.replaceChild(this.canvas, ele);
    const ctx = this.canvas.getContext('2d');
    this.fixPixelRatio(ctx);
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);
    this.canvas.setAttribute('class', 'tomato-canvas-style');
  }

  fixPixelRatio(context) {
    /* todo:
            模块切换时，hasFixRatio 会被重置，但是并不会触发 constructor 函数
        */
    //  if (!hasFixRatio) {
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

    hasFixRatio = true;
    //  }
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

    const endAngle = Math.PI * 2 * this.timerStatusValue.percentage - Math.PI / 2;
    const anticlockwise = false;
    ctx.beginPath();
    ctx.arc(x, y, this.outerCircleRadius, startAngle, endAngle, anticlockwise);
    ctx.lineWidth = this.outerCircleWidth;
    ctx.strokeStyle = this.outerCircleForegroundColor;
    ctx.stroke();
  }
}
