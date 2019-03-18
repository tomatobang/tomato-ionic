import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { OnlineTaskService } from '@services/data.service';
import { VoicePlayService } from '@services/utils/voiceplay.service';
import { Helper } from '@services/utils/helper';
import { GlobalService } from '@services/global.service';
import { VoiceRecorderComponent } from '@components/voice-recorder/';
import { baseUrl } from '../../../config';

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

  voicepostParams = {};

  voiceUploadUrl = {
    url: baseUrl + 'upload/voicefile',
  };

  constructor(
    public taskservice: OnlineTaskService,
    public modalCtrl: ModalController,
    public voiceService: VoicePlayService,
    public globalservice: GlobalService,
    public platform: Platform,
    public helper: Helper
  ) { }

  @ViewChild(VoiceRecorderComponent) voiceRecordCMP: VoiceRecorderComponent;

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

  playVoiceRecord(task) {
    if (task.voiceUrl) {
      const filename = this.helper.getFileName(task.voiceUrl);
      task.inDownloading = true;
      task.progress = '0%';
      const remotepath = this.globalservice.qiniuDomain + filename;
      this.voiceService
        .downloadVoiceFile_observable(filename, remotepath)
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

  stopPlayVoiceRecord() {
    this.voiceService.stop_local_voice();
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

  addTask = function (isActive: any) {
    const task = this.newTask;
    task.isActive = true;
    task.voiceUrl = '';
    // 创建任务
    this.taskservice.createTask(task).subscribe((response: any) => {
      const data: any = response;
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
          this.voiceRecordCMP.uploadVoiceFile().then(
            filename => {
              const tt = this.allTasks.unfinished;
              task.voiceUrl =
                this.voicepostParams.userid +
                '_' +
                this.voicepostParams.taskid +
                '_' +
                filename;
              // 更新 voice url
              this.taskservice
                .updateVoiceUrl({
                  taskid: this.voicepostParams.taskid,
                  relateUrl: task.voiceUrl,
                })
                .subscribe(ret => {
                  console.log('更新 task url', ret);
                });
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
