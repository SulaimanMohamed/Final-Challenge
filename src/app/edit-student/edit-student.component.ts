import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrudService } from '../services/crud.service';
import { ActivatedRoute, Router } from "@angular/router"; // ActivatedRoue is used to get the current associated components information.
import { Location } from '@angular/common';  // Location service is used to go back to previous component
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
 user: firebase.User
  editForm: FormGroup;  // Define FormGroup to student's edit form
  constructor(private crudApi: CrudService,       
    private fb: FormBuilder,           
    private location: Location,        
    private actRoute: ActivatedRoute, 
    private router: Router,           
    private toastr: ToastrService,
  private auth: AuthService) { }

  ngOnInit(): void {
    this.updateStudentData();   // Call updateStudentData() as soon as the component is ready 
    const id = this.actRoute.snapshot.paramMap.get('id');  // Getting current component's id or information using ActivatedRoute service
    this.crudApi.GetStudent(id).valueChanges().subscribe(data => {
      this.editForm.setValue(data)  // Using SetValue() method, It's a ReactiveForm's API to store intial value of reactive form 
    });
    this.auth.getUserState()
      .subscribe(user => {
        this.user = user;
    })
  }
   // Accessing form control using getters
  get fixtureTime() {
    return this.editForm.get('fixtureTime');
  }

  get fixtureDate() {
    return this.editForm.get('fixtureDate');
  }

  get fixtureLocation() {
    return this.editForm.get('fixtureLocation');
  }
  get courtFeesPaidBy() {
    return this.editForm.get('courtFeesPaidBy');
  }
    get amountPaid() {
    return this.editForm.get('amountPaid');
  }


  
  // Contains Reactive Form logic
  updateStudentData() {
    this.editForm = this.fb.group({
      fixtureTime: [''],
      fixtureDate: [''],
      fixtureLocation: [''],
      courtFeesPaidBy: [''],
      amountPaid: ['']
    })
  }

  // Go back to previous component
  goBack() {
    this.location.back();
  }

  // Below methods fire when somebody click on submit button
  updateForm(){
    this.crudApi.UpdateStudent(this.editForm.value);       // Update student data using CRUD API
    this.toastr.success(this.editForm.controls['fixtureLocation'].value + ' updated successfully');   // Show succes message when data is successfully submited
    this.router.navigate(['view-students']);               // Navigate to student's list page when student data is updated
  }


}
