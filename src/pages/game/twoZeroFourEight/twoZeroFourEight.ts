import { Component, HostListener } from '@angular/core';
import { GameService }             from './services/game.service';
import { DIRECTIONS }              from './enums/index';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html'
})

export class TwoZeroFourEightPage {
  constructor(public game: GameService) {
    this.newGame();
  }

  public newGame(): void {
    this.game.newGame();
  }

  @HostListener('window:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    var key = DIRECTIONS[event.which];
    if (key) {
      event.preventDefault();
      this.game.move(key);
    }
  }
}
