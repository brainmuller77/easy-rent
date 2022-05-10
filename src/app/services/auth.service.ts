import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL: string = 'http://localhost:3007/api/chatapp';
  server: string = 'http://localhost:3007/uploads';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  constructor(private httpClient: HttpClient,public router: Router) { }

  
  post(user): Observable<any> {

    return this.httpClient.post(`${this.API_URL}/post/add-post`, user).pipe(
        catchError(this.handleError)
    )
  }


  SendMessage(body): Observable<any> {
    return this.httpClient.post(
      `${this.API_URL}/chat-messages/${body.senderId._id}/${body.receiverId}`,body
    ).pipe(catchError(this.handleError));
  }

  upload(file:File): Observable<any> {

    return this.httpClient.post(`${this.API_URL}/post/upload`, file).pipe(
        catchError(this.handleError)
    )
  }
  
  getPosts(): Observable<any> {

    return this.httpClient.get(`${this.API_URL}/posts`).pipe(
        catchError(this.handleError)
    )
  }


  
  GetAllMessages(senderId, receiverId): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/chat-messages/${senderId}/${receiverId}`);
  }

  MarkMessages(sender, receiver): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/receiver-messages/${sender}/${receiver}`);
  }

  MarkAllMessages(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/mark-all-messages`);
  }


  imgError(e: any) {
    e.target.src = '../assets/icon/no-image-icon.png';
}

   
  create(user): Observable<any> {

    return this.httpClient.post(`${this.API_URL}/register`, user).pipe(
        catchError(this.handleError)
    )
  }

  login(user): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/login`, user).pipe(
      catchError(this.handleError))
     
  }

  
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  logout() {
    if (localStorage.removeItem('access_token') == null) {
      this.router.navigate(['sign-in']);
    }
  }

  getUserProfile(id): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/profile/${id}`, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
