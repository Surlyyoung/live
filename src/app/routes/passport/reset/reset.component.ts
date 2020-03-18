import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.less'],
})
export class ResetComponent implements OnInit, OnDestroy {
  constructor(public fb: FormBuilder, private router: Router) {
    this.form = fb.group({
      password: [null, [Validators.required, Validators.minLength(6), ResetComponent.checkPassword.bind(this)]],
      confirm: [null, [Validators.required, Validators.minLength(6), ResetComponent.passwordEquar]],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
    });
  }

  // 进度条
  currentStep = 0;

  // ===表单===
  form: FormGroup;
  get password() {
    return this.form.controls.password;
  }
  get confirm() {
    return this.form.controls.confirm;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
  }

  // 验证码
  count = 0;
  interval$: any;

  // 密码
  visible = false;
  status = 'pool';
  progress = 0;
  passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    pool: 'exception',
  };

  // 跳转计时
  timer = 5;

  static checkPassword(control: FormControl) {
    if (!control) return null;
    const self: any = this;
    self.visible = !!control.value;
    if (control.value && control.value.length > 9) {
      self.status = 'ok';
    } else if (control.value && control.value.length > 5) {
      self.status = 'pass';
    } else {
      self.status = 'pool';
    }

    if (self.visible) {
      self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }
  }

  static passwordEquar(control: FormControl) {
    if (!control || !control.parent) {
      return null;
    }
    if (control.value !== control.parent.get('password')!.value) {
      return { equar: true };
    }
    return null;
  }

  getCaptcha() {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) clearInterval(this.interval$);
    }, 1000);
  }

  toLogin() {
    this.router.navigateByUrl('/passport/login');
  }

  next() {
    this.mobile.markAsDirty({ onlySelf: true });
    this.mobile.updateValueAndValidity({ onlySelf: true });
    this.captcha.markAsDirty({ onlySelf: true });
    this.captcha.updateValueAndValidity({ onlySelf: true });

    if (this.mobile.invalid || this.captcha.invalid) {
      return false;
    }

    this.currentStep++;
  }

  submit() {
    this.password.markAsDirty({ onlySelf: true });
    this.password.updateValueAndValidity({ onlySelf: true });
    this.confirm.markAsDirty({ onlySelf: true });
    this.confirm.updateValueAndValidity({ onlySelf: true });

    if (this.password.invalid || this.confirm.invalid) {
      return false;
    }

    this.currentStep++;

    this.timer = 5;
    this.interval$ = setInterval(() => {
      this.timer -= 1;
      if (this.timer <= 0) clearInterval(this.interval$);
    }, 1000);
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
