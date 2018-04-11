import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { ContactsPage } from './contacts';
import { WaveSideBarComponentModule } from '@components/wave-side-bar/wave-side-bar.module';
import { ScrollHeightDirective } from '@directives/scroll-height.directive';

@NgModule({
  declarations: [ContactsPage, ScrollHeightDirective],
  imports: [IonicPageModule.forChild(ContactsPage), WaveSideBarComponentModule],
})
export class ContactsPageModule {}
