import {
    Directive,
    OnInit,
    HostListener,
    EventEmitter,
    Output,
    OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Directive({ selector: '[appAddTagDirective]' })
export class AddTagDirective implements OnInit, OnDestroy {
    @Output() private addTag: EventEmitter<any> = new EventEmitter();
    private clicks = new Subject<any>();
    private debounceStream$;
    constructor(public alertCtrl: AlertController, ) {
    }
    public ngOnInit() {
        this.debounceStream$ = this.clicks
            .subscribe(event => this.addTag.emit(event));
    }
    public ngOnDestroy() {
        this.debounceStream$.unsubscribe();
    }
    @HostListener('click', ['$event'])
    private async clickEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        const prompt = await this.alertCtrl.create({
            header: '添加标签',
            message: '',
            inputs: [
                {
                    name: 'tagName',
                    placeholder: '标签名称...',
                },
            ],
            buttons: [
                {
                    text: '取消',
                    handler: data => {
                        console.log('Cancel clicked');
                    },
                },
                {
                    text: '提交',
                    handler: data => {
                        this.addTag.emit(data.tagName)
                    },
                },
            ],
        });
        await prompt.present();
    }
}
