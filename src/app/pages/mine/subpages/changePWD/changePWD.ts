import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from '@services/global.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'cmp-changepwd',
  templateUrl: 'changePWD.html',
  styleUrls: ['./changePWD.scss']
})
export class ChangePWDPage implements OnInit {
  changePWDForm: FormGroup;

  PWDModel: {
    oldPassword: string;
    newPassword: string;
    newPassword_confirm: string;
  };



  formErrors = {
    oldPassword: '',
    newPassword: '',
    newPassword_confirm: '',
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
    newPassword_confirm: {
      required: '重复密码必须输入。',
      minlength: '密码至少要6位。',
      validateEqual: '两次输入的密码不一致。',
    },
  };

  constructor(private modalCtrl: ModalController, private _g: GlobalService, public fb: FormBuilder, ) {
  }

  ngOnInit() {
    this.PWDModel = {
      oldPassword: '',
      newPassword: '',
      newPassword_confirm: '',
    }
    this.buildForm();
  }

  buildForm(): void {
    this.changePWDForm = this.fb.group({
      oldPassword: [
        this.PWDModel.oldPassword,
        [Validators.required, Validators.minLength(6)],
      ],
      newPassword: [
        this.PWDModel.newPassword,
        [Validators.required, Validators.minLength(6)],
      ],
      newPassword_confirm: [
        this.PWDModel.newPassword_confirm,
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

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    console.log('userForm.valid:', this.changePWDForm.valid);
    if (this.changePWDForm.valid) {
      if (this.PWDModel.oldPassword !== this.PWDModel.newPassword) {
        // 新密码老密码一样
      } else {
        this.modalCtrl.dismiss();
      }
    }

  }
}
