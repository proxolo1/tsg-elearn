import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, CredentialsService } from '@app/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private toaster:ToastrService
  ) {}

  ngOnInit() {}

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  logout() {
    this.authenticationService
      .logout()
      .subscribe(() => {
        this.toaster.warning("logout successfully");
        this.router.navigate(['/login'], { replaceUrl: true })
      });
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.email : null;
  }
  get role(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.role : null;
  }
}
