import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object
import { AngularFirestore } from '@angular/fire/firestore';
import { Fixture } from './students';
import { User } from './user'
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  studentsRef: AngularFireList<any>;    // Reference to Student data list, its an Observable
  studentRef: AngularFireObject<any>;   // Reference to Student object, its an Observable too
  newUser: any;
  
  constructor(private db: AngularFireDatabase,
    private dbs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
  public fb: FormBuilder,
    public toastr: ToastrService,) { }

  // Create Student
  AddStudent(fixture: Fixture) {
    this.studentsRef.push({
      fixtureTime: fixture.fixtureTime,
      fixtureDate: fixture.fixtureDate,
      fixtureLocation: fixture.fixtureLocation,
      courtFeesPaidBy: fixture.courtFeesPaidBy,
      amountPaid: fixture.amountPaid
    })
  }
  
  // Fetch Single Student Object
  GetStudent(id: string) {
    this.studentRef = this.db.object('students-list/' + id);
    return this.studentRef;
  }
  // Fetch Students List
  GetStudentsList() {
    this.studentsRef = this.db.list('students-list');
    return this.studentsRef;
  }  

  // Update Student Object
  UpdateStudent(fixture: Fixture) {
    this.studentRef.update({
      fixtureTime: fixture.fixtureTime,
      fixtureDate: fixture.fixtureDate,
      fixtureLocation: fixture.fixtureLocation,
      courtFeesPaidBy: fixture.courtFeesPaidBy,
      amountPaid: fixture.amountPaid
    })
  }  

  // Delete Student Object
  DeleteStudent(id: string) { 
    this.studentRef = this.db.object('students-list/'+id);
    this.studentRef.remove();
  }
  
}