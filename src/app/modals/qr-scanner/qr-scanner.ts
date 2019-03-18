import { Component } from '@angular/core';
import {
  ModalController,
} from '@ionic/angular';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { EmitService } from '@services/emit.service';

@Component({
  selector: 'modal-qr-scanner',
  templateUrl: 'qr-scanner.html',
  styleUrls: ['./qr-scanner.scss'],
  providers: [Vibration],
})
export class QRScannerModal {
  private ionApp: HTMLElement;

  constructor(
    private qrScanner: QRScanner,
    private modalCtrl: ModalController,
    private vibration: Vibration,
    public emitservice: EmitService,
  ) {
    this.scanQrCode();
  }

  private scanQrCode(): void {
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        this.ionApp = <HTMLElement>document.getElementsByTagName(
          'ion-app'
        )[0];
        if (status.authorized) {
          const scanSub = this.qrScanner.scan().subscribe((qrCode: string) => {
            this.vibration.vibrate(30);
            let response;
            try {
              response = JSON.parse(qrCode);
            } catch (e) {
              response = qrCode;
            }

            this.hideCamera();
            scanSub.unsubscribe();
            this.dismiss(response);
          });

          this.ionApp.classList.add('transparent');
          this.showCamera();
        } else if (status.denied) {
          console.error('QR_CODE.PERMISSION_PERMANENTLY_DENIED');
          this.dismiss();
        } else {
          console.error('QR_CODE.PERMISSION_DENIED');
          this.dismiss();
        }
      })
      .catch((e: any) => {
        console.warn('QR_CODE.PROBLEM_TEXT');
        this.dismiss();
      });
  }

  private showCamera() {
    this.emitservice.qrcodeEmit.emit('qrScanner:show');
    this.qrScanner.show();

  }

  private hideCamera() {
    this.emitservice.qrcodeEmit.emit('qrScanner:hide');
    this.qrScanner.hide();
  }

  public dismiss(qrCode: object = null) {
    this.qrScanner.getStatus().then((status: QRScannerStatus) => {
      if (status.showing) {
        this.hideCamera();
      }
    });
    if (this.ionApp) {
      this.ionApp.classList.remove('transparent');
    }
    this.modalCtrl.dismiss(qrCode);
  }

  ionViewDidLeave() {
    this.hideCamera();
    this.qrScanner.destroy();
  }
}
