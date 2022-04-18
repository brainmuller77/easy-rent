import { Injectable } from '@angular/core';
import { HttpClient,  HttpErrorResponse,  HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  apiUrl: string = 'http://localhost:3004/api';
   server: string= 'http://localhost/schsms/server/';	
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  api;
  loggedin:boolean = true
  constructor(private http: HttpClient) {

   
}

post(data,file): Observable<any> {
  let API_URL = `${this.apiUrl}/`+file;
  return this.http.post(API_URL, data)
    .pipe(
      catchError(this.error)
    )
}

get(filename:string): Observable<any> {
  let API_URL = `${this.apiUrl}/`+filename;
  return this.http.get(API_URL)
    .pipe(
      catchError(this.error)
    )
}



getId(id,file): Observable<any>{
  return this.http.get(`${this.apiUrl}/`+file`/${id}`);
}

put(data,file): Observable<any> {
  let API_URL = `${this.apiUrl}`+file;
  return this.http.put(API_URL,data)
    .pipe(
      catchError(this.error)
    )
}

deleteTask(file,id): Observable<any> {
  var API_URL = `${this.apiUrl}`+file`/${id}`;
  return this.http.delete(API_URL).pipe(
    catchError(this.error)
  )
}

// Handle Errors 
error(error: HttpErrorResponse) {
  let errorMessage = '';
  if (error.error instanceof ErrorEvent) {
    errorMessage = error.error.message;
  } else {
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  console.log(errorMessage);
  return throwError(errorMessage);
}

}
