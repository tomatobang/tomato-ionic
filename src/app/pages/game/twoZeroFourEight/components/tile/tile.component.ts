import { Component, Input } from '@angular/core';
import { ITile } from '../../interfaces/index';

@Component({
  selector: 'tile',
  templateUrl: './tile.component.html',
  styleUrls: ['../../twoZeroFourEight.scss']
})

export class TileComponent {
  @Input() tile: ITile;
}
