import { Action, ActionReducer, createSelector, createFeatureSelector } from '@ngrx/store';
import { GameAction } from './game.action';
import { ITile } from '../interfaces/index';
import { Tile } from '../models/index';

export interface ActionWithPayload<T> extends Action {
  payload: T;
}

export interface GameState {
  currentScore: number;
  highScore: number;
  keepPlaying: boolean;
  won: boolean;
  gameOver: boolean;
  winningValue: number;
  tiles: ITile[];
}

const initialState: GameState = {
  currentScore: 0,
  highScore: parseInt(localStorage.getItem('highScore'), 10) || 0,
  keepPlaying: false,
  won: false,
  gameOver: false,
  winningValue: 2048,
  tiles: [],
};

export const gameReducer: ActionReducer<any> = (
  state = initialState,
  action: ActionWithPayload<any>
) => {
  switch (action.type) {
    case GameAction.START:
      return Object.assign({}, state, {
        gameOver: false,
        won: false,
        currentScore: 0,
        keepPlaying: false,
        tiles: action.payload,
      });
    case GameAction.MOVE:
      return Object.assign({}, state, { tiles: action.payload });
    case GameAction.UPDATE_HIGEST_TILE:
      const won = action.payload >= state.winningValue;
      const gameOver = won && !state.keepPlaying;
      return Object.assign({}, state, { gameOver: gameOver, won: won });
    case GameAction.UPDATE_SCORE:
      const currentScore = state.currentScore + action.payload;
      if (currentScore < state.highScore) {
        return Object.assign({}, state, { currentScore: currentScore });
      } else {
        localStorage.setItem('highScore', currentScore.toString());
        return Object.assign({}, state, {
          currentScore: currentScore,
          highScore: currentScore,
        });
      }
    case GameAction.CONTINUE:
      return Object.assign({}, state, { gameOver: false, keepPlaying: true });
    case GameAction.GAMEOVER:
      return Object.assign({}, state, { gameOver: true, won: false });
    case GameAction.WIN:
      if (state.keepPlaying === true) {
        return Object.assign({}, state, { gameOver: false, won: true });
      } else {
        return Object.assign({}, state, { gameOver: true, won: true });
      }
    default:
      return state;
  }
};


export const getGameState = createFeatureSelector<GameState>('game');

export const getState = createSelector(
  getGameState,
  (state: GameState) => {
    return state;
  }
);


export const getCurrentScore = createSelector(
  getState,
  (state: GameState) => {
    return state.currentScore;
  }
);


export const getHighcore = createSelector(
  getState,
  (state: GameState) => state.highScore
);

export const getTitles = createSelector(
  getState,
  (state: GameState) => state.tiles,
);

export const getWonState = createSelector(
  getState,
  (state: GameState) => state.won,
);

export const getGameoverState = createSelector(
  getState,
  (state: GameState) => state.gameOver,
);
