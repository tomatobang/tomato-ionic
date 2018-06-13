import { NgModule } from '@angular/core';
import { SearchUserPage } from './searchUserPage';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [SearchUserPage],
  imports: [IonicPageModule.forChild(SearchUserPage), SharedModule],
})
export class SearchUserPageModule {}
