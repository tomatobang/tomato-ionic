import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from '@services/global.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnlineUserService } from '@services/data.service';

@Component({
  selector: 'cmp-changepwd',
  templateUrl: 'changePWD.html',
  styleUrls: ['./changePWD.scss']
})
export class ChangePWDPage implements OnInit {
  changePWDForm: FormGroup;

  formErrors = {
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  };

  validationMessages = {
    oldPassword: {
      required: '密码必须输入。',
      minlength: '密码至少要6位。',
    },
    newPassword: {
      required: '密码必须输入。',
      minlength: '密码至少要6位。',
    },
    newPasswordConfirm: {
      required: '重复密码必须输入。',
      minlength: '密码至少要6位。',
      validateEqual: '两次输入的密码不一致。',
    },
  };

  otherError = '';

  constructor(private modalCtrl: ModalController, private _g: GlobalService,
    private formbuilder: FormBuilder, private userservice: OnlineUserService) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.changePWDForm = this.formbuilder.group({
      oldPassword: [
        null,
        [Validators.required, Validators.minLength(6)],
      ],
      newPassword: [
        null,
        [Validators.required, Validators.minLength(6)],
      ],
      newPasswordConfirm: [
        null,
        [Validators.required, Validators.minLength(6)],
      ],
    });
    this.changePWDForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.changePWDForm) {
      return;
    }
    const form = this.changePWDForm;
    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key of Object.keys(control.errors)) {
          if (messages[key] && !this.formErrors[field]) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  }

  save() {
    console.log('changePWDForm.valid:', this.changePWDForm.valid);
    if (this.changePWDForm.valid) {
      if (this.changePWDForm.value.oldPassword !== this.changePWDForm.value.newPassword) {
        this.userservice.changePWD({
          oldPassword: this.changePWDForm.value.oldPassword,
          newPassword: this.changePWDForm.value.newPassword,
        }).subscribe(ret => {
          console.log(ret);
          if (ret.status === 'fail') {
            this.otherError = ret.description;
          } else {
            this.modalCtrl.dismiss();
          }
        });
      } else {
        this.otherError = '新旧密码一样!';
      }
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
