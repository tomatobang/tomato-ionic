import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
})
export class AssetComponent implements OnInit {

  constructor(private modal: ModalController) { }

  ngOnInit() { }

  close() {
    this.modal.dismiss();
  }
}
