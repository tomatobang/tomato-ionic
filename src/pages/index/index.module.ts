/**
 * Created by hsuanlee on 2017/4/4.
 */
import { NgModule } from '@angular/core';
import { IndexPage} from './index';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [IndexPage],
    imports: [IonicPageModule.forChild(IndexPage)],
})
export class IndexPageModule { }