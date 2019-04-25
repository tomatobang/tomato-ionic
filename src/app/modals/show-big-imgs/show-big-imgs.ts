import { Component, Input, OnInit } from '@angular/core';
import {
  ModalController,
} from '@ionic/angular';

@Component({
  selector: 'modal-show-big-imgs',
  templateUrl: 'show-big-imgs.html',
  styleUrls: ['./show-big-imgs.scss']
})
export class ShowBigImgsModal implements OnInit {
  @Input()
  pictures;

  constructor(
    private modalCtrl: ModalController,
  ) {

  }

  ngOnInit() {
    if(this.pictures){}
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  ionViewDidLeave() { }
}
