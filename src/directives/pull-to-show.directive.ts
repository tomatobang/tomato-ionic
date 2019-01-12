/**
 * PullToShowDirective
 * from: https://github.com/ionic-team/ionic/blob/master/src/components/refresher/refresher.ts
 * update at 18-04-02: now it change to:
 * https://github.com/ionic-team/ionic/blob/master/core/src/components/refresher/refresher.tsx
 * TODO: 重构
 */

import {
  Directive,
  EventEmitter,
  HostBinding,
  Host,
  Input,
  NgZone,
  Output,
  OnDestroy,
  OnInit,
  ElementRef,
} from '@angular/core';

import {
  GESTURE_PRIORITY_REFRESHER,
  GESTURE_REFRESHER,
  GestureController,
  GestureDelegate,
} from 'ionic-angular/gestures/gesture-controller';

import { Content } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import { isTrueProperty } from 'ionic-angular/util/util';
import { pointerCoord } from 'ionic-angular/util/dom';
import { PointerEvents } from 'ionic-angular/gestures/pointer-events';
import { UIEventManager } from 'ionic-angular/gestures/ui-event-manager';

@Directive({
  selector: 'pull-to-show',
})
export class PullToShowDirective implements OnInit, OnDestroy {
  @HostBinding('style.top') _top = '';
  // 私有属性
  _appliedStyles = false;
  _didStart: boolean;
  _lastCheck = 0;
  _isEnabled = true;
  _gesture: GestureDelegate;
  _events: UIEventManager;
  _pointerEvents: PointerEvents;

  state: string = STATE_INACTIVE;
  @HostBinding('class.refresher-active')
  _isInactive = this.state !== 'inactive';
  startY: number = null;
  currentY: number = null;
  deltaY: number = null;
  // > 1 则表示可显示
  progress = 0;

  @Input() pullMin = 60;
  @Input() pullMax: number = this.pullMin + 60;
  @Input() closeDuration = 280;
  @Input() snapbackDuration = 280;
  @Input()
  get enabled(): boolean {
    return this._isEnabled;
  }

  set enabled(val: boolean) {
    this._isEnabled = isTrueProperty(val);
    this._setListeners(this._isEnabled);
  }

  @Output()
  ionToshow: EventEmitter<PullToShowDirective> = new EventEmitter<
    PullToShowDirective
  >();
  @Output()
  ionPull: EventEmitter<PullToShowDirective> = new EventEmitter<
    PullToShowDirective
  >();
  @Output()
  ionStart: EventEmitter<PullToShowDirective> = new EventEmitter<
    PullToShowDirective
  >();
  @Output()
  ionCancel: EventEmitter<PullToShowDirective> = new EventEmitter<
    PullToShowDirective
  >();

  constructor(
    public _plt: Platform,
    @Host() private _content: Content,
    private _zone: NgZone,
    gestureCtrl: GestureController,
    public element: ElementRef
  ) {
    this._events = new UIEventManager(_plt);
    _content._hasRefresher = true;
    this._gesture = gestureCtrl.createGesture({
      name: GESTURE_REFRESHER,
      priority: GESTURE_PRIORITY_REFRESHER,
    });
  }

  _onStart(ev: TouchEvent): any {
    // if multitouch then get out immediately
    if (ev.touches && ev.touches.length > 1) {
      return false;
    }
    if (this.state !== STATE_INACTIVE && this.state !== STATE_TOSHOW) {
      return false;
    }

    const scrollHostScrollTop = this._content.getContentDimensions().scrollTop;
    // if the scrollTop is greater than zero then it's
    // not possible to pull the content down yet
    if (scrollHostScrollTop > 0) {
      return false;
    }

    if (!this._gesture.canStart()) {
      return false;
    }

    const coord = pointerCoord(ev);
    console.log('Pull-to-refresh, onStart', ev.type, 'y:', coord.y);
    if (this._content.contentTop > 0) {
      const newTop = this._content.contentTop + 'px';
      if (this._top !== newTop) {
        this._top = newTop;
      }
    }

    this.startY = this.currentY = coord.y;
    this.progress = 0;
    this.state = STATE_INACTIVE;
    this._isInactive = false;
    return true;
  }

  _onMove(ev: TouchEvent) {
    // this method can get called like a bazillion times per second,
    // so it's built to be as efficient as possible, and does its
    // best to do any DOM read/writes only when absolutely necessary
    // if multitouch then get out immediately
    if (ev.touches && ev.touches.length > 1) {
      return 1;
    }

    if (!this._gesture.canStart()) {
      return 0;
    }

    // do nothing if it's actively toshow
    // or it's in the process of closing
    // or this was never a startY
    if (
      this.startY === null ||
      this.state === STATE_TOSHOW ||
      this.state === STATE_CANCELLING ||
      this.state === STATE_COMPLETING
    ) {
      return 2;
    }

    // if we just updated stuff less than 16ms ago
    // then don't check again, just chillout plz
    const now = Date.now();
    if (this._lastCheck + 16 > now) {
      return 3;
    }

    // remember the last time we checked all this
    this._lastCheck = now;

    // get the current pointer coordinates
    const coord = pointerCoord(ev);

    this.currentY = coord.y;

    // it's now possible they could be pulling down the content
    // how far have they pulled so far?
    this.deltaY = coord.y - this.startY;

    // don't bother if they're scrolling up
    // and have not already started dragging
    if (this.deltaY <= 0) {
      // the current Y is higher than the starting Y
      // so they scrolled up enough to be ignored
      this.progress = 0;

      if (this.state !== STATE_INACTIVE) {
        this._zone.run(() => {
          this.state = STATE_INACTIVE;
          this._isInactive = false;
        });
      }

      if (this._appliedStyles) {
        // reset the styles only if they were applied
        this._setCss(0, '', false, '');
        return 5;
      }

      return 6;
    }

    if (this.state === STATE_INACTIVE) {
      // this refresh is not already actively pulling down
      // get the content's scrollTop
      const scrollHostScrollTop = this._content.getContentDimensions()
        .scrollTop;

      // if the scrollTop is greater than zero then it's
      // not possible to pull the content down yet
      if (scrollHostScrollTop > 0) {
        this.progress = 0;
        this.startY = null;
        return 7;
      }

      // content scrolled all the way to the top, and dragging down
      this.state = STATE_PULLING;
      this._isInactive = true;
    }

    // prevent native scroll events
    ev.preventDefault();

    // the refresher is actively pulling at this point
    // move the scroll element within the content element
    this._setCss(this.deltaY, '0ms', true, '');

    if (!this.deltaY) {
      // don't continue if there's no delta yet
      this.progress = 0;
      return 8;
    }

    // so far so good, let's run this all back within zone now
    this._zone.run(() => {
      this._onMoveInZone();
    });
  }

  _onMoveInZone() {
    // set pull progress
    this.progress = this.deltaY / this.pullMin;

    // emit "start" if it hasn't started yet
    if (!this._didStart) {
      this._didStart = true;
      this.ionStart.emit(this);
    }

    // emit "pulling" on every move
    this.ionPull.emit(this);

    // do nothing if the delta is less than the pull threshold
    if (this.deltaY < this.pullMin) {
      // ensure it stays in the pulling state, cuz its not ready yet
      this.state = STATE_PULLING;
      this._isInactive = true;
      return 2;
    }

    if (this.deltaY > this.pullMax) {
      // they pulled farther than the max, so kick off the refresh
      this._beginToshow();
      return 3;
    }

    // pulled farther than the pull min!!
    // it is now in the `ready` state!!
    // if they let go then it'll refresh, kerpow!!
    this.state = STATE_READY;
    this._isInactive = true;
    return 4;
  }

  _onEnd() {
    // only run in a zone when absolutely necessary
    console.log('_onEnd', this.state);
    if (this.state === STATE_READY) {
      this._zone.run(() => {
        // they pulled down far enough, so it's ready to refresh
        this._beginToshow();
      });
    } else if (this.state === STATE_PULLING) {
      this._zone.run(() => {
        // they were pulling down, but didn't pull down far enough
        // set the content back to it's original location
        // and close the refresher
        // set that the refresh is actively cancelling
        this.cancel();
      });
    } else if (this.state === STATE_INACTIVE) {
      this._zone.run(() => {
        // they were pulling down, but didn't pull down far enough
        // set the content back to it's original location
        // and close the refresher
        // set that the refresh is actively cancelling
        this.ionCancel.emit(this);
      });
    }

    // reset on any touchend/mouseup
    this.startY = null;
  }

  _beginToshow() {
    // assumes we're already back in a zone
    // they pulled down far enough, so it's ready to refresh
    this.state = STATE_TOSHOW;
    this._isInactive = true;

    // place the content in a hangout position while it thinks
    this._setCss(this.pullMin + 30, this.snapbackDuration + 'ms', true, '');
    // emit "refresh" because it was pulled down far enough
    // and they let go to begin toshow
    this.ionToshow.emit(this);
  }

  /**
   * Call `complete()` when your async operation has completed.
   * For example, the `toshow` state is while the app is performing
   * an asynchronous operation, such as receiving more data from an
   * AJAX request. Once the data has been received, you then call this
   * method to signify that the toshow has completed and to close
   * the refresher. This method also changes the refresher's state from
   * `toshow` to `completing`.
   */
  complete() {
    this._close(STATE_COMPLETING, '120ms');
  }

  /**
   * Changes the refresher's state from `toshow` to `cancelling`.
   */
  cancel() {
    this._close(STATE_CANCELLING, '');
  }

  _close(state: string, delay: string) {
    let timer: any;

    function close(ev: TransitionEvent) {
      // closing is done, return to inactive state
      if (ev) {
        clearTimeout(timer);
      }

      this.state = STATE_INACTIVE;
      this._isInactive = false;
      this.progress = 0;
      this._didStart = this.startY = this.currentY = this.deltaY = null;
      this._setCss(0, '0ms', false, '');
    }

    // create fallback timer incase something goes wrong with transitionEnd event
    timer = setTimeout(close.bind(this), 600);

    // create transition end event on the content's scroll element
    this._content.onScrollElementTransitionEnd(close.bind(this));

    // reset set the styles on the scroll element
    // set that the refresh is actively cancelling/completing
    this.state = state;
    this._isInactive = state !== 'inactive';
    this._setCss(0, '', true, delay);

    if (this._pointerEvents) {
      this._pointerEvents.stop();
    }
  }

  _setCss(
    y: number,
    duration: string,
    overflowVisible: boolean,
    delay: string
  ) {
    this._appliedStyles = y > 0;

    const content = this._content;
    const Css = this._plt.Css;
    content.setScrollElementStyle(
      Css.transform,
      y > 0 ? 'translateY(' + y + 'px) translateZ(0px)' : 'translateZ(0px)'
    );
    content.setScrollElementStyle(Css.transitionDuration, duration);
    content.setScrollElementStyle(Css.transitionDelay, delay);
    content.setScrollElementStyle('overflow', overflowVisible ? 'hidden' : '');
  }

  _setListeners(shouldListen: boolean) {
    this._events.unlistenAll();
    this._pointerEvents = null;
    if (shouldListen) {
      this._pointerEvents = this._events.pointerEvents({
        element: this._content.getScrollElement(),
        pointerDown: this._onStart.bind(this),
        pointerMove: this._onMove.bind(this),
        pointerUp: this._onEnd.bind(this),
        zone: false,
      });
    }
  }

  /**
   * @hidden
   */
  ngOnInit() {
    // bind event listeners
    // save the unregister listener functions to use onDestroy
    this._setListeners(this._isEnabled);
    const ref: HTMLDivElement = this._content.getElementRef().nativeElement;
    ref.appendChild(this.element.nativeElement);
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    this._setListeners(false);
    this._events.destroy();
    this._gesture.destroy();
  }
}

const STATE_INACTIVE = 'inactive';
const STATE_PULLING = 'pulling';
const STATE_READY = 'ready';
const STATE_TOSHOW = 'toshow';
const STATE_CANCELLING = 'cancelling';
const STATE_COMPLETING = 'completing';
