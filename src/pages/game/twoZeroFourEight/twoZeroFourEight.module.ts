import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TwoZeroFourEightPage } from './twoZeroFourEight';

import { GridComponent } from './components/grid/grid.component';
import { MessageComponent } from './components/message/message.component';
import { TileComponent } from './components/tile/tile.component';

import { StoreModule } from '@ngrx/store';
import { GameReducer } from './services/index';

@NgModule({
  declarations: [
    TwoZeroFourEightPage,
    GridComponent,
    MessageComponent,
    TileComponent,
  ],
  imports: [
    IonicPageModule.forChild(TwoZeroFourEightPage),
    StoreModule.forRoot(GameReducer),
  ],
  exports: [TwoZeroFourEightPage],
})
export class TwoZeroFourEightPageModule {}
