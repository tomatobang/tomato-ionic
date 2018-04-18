import { Component, HostListener, OnInit } from '@angular/core';
import { GameService } from './services/game.service';
import { DIRECTIONS } from './enums/index';
import { IonicPage } from 'ionic-angular';

@Component({
  selector: 'TwoZeroFourEight',
  templateUrl: './twoZeroFourEight.html',
})
@IonicPage()
export class TwoZeroFourEightPage implements OnInit {
  constructor(public game: GameService) {}

  public newGame(): void {
    this.game.newGame();
  }

  ngOnInit() {
    this.newGame();
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
