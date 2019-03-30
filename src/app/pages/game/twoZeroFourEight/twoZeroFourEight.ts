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

@Component({
  selector: 'TwoZeroFourEight',
  templateUrl: './twoZeroFourEight.html',
  styleUrls: ['./twoZeroFourEight.scss']
})

export class TwoZeroFourEightPage implements OnInit {

  constructor(public game: GameService, public events: Events) { }
  @ViewChild('gameContainer') gameContainer: ElementRef;

  key = '';

  public newGame(): void {
    this.game.newGame();
  }

  ngOnInit() {
    this.newGame();
    this.key = '';
  }

  ionViewDidEnter() {
  }
  onSwipeLeft() {
    console.log('swipeleft');
    this.key = DIRECTIONS[37];
    this.game.move(this.key);
  }
  onSwipeRight() {
    console.log('swiperight');
    this.key = DIRECTIONS[39];
    this.game.move(this.key);
  }

  onSwipeUp() {
    console.log('swipeup');
    this.key = DIRECTIONS[38];
    this.game.move(this.key);
  }

  onSwipeDown() {
    console.log('swipedown');
    this.key = DIRECTIONS[40];
    this.game.move(this.key);
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
