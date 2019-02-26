import { Directive, forwardRef, Input } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector:
    '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EqualValidator),
      multi: true,
    },
  ],
})
export class EqualValidator implements Validator {
  @Input() public validateEqual: string;
  @Input() public reverse: string;
  constructor() {}

  private get isReverse() {
    if (!this.reverse) {
      return false;
    }
    return this.reverse === 'true';
  }

  validate(
    ctl: AbstractControl
  ): {
    [key: string]: any;
  } {
    // self value
    const v = ctl.value;

    // control vlaue
    const e = ctl.root.get(this.validateEqual);

    // value not equal
    if (e && v !== e.value && !this.isReverse) {
      return { validateEqual: false };
    }

    // value equal and reverse
    if (e && v === e.value && this.isReverse) {
      delete e.errors['validateEqual'];
      if (!Object.keys(e.errors).length) {
        e.setErrors(null);
      }
    }

    // value not equal and reverse
    if (e && v !== e.value && this.isReverse) {
      e.setErrors({ validateEqual: false });
    }
    return null;
  }
}
