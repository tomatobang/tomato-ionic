import {
    Directive,
    OnInit,
    HostListener,
    OnDestroy,
    Output,
    EventEmitter
} from '@angular/core';
import { VoiceRecorderComponent } from '@components/voice-recorder';
import { PopoverController } from '@ionic/angular';

@Directive({ selector: '[appVoiceRecoderDirective]' })
export class VoiceRecoderDirective implements OnInit, OnDestroy {

    @Output() finishRecord: EventEmitter<any> = new EventEmitter();

    constructor(private popoverCtrl: PopoverController, ) {
        // pass
    }
    public ngOnInit() {

    }
    public ngOnDestroy() {
    }

    @HostListener('click', ['$event'])
    async clickEvent(event: MouseEvent) {
        const popover = await this.popoverCtrl.create({
            component: VoiceRecorderComponent,
            componentProps: {}
        });
        popover.onDidDismiss().then(ret => {
            if (ret) {
                this.finishRecord.emit(ret);
            }
        });
        await popover.present();
    }
}
