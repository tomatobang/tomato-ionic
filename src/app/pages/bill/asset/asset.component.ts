import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
})
export class AssetComponent implements OnInit {
  showAddForm = false;
  cardTitle = '';

  constructor(private modal: ModalController) { }

  ngOnInit() { }

  close() {
    this.modal.dismiss();
  }
  addAsset() {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.cardTitle = '新增';
    }
  }

  submitAsset() {
    this.showAddForm = false;
  }

  edit() {
    this.cardTitle = '编辑';
    this.showAddForm = true;
  }
}
