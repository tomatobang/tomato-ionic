import {
    Directive,
    OnInit,
    HostListener,
    OnDestroy,
    Input,
} from '@angular/core';
import { VoicePlayService } from '@services/utils/voiceplay.service';
import { Helper } from '@services/utils/helper';
import { GlobalService } from '@services/global.service';

@Directive({ selector: '[appVoicePlayDirective]' })
export class VoicePlayDirective implements OnInit, OnDestroy {

    @Input()
    voiceUrl;

    constructor(
        private voiceService: VoicePlayService,
        private helper: Helper,
        private globalservice: GlobalService, ) {
    }
    public ngOnInit() {

    }
    public ngOnDestroy() {
    }

    @HostListener('click', ['$event'])
    async clickEvent(event: MouseEvent) {
        if (this.voiceUrl) {
            const filename = this.helper.getFileName(this.voiceUrl);
            const remotepath = this.globalservice.qiniuDomain + filename;
            this.voiceService
                .downloadVoiceFile_observable(filename, remotepath)
                .subscribe(
                    data => {
                        if (data.data) {
                            this.voiceService.play(data.value).then(() => {
                            });
                        } else {
                            if (data.value) {
                                // 显示进度
                                // console.log('下载进度', data.value);
                            }
                        }
                    },
                    err => {
                    }
                );
        } else {
            alert('无音频记录！');
        }
    }
}
