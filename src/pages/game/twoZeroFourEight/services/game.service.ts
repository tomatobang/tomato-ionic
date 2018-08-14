import { Injectable } from '@angular/core';
import { GridService } from './grid.service';
import { Tile } from '../models/index';
import { Store, select } from '@ngrx/store';
import { GameAction } from './game.action';

import { IPosition } from '../interfaces/position';
import 'rxjs/add/operator/map';

import * as fromGame from './game.reducer';

@Injectable()
export class GameService {
  public currentScore;
  public highScore;
  public tiles;
  public gameOver;
  public won;
  public game;

  constructor(
    private gridService: GridService,
    private store: Store<fromGame.GameState>
  ) {
    // const store$ = store.select('game');
    this.currentScore = store.pipe(select(fromGame.getCurrentScore));
    this.highScore = store.pipe(select(fromGame.getHighcore));
    this.tiles = store.pipe(select(fromGame.getTitles));
    this.gameOver = store.pipe(select(fromGame.getGameoverState));
    this.won = store.pipe(select(fromGame.getWonState));

    this.game = store.pipe(select('game'));
    // this.currentScore = store$.map(({ currentScore }: IGame) => currentScore);
  }

  newGame(): void {
    this.gridService.buildEmptyGameBoard();
    this.gridService.buildStartingPosition();
    this.store.dispatch({
      type: GameAction.START,
      payload: this.gridService.tiles,
    });
  }

  move(key: string): boolean {
    if (this.won && !this.store.pipe(select('keepPlaying'))) {
      return false;
    }
    const positions = this.gridService.traversalDirections(key);
    let hasMoved = false;

    this.gridService.prepareTiles();

    positions.x.forEach((x: number) => {
      positions.y.forEach((y: number) => {
        const originalPosition: IPosition = { x: x, y: y };
        const tile: Tile = this.gridService.getCellAt(originalPosition);

        if (tile) {
          const cell = this.gridService.calculateNextPosition(tile, key);
          const next = cell.next;

          if (next && next.value === tile.value && !next.merged) {
            const newValue = tile.value * 2;
            const merged = new Tile(tile, newValue);
            merged.merged = true;

            this.gridService.insertTile(merged);
            this.gridService.removeTile(tile);
            this.gridService.moveTile(merged, next);

            this.store.dispatch({
              type: GameAction.UPDATE_SCORE,
              payload: cell.next.value,
            });
            this.store.dispatch({
              type: GameAction.UPDATE_HIGEST_TILE,
              payload: merged.value,
            });

            hasMoved = true;
          } else {
            this.gridService.moveTile(tile, cell.newPosition);
          }

          if (
            !this.gridService.samePositions(originalPosition, cell.newPosition)
          ) {
            hasMoved = true;
          }
        }
      });
    });

    if (hasMoved) {
      this.gridService.randomlyInsertNewTile();
      this.store.dispatch({
        type: GameAction.MOVE,
        payload: this.gridService.tiles,
      });

      if (!this.movesAvailable()) {
        this.store.dispatch({ type: GameAction.GAMEOVER });
      }
    }
  }

  movesAvailable(): boolean {
    return (
      this.gridService.anyCellsAvailable() ||
      this.gridService.tileMatchesAvailable()
    );
  }

  keepGoing(): void {
    this.store.dispatch({ type: GameAction.CONTINUE });
  }
}
