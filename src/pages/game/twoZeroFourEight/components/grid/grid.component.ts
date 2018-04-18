import { Component, Input } from '@angular/core';
import { ITile } from '../../interfaces/index';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html'
})

export class GridComponent {
  @Input() tiles: ITile[];
}
