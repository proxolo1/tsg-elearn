import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { CourseService } from './course.service';

import { QuoteService } from './quote.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  courses: any | undefined;
  isLoading = false;
  message!:any;

  constructor(
    private courseService: CourseService,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.getCourse();
  }
  enrollCourse(id: number) {
    this.courseService.enrollCourse(id).subscribe(
      (res) => {
       this.message=res;
       this.toaster.info(this.message.message)
        this.getCourse();
      },
      (error) => {
        this.toaster.error(error.error.message)
        alert(error.error.message);
      }
    );
  }
  getMonthsDifference(inputDate: any) {
    const targetDate = new Date(inputDate);
    const currentDate = new Date();
    const differenceInTime = targetDate.getTime() - currentDate.getTime();
    return Math.floor(differenceInTime / (1000 * 60 * 60 * 24 * 30));
  }
  getCourse() {
    this.courseService.getCourse().subscribe(
      (res) => {
        this.isLoading = false;
        this.courses = res;
      },
      (error) => {
        alert(error);
      }
    );
  }

}
