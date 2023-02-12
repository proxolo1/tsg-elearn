import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CredentialsService } from '@app/auth';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  Authorization!: String;
  constructor(
    private httpClient: HttpClient,
    private credentialService: CredentialsService
  ) {}
  getCourse() {
    return this.httpClient.get('api/course');
  }
  enrollCourse(id: number) {
    let currentUserEmail = this.credentialService.credentials?.email;
    return this.httpClient.get(
      `api/enroll-course?id=${id}&email=${currentUserEmail}`
    );
  }
  getCourseById(courseName: string) {
    return this.httpClient.get(`api/course/${courseName}`);
  }
  updateCourse(course: any) {
    return this.httpClient.put(`api/course/${course.id}`, course);
  }
  deleteCourse(id: number) {
    return this.httpClient.delete(`api/course/${id}`);
  }
  addCourse(course: any) {
    return this.httpClient.post('api/course', course);
  }
}
