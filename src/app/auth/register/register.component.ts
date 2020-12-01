import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth.service';
import { CrudService } from 'src/app/services/crud.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: firebase.User;
  public registerFrom: FormGroup;
  authError: any;
  constructor( public auth: AuthService,
    public fb: FormBuilder,
    public toastr: ToastrService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.userRegisterForm();
    this.auth.getUserState()
      .subscribe(user => {
        this.user = user;
      })
     this.auth.eventAuthError$.subscribe( data => {
      this.authError = data;
    })
  }
  userRegisterForm() {
    this.registerFrom = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: [''],
      role: ['']
    })  
  }
  get firstName() {
    return this.registerFrom.get('firstName');
  }

  get lastName() {
    return this.registerFrom.get('lastName');
  }  

  get email() {
    return this.registerFrom.get('email');
  }

  get role() {
    return this.registerFrom.get('role');
  }
    get password() {
    return this.registerFrom.get('password');
  }
   ResetForm() {
    this.registerFrom.reset();
  }  
   createUser(frm) {
     this.auth.createUser(frm.value);
     frm.reset();
     setTimeout(() => {
       this.router.navigate(['/login'])
      }
      , 500);
     
    
    
     
   }
  
}
