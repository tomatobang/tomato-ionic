/**
 * Created by hsuanlee on 2017/4/4.
 */
import { NgModule } from '@angular/core';
import { IndexPage} from './index';
import { IonicPageModule } from 'ionic-angular';

import { OnlineTomatoService,OnlineTaskService } from "../../providers/data.service"

@NgModule({
    declarations: [IndexPage],
    imports: [IonicPageModule.forChild(IndexPage)],
    providers: [OnlineTaskService, OnlineTomatoService],
})
export class IndexPageModule { }