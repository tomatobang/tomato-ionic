import {
    Directive,
    Input,
    OnInit,
    HostListener,
    OnDestroy,
} from '@angular/core';
import { ShowBigImgsModal } from '@modals/show-big-imgs/show-big-imgs';
import { ModalController } from '@ionic/angular';

@Directive({ selector: '[appShowBigImgDirective]' })
export class ShowBigImgDirective implements OnInit, OnDestroy {

    @Input()
    pictures;

    constructor(private modalCtrl: ModalController, ) {
        // pass
    }
    public ngOnInit() {

    }
    public ngOnDestroy() {
    }

    @HostListener('click', ['$event'])
    async clickEvent(event: MouseEvent) {
        const modal = await this.modalCtrl.create({
            component: ShowBigImgsModal,
            componentProps: {
                pictures: this.pictures
            }
        });
        modal.onDidDismiss().then(ret => {
        });
        await modal.present();
    }
}
