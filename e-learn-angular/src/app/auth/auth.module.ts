import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/@shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    SharedModule,
    I18nModule,
    AuthRoutingModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 5000
    }),
    BrowserAnimationsModule
  ],
  declarations: [LoginComponent, RegisterComponent],
  providers:[
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ]
})
export class AuthModule {}
