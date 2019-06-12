import { Component, Input, OnInit } from '@angular/core';
import {
  ModalController,
} from '@ionic/angular';
import { VgAPI } from 'videogular2/core';

@Component({
  selector: 'modal-show-video',
  templateUrl: 'show-video.html',
  styleUrls: ['./show-video.scss']
})
export class ShowVideoModal implements OnInit {

  api: VgAPI;

  @Input()
  videoUrl;

  constructor(
    private modalCtrl: ModalController,
  ) {

  }

  ngOnInit() {
    if (this.videoUrl) { }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
    this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(() => {
      this.api.play();
    });
    this.api.getDefaultMedia().subscriptions.error.subscribe(
      (error) => {
        console.log('报错啦', error);
      }
    );
  }

}
