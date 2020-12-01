import { Component, OnInit } from '@angular/core';

import { CrudService } from '../services/crud.service';    // CRUD services API
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'; // Reactive form services
import { ToastrService } from 'ngx-toastr'; // Alert message using NGX toastr
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {
  date: any;
   public fixtureForm: FormGroup;  // Define FormGroup to student's form
  constructor(public crudApi: CrudService,
    public fb: FormBuilder,  
    public auth: AuthService,
    public toastr: ToastrService) { }
user: firebase.User;
  ngOnInit(): void {
    this.crudApi.GetStudentsList();  
    this.studenForm();   
    this.auth.getUserState()
      .subscribe(user => {
        this.user = user;
    })
  }
   studenForm() {
    this.fixtureForm = this.fb.group({
      fixtureTime: [''],
      fixtureDate: [''],
      fixtureLocation: [''],
      courtFeesPaidBy: [''],
      amountPaid: ['']
    })  
  }
  currentDate() {
  this.date = new Date();
}
  // Accessing form control using getters
  get fixtureTime() {
    return this.fixtureForm.get('fixtureTime');
  }

  get fixtureDate() {
    return this.fixtureForm.get('fixtureDate');
  }  

  get fixtureLocation() {
    return this.fixtureForm.get('fixtureLocation');
  }


  // Reset student form's values
  ResetForm() {
    this.fixtureForm.reset();
  }  
 
  submitStudentData() {
    this.crudApi.AddStudent(this.fixtureForm.value); // Submit student data using CRUD API
    this.toastr.success(this.fixtureForm.controls['fixtureLocation'].value + ' successfully added!'); // Show success message when data is successfully submited
    this.ResetForm();  // Reset form when clicked on reset button
   };


}
