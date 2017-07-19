/**
 * Created by hsuanlee on 2017/4/4.
 */
import { NgModule } from '@angular/core';
import { TestPage} from './test';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [TestPage],
    imports: [IonicPageModule.forChild(TestPage)],
})
export class TestPageModule { }