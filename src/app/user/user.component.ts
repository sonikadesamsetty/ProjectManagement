import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {


  userForm!: FormGroup;
  loginForm!: FormGroup;
  userService = inject(UserService);
  router = inject(Router);
  title = "Sign In";
  msg: string="";

  ngOnInit(): void {
    this.userForm = new FormGroup({
      "email": new FormControl(''),
      "password": new FormControl(''),
      "confirmPassword": new FormControl(''),
    });

    this.loginForm = new FormGroup({
      "email": new FormControl(''),
      "password": new FormControl('')
    });
  }

  submitForm() {
    console.log("debkj");
    console.log(this.userForm);
    console.log(this.userForm.value.email + " " + this.userForm.value.password + " " + this.userForm.value.confirmPassword);
    this.userService.registerUser(this.userForm.value.email, this.userForm.value.password).subscribe(res => {
      console.log("response: ", res);
      this.loginForm.reset();
      this.userForm.reset();
      this.userService.setLoggedInUser(res.email);
    });
    this.msg = "Success!! You have registered";
    this.title = "Sign In";
  }

  submitLoginForm() {
    this.userService.loginUser(this.loginForm.value.email,this.loginForm.value.password).subscribe(res=>{
      if(res.token) {
        console.log(res);
        console.log(res.user.email);
        this.userService.setLoggedInUser(res.user.email);
        localStorage.setItem("token",res.token);
      }
      this.router.navigateByUrl("/home");
      this.loginForm.reset();
      this.userForm.reset();
    })
  }

}

