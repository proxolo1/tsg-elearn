import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Credentials, CredentialsService } from './credentials.service';
import { AES, enc } from 'crypto-js';
import { Logger } from '@app/@shared';
export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}
export interface registerContext {
  firstName: string;
  lastNmae: string;
  email: string;
  jobTitle: string;
  phoneNumber: string;
  password: string;
  confirmPassword:string;
}
/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(
    private credentialsService: CredentialsService,
    private http: HttpClient
  ) {
    
  }
  register(context: registerContext) {
    context.password=this.encrypt(context.password);
    context.confirmPassword="";
    return this.http.post('auth/register', context);
  }
  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<any> {
    context.password=this.encrypt(context.password);
    // Replace by proper authentication call
    return this.http.post(`auth/login`, context);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
   encrypt(password:string){
    let asciiValue=[];
    for(let i=0;i<password.length;i++){
      asciiValue.push(password.charCodeAt(i)*10)
    }
      return String.fromCharCode(...asciiValue)
  }
}
