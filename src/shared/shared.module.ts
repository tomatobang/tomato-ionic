import { NgModule } from '@angular/core';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [PipesModule],
  declarations: [],
  providers: [],
  exports: [PipesModule],
})
export class SharedModule {}
