import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import lodash from 'lodash';

@Component({
  selector: 'qr-scanner',
  templateUrl: 'qr-scanner.html',
})
export class QRScannerComponent {
  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter();
  @Output('onWrong') onWrong: EventEmitter<any> = new EventEmitter();

  constructor(private modalCtrl: ModalController) {}

  open(format: boolean = false) {
    let modal = this.modalCtrl.create('QRScannerModal');

    modal.onDidDismiss(qrCode => {
      if (lodash.isNil(qrCode)) {
        return this.onWrong.emit();
      }
      let response = qrCode;
      // if (format) response = this.formatScheme(qrCode);
      return this.onSuccess.emit(response);
    });

    modal.present();
  }

  private formatScheme(qrCode: any) {
    if (lodash.isObject(qrCode)) {
      return qrCode;
    } else {
      this.onWrong.emit();
    }
  }
}
