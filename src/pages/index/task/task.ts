import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, ViewController, Platform } from 'ionic-angular';
import { OnlineTaskService } from '../../../providers/data.service';
import { VoicePlayService } from '../../../providers/utils/voiceplay.service';
import { GlobalService } from '../../../providers/global.service';
import { VoiceRecorderComponent } from '../../../components/voice-recorder/';
import { baseUrl } from '../../../config';
import { transition } from '@angular/core/src/animation/dsl';

@IonicPage()
@Component({
  selector: 'cmp-task',
  templateUrl: 'task.html',
  providers: [],
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
    description: '',
    num: 1,
  };

  voicepostParams = {};

  voiceUploadUrl = {
    url: baseUrl + 'upload/voicefile',
  };

  constructor(
    public taskservice: OnlineTaskService,
    public viewCtrl: ViewController,
    public voiceService: VoicePlayService,
    public globalservice: GlobalService,
    public platform: Platform
  ) {}

  @ViewChild(VoiceRecorderComponent) voiceRecordCMP: VoiceRecorderComponent;

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
        console.log('getTasks err', err);
      }
    );
  }

  playVoiceRecord(task) {
    if (task.voiceUrl) {
      const filename = this.getFileName(task.voiceUrl);
      task.inDownloading = true;
      task.progress = '0%';
      this.voiceService
        .downloadVoiceFile_observable(filename, this.globalservice.token)
        .subscribe(
          data => {
            if (data.data) {
              task.inDownloading = false;
              task.isplaying = true;
              this.voiceService.play(data.value).then(() => {
                task.isplaying = false;
              });
            } else {
              if (data.value) {
                // 显示进度
                task.progress = data.value + '%';
                console.log('下载进度', data.value);
              }
            }
          },
          err => {
            task.inDownloading = false;
            task.isplaying = false;
          }
        );
    } else {
      alert('此任务无音频记录！');
    }
  }

  getFileName(url) {
    const arr = url.split('/');
    const fileName = arr[arr.length - 1];
    return fileName;
  }

  addNewTaskLink() {
    this.openNewTaskForm = true;
    this.page_title = '添加新任务';
    this.showDismissButton = false;
    this.voicepostParams = {
      userid: 'userid',
      taskid: 'taskid',
    };
  }

  addTask = function(isActive: any) {
    const task = this.newTask;
    // task.num = 1;
    task.isActive = true;
    task.voiceUrl = '';
    // 创建任务
    this.taskservice.createTask(task).subscribe((response: any) => {
      const data: any = JSON.parse(response._body);
      if (data && data.status === 'fail') {
      } else {
        // 链接示例: voiceUrl:"/uploadfile/voices/" + (this.voicepostParams.userid+"_"+this.voicepostParams.taskid+"_"+filename);
        this.voicepostParams = {
          taskid: data._id,
          userid: data.userid,
        };
        task._id = data._id;
        // 上传音屏文件
        setTimeout(() => {
          this.voiceRecordCMP.uploadVoiceFile(this.globalservice.token).then(
            filename => {
              const tt = this.allTasks.unfinished;
              task.voiceUrl =
                this.voicepostParams.userid +
                '_' +
                this.voicepostParams.taskid +
                '_' +
                filename;
              this.allTasks.unfinished = [task].concat(tt);
              this.allTasks.unfinished.slice();
              this.newTask = {
                title: '',
                description: '',
                num: 1,
              };
              this.openNewTaskForm = false;
              this.showDismissButton = true;
              this.page_title = '任务管理';
            },
            err => {
              console.error(err);
              const tt = this.allTasks.unfinished;
              task.voiceUrl = '';
              this.allTasks.unfinished = [task].concat(tt);
              this.allTasks.unfinished.slice();
              this.newTask = {
                title: '',
                description: '',
                num: 1,
              };
              this.openNewTaskForm = false;
              this.showDismissButton = true;
              this.page_title = '任务管理';
            }
          );
        }, 100);
      }
    });
  };

  removeTask(task: any) {
    for (const index in this.allTasks.unfinished) {
      if (this.allTasks.unfinished[index] === task) {
        // 删除任务
        this.taskservice.deleteTask(task._id).subscribe(response => {
          const data: any = JSON.parse(response._body);
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
        const data: any = JSON.parse(response._body);
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
        const data: any = JSON.parse(response._body);
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
    this.viewCtrl.dismiss({ task });
  }

  dismiss() {
    const data = { foo: 'bar' };
    this.viewCtrl.dismiss(data);
  }

  cancleAddTask() {
    this.page_title = '任务管理';
    this.newTask.title = '';
    this.showDismissButton = true;
    this.openNewTaskForm = false;
  }
}
