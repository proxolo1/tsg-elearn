import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { Logger, LogLevel } from '@app/@shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;
  private subscription!: Subscription;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private toaster: ToastrService,
  ) {
    this.createForm();
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void { }
  register() {

    this.subscription = this.authenticationService.register(this.loginForm.value).subscribe(
      (res) => {
        this.toaster.success('registration successfull');
        this.router.navigate(['login']);
      },
      (error) => {
        console.log(error)
        this.toaster.error(error.error.message)
      }
    );
  }
  private createForm() {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        jobTitle: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.checkPasswords }
    );
  }
  checkPasswords(group: FormGroup) {
    let pass = group.controls['password'].value;
    let confirmPass = group.controls['confirmPassword'].value;
    return pass == confirmPass ? null : { notSame: true };
  }


}
