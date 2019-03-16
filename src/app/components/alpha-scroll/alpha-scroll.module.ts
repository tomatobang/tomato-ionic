import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '@pipes/pipes.module';
import { AlphaScroll } from './alpha-scroll';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderBy } from '@pipes/orderBy.pipe';

@NgModule({
  imports: [
    IonicModule,
    PipesModule,
    CommonModule,
    FormsModule
  ],
  exports: [
    AlphaScroll
  ],
  declarations: [
    AlphaScroll
  ],
  providers: [OrderBy]
})
export class ScrollModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ScrollModule, providers: []
    };
  }
}
