import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { interceptors } from '../shared/Interceptors';

@NgModule({
  declarations: [
    RegisterComponent,
    //LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    LoginComponent  // Added here since it's a standalone component
  ],
  providers:[provideHttpClient(withInterceptors(interceptors)),AuthService]
})
export class AuthModule { }