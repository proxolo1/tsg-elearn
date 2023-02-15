import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Logger } from '@app/@shared';
import { CredentialsService } from '@app/auth';
import { CourseService } from '@app/home/course.service';

import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
const log=new Logger('About-component');
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})

export class AboutComponent implements OnInit {
  version: string | null = environment.version;
  userCourse: any;
  courses: any;
  currentUserEmail = this.credentialService.credentials?.email;
  currentUserRole = this.credentialService.credentials?.role;
  users: any;
  message: any;
  addForm!: FormGroup;
  isNameSorted=false;
  isDurationSorted=false;
  isEnrolledSort=false;
  constructor(
    private courseService: CourseService,
    private credentialService: CredentialsService,
    private formBuilder: FormBuilder,
    private toaster:ToastrService,
    private http:HttpClient
  ) {}

  ngOnInit() {
    log.info('About component initialized'); // Logging initialization of component
    this.getCourse();
    this.createAddForm();
  }

  createAddForm() {
    this.addForm = this.formBuilder.group({
      id: [],
      name: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', Validators.required],
      trainer: ['', Validators.required],
      maxRegistrations: ['', Validators.required],
    });
  }
  getCourse() {
    log.debug('Fetching courses'); // Logging fetching of courses
    this.courseService.getCourse().subscribe((res) => {
      this.courses = res;

      this.userCourse = this.findUserEnrollCourse(res);
    });
  }
  findUserEnrollCourse(course: any) {
    log.debug('Finding enrolled courses'); // Logging finding of enrolled courses
    let enrollCourseArr: { users: any[] }[] = [];
    course.forEach((data: { users: any[] }) => {
      data.users.forEach((user) => {
        if (user.email == this.currentUserEmail) {
          enrollCourseArr.push(data);
        }
      });
      log.info("Enrolled courses", enrollCourseArr); // Logging enrolled courses
    });
    // log.info("enrolled courses",enrollCourseArr)
    return enrollCourseArr;
  }

  viewCourse(courseName: string) {
    log.info("Viewing course", courseName); // Logging viewing of course
    this.courseService.getCourseById(courseName).subscribe((res) => {
      this.getUsers(res);
    });
  }
  updateCourse(courseName: string) {
    log.info("Updating course", courseName); // Logging updating of course
    this.courseService.getCourseById(courseName).subscribe(
      (res) => {
      
        this.setValuesUpdate(res);
      },
      (error) => {
        this.toaster.error(error.error.message)
      }
    );
  }
  deleteCourse(id: number) {
    log.info("Deleting course", id); // Logging deletion of course
    if(!confirm(`are you sure want to delete ${id}`)){
      return ;
    }
    this.courseService
      .deleteCourse(id)
      .pipe(
        tap((res) => {
          this.toaster.info("course deleted successfully")
          this.getCourse();
          return res;
        }),
        catchError((error) => {

          return error;
        })
      )
      .subscribe();
  }
  saveUpdate() {
    log.info("Saving update"); // Logging saving of update

    this.courseService.updateCourse(this.addForm.value).subscribe(
      (res) => {
        this.message=res;
        this.toaster.success(this.message.message)
        this.getCourse();
      },
      (error) => {
        alert(error.error.message);
      }
    );
  }
  getUsers(data: any) {
    this.users = data.users;
  }
  setValuesUpdate(values: any) {
    this.addForm.setValue({
      id: values.id,
      name: values.name,
      description: values.description,
      trainer: values.trainer,
      duration: new Date(values.duration).toISOString().substring(0, 10),
      maxRegistrations: values.maxRegistrations,
    });
  }
  addCourse() {
    this.courseService.addCourse(this.addForm.value).subscribe((res) => {
      this.message = res;
      this.toaster.success(this.message.message);
      this.getCourse();
      this.addForm.reset();
    });
  }
  getMonthsDifference(inputDate: any) {
    const targetDate = new Date(inputDate);
    const currentDate = new Date();
    const differenceInTime = targetDate.getTime() - currentDate.getTime();
    return Math.floor(differenceInTime / (1000 * 60 * 60 * 24 * 30));
  }
  sortCourseName(){
    console.log("hello")
    this.isNameSorted=!this.isNameSorted;
    if(this.isNameSorted){
        this.courses=this.courses.sort((a:any,b: any)=>{
      return a.name.localeCompare(b.name);
    })} else{
      this.courses=this.courses.sort((a:any,b: any)=>{
        return b.name.localeCompare(a.name);
    })
    }}
    sortCourseDuration(){
      this.isDurationSorted=!this.isDurationSorted;
      if(this.isDurationSorted){
        this.courses=this.courses.sort(this.compareDates)
      } else{
        this.courses=this.courses.sort((a:any,b: any)=>{
          return b.duration.localeCompare(a.duration);
      })
      }}
      sortEnrolled(){
        this.isEnrolledSort=!this.isEnrolledSort;
        if(this.isEnrolledSort){
            this.courses=this.courses.sort((a:any,b: any)=>{
          return a.noOfRegistrations-(b.noOfRegistrations);
        })} else{
          this.courses=this.courses.sort((a:any,b: any)=>{
            return b.noOfRegistrations-(a.noOfRegistrations);
        })
        }}
         compareDates(a:any, b:any) {
          const monthA = new Date(a.duration).getFullYear();
          const monthB = new Date(b.duration).getFullYear();
        
          if (monthA < monthB) {
            return -1;
          } else if (monthA > monthB) {
            return 1;
          } else {
            return 0;
          }
        }
  
}
