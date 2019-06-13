import {
    Directive,
    Input,
    OnInit,
    HostListener,
    OnDestroy,
} from '@angular/core';
import { ShowVideoModal } from '@modals/show-video/show-video';
import { ModalController } from '@ionic/angular';

@Directive({ selector: '[appShowVideoDirective]' })
export class ShowVideoDirective implements OnInit, OnDestroy {

    @Input()
    videoUrl;

    constructor(private modalCtrl: ModalController) {
        // pass
    }
    public ngOnInit() {

    }
    public ngOnDestroy() {
    }

    @HostListener('click', ['$event'])
    async clickEvent(event: MouseEvent) {

        const modal = await this.modalCtrl.create({
            component: ShowVideoModal,
            componentProps: {
                videoUrl: this.videoUrl
            }
        });
        modal.onDidDismiss().then(ret => {
        });
        await modal.present();
    }
}
