import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    this.isLoading=true;
    this.subscription = this.authenticationService.register(this.loginForm.value).subscribe(
      (res) => {
        this.isLoading=false;
        this.toaster.success('registration successfull');
        this.router.navigate(['login']);
      },
      (error) => {
        this.isLoading=true;
        this.toaster.error(error.error.message);
        location.reload();
      }
    );
  }
  private createForm() {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        jobTitle: ['', Validators.required],
        phoneNumber: ['',Validators.pattern(/^(\+?\d{1,3}[- ]?)?\d{10}$/)],
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
