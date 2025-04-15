import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { LoginComponent } from '../components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  //declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule//RouterModule.forChild([{ path: 'login', component: LoginComponent}]
    ],
  exports: [
    //LoginComponent
    ]
})
export class AuthModule { }