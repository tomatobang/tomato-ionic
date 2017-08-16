/**
 * Created by hsuanlee on 2017/4/4.
 */
import { NgModule } from '@angular/core';
import { IndexPage} from './index';
import { IonicPageModule } from 'ionic-angular';

import { OnlineTomatoService,OnlineTaskService } from "../../providers/data.service";
import { TimelineComponent } from './components/timeline/';

import { TaskPipe } from '../../pipes/taskPipe';
import { StringTruncate } from '../../pipes/stringTruncate';
import { DateTransform } from '../../pipes/dateTransform';


@NgModule({
    declarations: [IndexPage,TimelineComponent, TaskPipe,StringTruncate,DateTransform],
    imports: [IonicPageModule.forChild(IndexPage)],
    providers: [OnlineTaskService, OnlineTomatoService],
})
export class IndexPageModule { }