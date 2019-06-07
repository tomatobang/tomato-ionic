import {
    Directive,
    Input,
    OnInit,
    HostListener,
    OnDestroy,
} from '@angular/core';
import { ShowBigImgsModal } from '@modals/show-big-imgs/show-big-imgs';
import { ModalController } from '@ionic/angular';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Directive({ selector: '[appShowBigImgDirective]' })
export class ShowBigImgDirective implements OnInit, OnDestroy {

    @Input()
    pictures;

    @Input()
    picClicked;

    constructor(private modalCtrl: ModalController, private photoViewer: PhotoViewer) {
        // pass
    }
    public ngOnInit() {

    }
    public ngOnDestroy() {
    }

    @HostListener('click', ['$event'])
    async clickEvent(event: MouseEvent) {
        if (window.cordova) {
            this.photoViewer.show(this.picClicked);
        } else {
            const modal = await this.modalCtrl.create({
                component: ShowBigImgsModal,
                componentProps: {
                    pictures: [this.pictures]
                }
            });
            modal.onDidDismiss().then(ret => {
            });
            await modal.present();
        }
    }
}
