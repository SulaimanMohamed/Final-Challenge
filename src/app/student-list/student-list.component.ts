import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';  // CRUD API service class
import { ToastrService } from 'ngx-toastr';      // Alert message using NGX toastr
import { AuthService } from '../auth.service';
export interface Fixture {
    $key: string;
    fixtureTime: string;
    fixtureDate: string;
  fixtureLocation: string;
  courtFeesPaidBy: string;
  amountPaid: string;
 }
@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  p: number = 1;
  user: firebase.User;                 // Settup up pagination variable
  Fixture: Fixture[];                 // Save students data in Student's array.
  hideWhenNoStudent: boolean = false; // Hide students data table when no student.
  noData: boolean = false;            // Showing No Student Message, when no student in database.
  constructor(public crudApi: CrudService, // Inject student CRUD services in constructor.
    public toastr: ToastrService,
  private auth: AuthService,) { }

  
   
  ngOnInit(): void {
    this.dataState(); // Initialize student's list, when component is ready
    let s = this.crudApi.GetStudentsList(); 
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.Fixture = [];
      data.forEach(item => {
        let a = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.Fixture.push(a as Fixture);
      })
    })
    this.auth.getUserState()
      .subscribe(user => {
        this.user = user;
    })
  }
  // Using valueChanges() method to fetch simple list of students data. It updates the state of hideWhenNoStudent, noData variables when any changes occurs in student data list in real-time.
  dataState() {     
    this.crudApi.GetStudentsList().valueChanges().subscribe(data => {
      
      if(data.length <= 0){
        this.hideWhenNoStudent = false;
        this.noData = true;
      } else {
        this.hideWhenNoStudent = true;
        this.noData = false;
      }
    })
  }

  // Method to delete student object
  deleteStudent(fixture) {
    if (window.confirm('Are sure you want to delete this Fixture ?')) { // Asking from user before Deleting student data.
      this.crudApi.DeleteStudent(fixture.$key) // Using Delete student API to delete student.
      this.toastr.success(fixture.fixtureLocation + ' successfully deleted!'); // Alert message will show up when student successfully deleted.
    }
  }

}
