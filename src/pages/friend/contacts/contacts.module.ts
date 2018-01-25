import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { ContactsPage } from './contacts';
import { WaveSideBarComponentModule } from '../../../components/wave-side-bar/wave-side-bar.module';
import { ScrollHeight } from '../../../directives/scroll-height';

@NgModule({
  declarations: [ContactsPage, ScrollHeight],
  imports: [IonicPageModule.forChild(ContactsPage), WaveSideBarComponentModule],
})
export class ContactsPageModule {}
