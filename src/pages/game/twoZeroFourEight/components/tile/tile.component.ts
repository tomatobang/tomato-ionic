import { Component, Input } from '@angular/core';
import { ITile } from '../../interfaces/index';

@Component({
  selector: 'tile',
  templateUrl: './tile.component.html'
})

export class TileComponent {
  @Input() tile: ITile;
}
