import { Component, OnInit, ElementRef,ViewChild } from "@angular/core";
import { IonicPage, ViewController, Platform } from "ionic-angular";
import { OnlineTaskService } from "../../../providers/data.service";
import { VoicePlayService } from "../../../_util/voiceplay.service";
import { GlobalService } from "../../../providers/global.service";
import { VoiceRecorderComponent } from "../../../components/voice-recorder/";

@IonicPage()
@Component({
	selector: "cmp-task",
	templateUrl: "task.html",
	providers: []
})
export class TaskPage implements OnInit {
    showDismissButton = true;
	page_title = "任务管理";
	taskType = "today";
	openNewTaskForm = false;
	allTasks = {
		finished: new Array(),
		unfinished: new Array()
	};
	newTask = {
		title: "",
		description: "",
		num: 1
	};

	voicepostParams={}

	constructor(
		public taskservice: OnlineTaskService,
		public viewCtrl: ViewController,
		public voiceService:VoicePlayService,
		public globalservice:GlobalService,
	) {}

	@ViewChild(VoiceRecorderComponent)
	voiceRecordCMP: VoiceRecorderComponent;

	ngOnInit() {
		this.taskservice.getTasks().subscribe(
			data => {
				const retStr = data && data._body;
				const dataArr = JSON.parse(retStr);
				this.allTasks.unfinished = dataArr;
				if (dataArr.length > 0 && this.allTasks.unfinished) {
					this.allTasks.unfinished = this.allTasks.unfinished.slice();
				} else {
					this.allTasks.unfinished = [];
					this.allTasks.unfinished = this.allTasks.unfinished.slice();
				}
			},
			err => {
				alert(JSON.stringify(err));
				console.log("getTasks err", err);
			}
		);
	}

	playVoiceRecord(task){
		// 格式示例:pengyi_59ae098c49b3972f7176003b_cordovaIMVoice
		let filename = this.globalservice._userinfo.username+"_"+task._id +"_cordovaIMVoice.amr";
		this.voiceService.downloadVoiceFile(filename);
		// if(task.voiceUrl){
		// 	this.voiceService.downloadVoiceFile(filename);
		// }
	}

	addNewTaskLink(){
		this.openNewTaskForm=true;
		this.page_title='添加新任务';
		this.showDismissButton=false
		this.voicepostParams={
			userid:'userid',
			taskid:'taskid'
		}
	}

	addTask = function(isActive: any) {
		let task = this.newTask;
		// task.num = 1;
		task.isActive = isActive;
		task.voiceUrl = "";
		// 创建任务
		this.taskservice.createTask(task).subscribe((response: any) => {
			let data: any = JSON.parse(response._body);
			if (data && data.status == "fail") {
			} else {
				// voiceUrl:"/uploadfile/voices/" + (this.voicepostParams.userid+"_"+this.voicepostParams.taskid+"_"+filename);
				this.voicepostParams = {
					taskid:data._id,
					userid:data.userid
				}
				setTimeout(()=>{
					this.voiceRecordCMP.uploadVoiceFile().then(filename=>{
						let tt = this.allTasks.unfinished;
						task.voiceUrl = (this.voicepostParams.userid+"_"+this.voicepostParams.taskid+"_"+filename);
						this.allTasks.unfinished = [task].concat(tt);
						this.newTask = {
							title: "",
							description: "",
							num: 1
						};
						this.openNewTaskForm = false;
						this.showDismissButton=true;
						this.page_title = "任务管理";
					},err =>{
						console.error(err);
					});
				},100)
			}
		});
	}

	removeTask(task: any) {
        for (let index in this.allTasks.unfinished) {
            if (this.allTasks.unfinished[index] === task) {
                let ind = new Number(index);
                // 删除任务
                this.taskservice.deleteTask(task._id).subscribe(response => {
                    let data: any = JSON.parse(response._body);
                    if (data && data.status == "fail") {
                    } else {
                        this.allTasks.unfinished.splice(ind.valueOf(), 1);
                        this.allTasks.unfinished = this.allTasks.unfinished.slice();
                    }
                });

            }
        }
	}
	
	removeTaskFromActiveList(task: any) {
        task.isActive = false;
        this.taskservice.updateTask(task._id, task).subscribe(response => {
            let data: any = JSON.parse(response._body);
            if (data && data.status == "fail") {
            } else {
                this.allTasks.unfinished = this.allTasks.unfinished.slice();
            }
        }, err => {
            alert(JSON.stringify(err));
            console.log('updateTask err', err);
        });

    }

    addTaskToActiveList(task: any) {
        task.isActive = true;
        this.taskservice.updateTask(task._id, task).subscribe(response => {
            let data: any = JSON.parse(response._body);
            if (data && data.status == "fail") {
            } else {
                this.allTasks.unfinished = this.allTasks.unfinished.slice();
            }
        }, err => {
            alert(JSON.stringify(err));
            console.log('updateTask err', err);
        });
	}
	
	startTask(task){
		if (task._id){
			delete task._id
		}
		this.viewCtrl.dismiss({task});
	}

	dismiss() {
		let data = { foo: "bar" };
		this.viewCtrl.dismiss(data);
	}

	cancleAddTask(){
		this.page_title = "任务管理";
		this.newTask.title='';
		this.showDismissButton=true;
		this.openNewTaskForm=false;
	}

}
