import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { GameService } from './services/game.service';
import { DIRECTIONS } from './enums/index';
import { Events } from '@ionic/angular';
import { GestureController } from '@ionic/core/dist/collection/utils/gesture/gesture-controller';
declare var Hammer: any;

@Component({
  selector: 'TwoZeroFourEight',
  templateUrl: './twoZeroFourEight.html',
})

export class TwoZeroFourEightPage implements OnInit {
  swipeGesture: GestureController;
  @ViewChild('gameContainer') gameContainer: ElementRef;

  constructor(public game: GameService, public events: Events) { }

  public newGame(): void {
    this.game.newGame();
  }

  ngOnInit() {
    this.newGame();
  }

  ionViewDidLoad() {
    this.swipeGesture = new GestureController(this.gameContainer.nativeElement, {
      recognizers: [[Hammer.Swipe, { direction: Hammer.DIRECTION_ALL }]],
    });
    this.swipeGesture.listen();
    let key = '';
    this.swipeGesture.on('swipeleft', e => {
      console.log('swipeleft');
      key = DIRECTIONS[37];
      this.game.move(key);
    });
    this.swipeGesture.on('swiperight', e => {
      console.log('swiperight');
      key = DIRECTIONS[39];
      this.game.move(key);
    });

    this.swipeGesture.on('swipeup', e => {
      console.log('swipeup');
      key = DIRECTIONS[38];
      this.game.move(key);
    });

    this.swipeGesture.on('swipedown', e => {
      console.log('swipedown');
      key = DIRECTIONS[40];
      this.game.move(key);
    });
  }

  @HostListener('window:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    const key = DIRECTIONS[event.which];
    if (key) {
      event.preventDefault();
      this.game.move(key);
    }
  }
}
