import { Component, OnInit, ElementRef } from "@angular/core";
import { IonicPage, ViewController, Platform } from "ionic-angular";
import { OnlineTaskService } from "../../../providers/data.service";

@IonicPage()
@Component({
	selector: "cmp-task",
	templateUrl: "task.html",
	providers: []
})
export class TaskPage implements OnInit {
    showDismissButton = true;
    page_title = "任务管理";
	openNewTaskForm = false;
	taskType = "today";
	allTasks = {
		finished: new Array(),
		unfinished: new Array()
	};
	newTask = {
		title: "",
		description: "",
		num: 1
	};

	constructor(
		public taskservice: OnlineTaskService,
		public viewCtrl: ViewController
	) {}

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

	addTask = function(isActive: any) {
		let task = this.newTask;
		// task.num = 1;
		task.isActive = isActive;
		// 创建任务
		this.taskservice.createTask(task).subscribe((response: any) => {
			let data: any = JSON.parse(response._body);
			if (data && data.status == "fail") {
			} else {
				let tt = this.allTasks.unfinished;
				// replace push to trigger the event
				this.allTasks.unfinished = [task].concat(tt);
				this.newTask = {
					title: "",
					description: "",
					num: 1
				};
                this.openNewTaskForm = false;
                this.showDismissButton=true;
			}
		});
	};

	dismiss() {
		let data = { foo: "bar" };
		this.viewCtrl.dismiss(data);
	}

	task_activate(task, state) {}

	task_delete(task) {}
}
