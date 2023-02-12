import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CredentialsService } from '@app/auth';
import { CourseService } from '@app/home/course.service';

import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of, tap } from 'rxjs';

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
  constructor(
    private courseService: CourseService,
    private credentialService: CredentialsService,
    private formBuilder: FormBuilder,
    private toaster:ToastrService
  ) {}

  ngOnInit() {
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
    this.courseService.getCourse().subscribe((res) => {
      this.courses = res;
      this.userCourse = this.findUserEnrollCourse(res);
    });
  }
  findUserEnrollCourse(course: any) {
    let enrollCourseArr: { users: any[] }[] = [];
    course.forEach((data: { users: any[] }) => {
      data.users.forEach((user) => {
        if (user.email == this.currentUserEmail) {
          enrollCourseArr.push(data);
        }
      });
    });
    // log.info("enrolled courses",enrollCourseArr)
    return enrollCourseArr;
  }

  viewCourse(courseName: string) {
    this.courseService.getCourseById(courseName).subscribe((res) => {
      this.getUsers(res);
    });
  }
  updateCourse(courseName: string) {
    this.courseService.getCourseById(courseName).subscribe(
      (res) => {
        this.setValuesUpdate(res);
      },
      (error) => {
        console.log(error);
        alert(error.error.message);
      }
    );
  }
  deleteCourse(id: number) {
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
    });
  }
  getMonthsDifference(inputDate: any) {
    const targetDate = new Date(inputDate);
    const currentDate = new Date();
    const differenceInTime = targetDate.getTime() - currentDate.getTime();
    return Math.floor(differenceInTime / (1000 * 60 * 60 * 24 * 30));
  }
}
