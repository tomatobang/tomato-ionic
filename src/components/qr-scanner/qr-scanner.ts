import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import lodash from 'lodash';

@Component({
  selector: 'qr-scanner',
  templateUrl: 'qr-scanner.html',
})
export class QRScannerComponent {
  @Output() successScaned: EventEmitter<any> = new EventEmitter();
  @Output() wrongScaned: EventEmitter<any> = new EventEmitter();

  constructor(private modalCtrl: ModalController) {}

  open(format: boolean = false) {
    const modal = this.modalCtrl.create('QRScannerModal');

    modal.onDidDismiss(qrCode => {
      if (lodash.isNil(qrCode)) {
        return this.wrongScaned.emit();
      }
      const response = qrCode;
      return this.successScaned.emit(response);
    });

    modal.present();
  }

  private formatScheme(qrCode: any) {
    if (lodash.isObject(qrCode)) {
      return qrCode;
    } else {
      this.wrongScaned.emit();
    }
  }
}
