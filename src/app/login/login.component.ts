import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Login } from '../modals/login';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  email: any;
  password: any;
  remember: any;
  role : any;
  
  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) { 
    this.email = "tamil@gmail.com",
    this.password = "Tamil@12345",
    this.role = "user"

    this.loginForm = this.fb.group({
      email: new FormControl(this.email, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl(this.password, [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,12}')]),
      role: new FormControl(this.role, Validators.required)
    })
  }

  ngOnInit(): void {
  }

  login() {

    try {
      
      console.log("login res", this.loginForm.value);

    this.email = this.loginForm.value.email;
    this.password = this.loginForm.value.password;
    this.remember = this.loginForm.value.role;

    if (this.loginForm.value.email === null || this.loginForm.value.email.trim() === "") {
      alert("Email Address is Invalid");
    }
    else if (this.loginForm.value.password === null || this.loginForm.value.password.trim() === "") {
      alert("Password is Invalid");
    }
    else {
      
      if (this.loginForm.value.email === null || this.loginForm.value.email.trim() == "") {
        alert("Email is mandatory");
      }
      else if (this.loginForm.value.password === null || this.loginForm.value.password.trim() === "") {
        alert("Password is mandatory");
      }
      // else if (this.loginForm.value.password.length >= 4 && this.loginForm.value.password.length <= 8) {
      //   alert("Password minimum 6 to 8 characters");
      // }
      else {

        
        const loginDTO = new Login(this.loginForm.value.email, this.loginForm.value.password, this.loginForm.value.role);
  
        this.loginService.userLogin(loginDTO).then((res : any) => {
          
          console.log(res);
          if (res.status === "failed" && res.records.length === 0)
          {
            // this.toastr.error(res.message);
            return;            
          }
          else
          {
            let userData = res.records.docs;
            console.log("rrr", res);
            console.log("userData", userData);
            if(userData.length === 0)
            {
              // this.toastr.error("Invalid Email or Password");
            }
            else if(userData[0].account === 'Deactive')
            {
              // this.toastr.warning("Your Account was blocked");
            }
            else
            {
              let user = userData[0];                                   
              localStorage.setItem("LOGGED_IN_USER", JSON.stringify(user));
              this.loginService.loginSubject.next(user);
              
              // this.toastr.success("Login Successfully");
              // window.location.href = "/list";
              this.router.navigate(["/list"], {skipLocationChange: true});
            }
          }
        }, () => {
          // this.toastr.error("Invalid Email or Password");
        })
      }
    }

    } catch (err) {
      
      console.error("error", err);
    }
  }

}
