import { Component, forwardRef } from '@angular/core';
import { EmojiProvider } from './emoji.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const EMOJI_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EmojiPickerComponent),
  multi: true
};

@Component({
  selector: 'emoji-picker',
  providers: [EMOJI_PICKER_VALUE_ACCESSOR],
  templateUrl: './emoji-picker.html'
})
export class EmojiPickerComponent implements ControlValueAccessor {
  emojiArr = [];

  private content: string;
  private onChanged: Function;
  private onTouched: Function;

  constructor(emojiProvider: EmojiProvider) {
    console.log('Hello EmojiPickerComponent Component');
    this.emojiArr = emojiProvider.getEmojis();
  }

  writeValue(obj: any): void {
    this.content = obj;
    console.log(this.content);
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
    this.setValue(this.content);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private setValue(val: any): any {
    this.content += val;
    if (this.content) {
      this.onChanged(this.content);
    }
  }
}
