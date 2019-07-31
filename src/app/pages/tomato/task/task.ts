import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { OnlineTaskService } from '@services/data.service';
import { GlobalService } from '@services/global.service';
import { Helper } from '@services/utils/helper';

@Component({
  selector: 'cmp-task',
  templateUrl: 'task.html',
  styleUrls: ['./task.scss']
})
export class TaskPage implements OnInit {

  showDismissButton = true;
  page_title = '任务管理';
  taskType = 'today';
  openNewTaskForm = false;
  allTasks = {
    finished: new Array(),
    unfinished: new Array(),
  };
  newTask = {
    title: '',
    target: '',
    description: '',
    num: 1,
  };

  constructor(
    public taskservice: OnlineTaskService,
    public modalCtrl: ModalController,
    public globalservice: GlobalService,
    public platform: Platform,
    public helper: Helper,
  ) {
  }

  ngOnInit() {
    this.taskservice.getTasks().subscribe(
      data => {
        const dataArr = data;
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
        console.log('getTasks err', err);
      }
    );
  }

  addNewTaskLink() {
    this.openNewTaskForm = true;
    this.page_title = '添加新任务';
    this.showDismissButton = false;
  }


  addTask(isActive: any) {
    let task: any;
    task = this.newTask;
    task.isActive = true;
    // 创建任务
    this.taskservice.createTask(task).subscribe((response: any) => {
      const data: any = response;
      if (data && data.status === 'fail') {
      } else {
        task._id = data._id;
        const tt = this.allTasks.unfinished;
        this.allTasks.unfinished = [task].concat(tt);
        this.allTasks.unfinished.slice();
        this.newTask = {
          title: '',
          target: '',
          description: '',
          num: 1,
        };
        this.openNewTaskForm = false;
        this.showDismissButton = true;
        this.page_title = '任务管理';
      }

    });
  }

  removeTask(task: any) {
    for (const index in this.allTasks.unfinished) {
      if (this.allTasks.unfinished[index] === task) {
        this.taskservice.deleteTask(task._id).subscribe(response => {
          const data: any = response;
          if (data && data.status === 'fail') {
          } else {
            this.allTasks.unfinished.splice(parseInt(index, 10), 1);
            this.allTasks.unfinished = this.allTasks.unfinished.slice();
          }
        });
      }
    }
  }

  removeTaskFromActiveList(task: any) {
    task.isActive = false;
    this.taskservice.updateTask(task._id, task).subscribe(
      response => {
        const data: any = response;
        if (data && data.status === 'fail') {
        } else {
          this.allTasks.unfinished = this.allTasks.unfinished.slice();
        }
      },
      err => {
        alert(JSON.stringify(err));
        console.log('updateTask err', err);
      }
    );
  }

  addTaskToActiveList(task: any) {
    task.isActive = true;
    this.taskservice.updateTask(task._id, task).subscribe(
      response => {
        const data: any = response;
        if (data && data.status === 'fail') {
        } else {
          this.allTasks.unfinished = this.allTasks.unfinished.slice();
        }
      },
      err => {
        alert(JSON.stringify(err));
        console.log('updateTask err', err);
      }
    );
  }

  startTask(task) {
    if (task._id) {
      delete task._id;
    }
    this.modalCtrl.dismiss({ task });
  }

  dismiss() {
    const data = { foo: 'bar' };
    this.modalCtrl.dismiss(data);
  }

  cancleAddTask() {
    this.page_title = '任务管理';
    this.newTask.title = '';
    this.showDismissButton = true;
    this.openNewTaskForm = false;
  }
}
