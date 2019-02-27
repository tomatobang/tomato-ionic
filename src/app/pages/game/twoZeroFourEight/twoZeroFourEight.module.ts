import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TwoZeroFourEightPage } from './twoZeroFourEight';

import { GridComponent } from './components/grid/grid.component';
import { MessageComponent } from './components/message/message.component';
import { TileComponent } from './components/tile/tile.component';

import { StoreModule } from '@ngrx/store';
import { GameReducer } from './services/index';

import { UniqueIdService } from './services/uniqueId.service';
import { GameService } from './services/game.service';
import { GridService } from './services/grid.service';

@NgModule({
  declarations: [
    TwoZeroFourEightPage,
    GridComponent,
    MessageComponent,
    TileComponent,
  ],
  imports: [
    IonicModule,
    StoreModule.forRoot({ game: GameReducer }),
  ],
  providers: [UniqueIdService, GameService, GridService],
})
export class TwoZeroFourEightPageModule { }
