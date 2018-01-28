import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import lodash from 'lodash';

@Component({
  selector: 'qr-scanner',
  templateUrl: 'qr-scanner.html',
})
export class QRScannerComponent {
  @Output('success') success: EventEmitter<any> = new EventEmitter();
  @Output('wrong') wrong: EventEmitter<any> = new EventEmitter();

  constructor(private modalCtrl: ModalController) {}

  open(format: boolean = false) {
    const modal = this.modalCtrl.create('QRScannerModal');

    modal.onDidDismiss(qrCode => {
      if (lodash.isNil(qrCode)) {
        return this.wrong.emit();
      }
      const response = qrCode;
      // if (format) response = this.formatScheme(qrCode);
      return this.success.emit(response);
    });

    modal.present();
  }

  private formatScheme(qrCode: any) {
    if (lodash.isObject(qrCode)) {
      return qrCode;
    } else {
      this.wrong.emit();
    }
  }
}
