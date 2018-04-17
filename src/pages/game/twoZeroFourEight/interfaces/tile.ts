import { IPosition } from './position';

export interface ITile extends IPosition {
  originalX: number;
  originalY: number;
  value: number;
  id: string;
  merged: boolean;
  position: IPosition;
}
