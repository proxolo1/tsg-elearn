import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { AuthenticationService } from './authentication.service';
import { CredentialsService } from './credentials.service';
import { ToastrService } from 'ngx-toastr';
import { PopoverComponent } from '@app/@shared/popover/popover.component';

const log = new Logger('Login');

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;
  message:any;
  usernameTitle:string="Enter Your Username";
  passwordTitle:string="Enter Your Password";
  usernameBody:string=" Please enter your username to login to your account.";
  passwordBody:string=`<ol>
  <li>Use at least 12 characters</li>
  <li>Include a mix of uppercase and lowercase letters</li>
  <li>Include at least one number</li>
  <li>Include at least one special character (e.g. !,@,#,$,%,&amp;,*)</li>
</ol>`;
  dontHave=`<span>Don't have an account yet? <a href="register">Sign up </a>now to enjoy all the benefits.</span>`
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private credentialService: CredentialsService,
    private toaster: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  login() {
    this.isLoading = true;
    const login$ = this.authenticationService.login(this.loginForm.value);
    login$
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials) => {
          console.log(credentials);
          this.credentialService.setCredentials(credentials, true);
          log.debug(`${this.loginForm.value.email} successfully logged in`);
          if(credentials.role=="ROLE_USER"){
             this.router.navigate(
            [this.route.snapshot.queryParams['redirect'] || '/'],
            { replaceUrl: true }
          );
          this.toaster.info(`${this.loginForm.value.email} login successfully`);
          }
          else{
            this.toaster.info(`Hello admin`)
            this.router.navigate(['profile']);
          }
         
        },
        (error) => {
          this.message=error;
          this.toaster.error(error.error.message)
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
    });
  }

}
