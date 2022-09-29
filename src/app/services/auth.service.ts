import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //API_URL: string = 'http://localhost:3007/api/chatapp';
  //server: string = 'http://localhost:3007/uploads';
 API_URL: string = 'https://stunning-glacier-bay-40095.herokuapp.com/api/chatapp';
 server: string = 'https://stunning-glacier-bay-40095.herokuapp.com/uploads';
 // headers = new HttpHeaders().set('Content-Type', 'application/json','Authorization': `Bearer ${this.auth_token}`);
  currentUser = {};
  auth_token = localStorage.getItem('access_token');
  headers = new HttpHeaders({

    'Content-Type': 'application/json',

    'Authorization': `JWT ${this.auth_token}`

  });
  constructor(private httpClient: HttpClient,public router: Router,
    public toast:ToastService,
    public loadingCtrl:LoadingController,) { }

  
  post(user): Observable<any> {

    return this.httpClient.post(`${this.API_URL}/post/add-post`, user,{headers:this.headers}).pipe(
       // catchError(this.handleError)
       map((data: any) => {

        return data;
  
      }), catchError( error => {
        if(error.error.message){
          this.toast.presentToast(error.error.message)
        }else{
          this.toast.presentToast("Network Error:Server is down")
        }
       
        return throwError(error );
  
      })
    )
  }


  SendMessage(body): Observable<any> {
    return this.httpClient.post(
      `${this.API_URL}/chat-messages/${body.senderId._id}/${body.receiverId._id}`,body
    ).pipe(
      //catchError(this.handleError)
      map((data: any) => {

        return data;
  
      }), catchError( error => {
        if(error.error.message){
          this.toast.presentToast(error.error.message)
        }else{
          this.toast.presentToast("Network Error:Server is down")
        }
       
        return throwError(error );
  
      })
      );
  }

  upload(file): Observable<any> {

    return this.httpClient.post(`${this.API_URL}/post/upload`, file).pipe(
        catchError(this.handleError)
    )
  }

  addFiles(images: File) {
    var arr: any[] = [];
    var formData = new FormData();
    arr.push(images);
    console.log(arr)
    
    arr[0]['avatar'].forEach((item: any, i: any) => {
      formData.append('avatar', arr[0]['avatar'][i]);
    });
    formData.append('username',arr[0].username._id);
    formData.append('beds',arr[0].beds);
    formData.append('itemname',arr[0].itemname);
    formData.append('kitchen',arr[0].kitchen);
    formData.append('water',arr[0].water);
    formData.append('details',arr[0].details);
    formData.append('price',arr[0].price);
    formData.append('title',arr[0].title);
    formData.append('negotiable',arr[0].negotiable);
    formData.append('washroom',arr[0].washroom);
    return this.httpClient.post(`${this.API_URL}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
     // catchError(this.handleError)
     map((data: any) => {

      return data;

    }), catchError( error => {
      if(error.error.message){
        this.toast.presentToast(error.error.message)
      }else{
        this.toast.presentToast("Network Error:Server is down")
      }
     
      return throwError(error );

    })
    )
  }
  
  getPosts(): Observable<any> {

    return this.httpClient.get(`${this.API_URL}/posts`).pipe(
      //  catchError(this.handleError)
      map((data: any) => {

        return data;
  
      }), catchError( error => {
        if(error.error.message){
          this.toast.presentToast(error.error.message)
        }else{
          this.toast.presentToast("Network Error:Server is down")
        }
       
        return throwError(error );
  
      })
    )
  }


  
  GetAllUsers(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/users`);
  }

  GetUserById(id): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/user/${id}`);
  }

  GetUserByName(username): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/username/${username}`);
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

    return this.httpClient.post(`${this.API_URL}/register`, user)
   // .pipe(catchError(this.handleError))
   .pipe(

    map((data: any) => {

      return data;

    }), catchError( error => {
      if(error.error.message){
        this.toast.presentToast(error.error.message)
      }else{
        this.toast.presentToast("Network Error:Server is down")
      }
     
      return throwError(error );

    })
   )
  }

  login(user) {
    return this.httpClient.post<any>(`${this.API_URL}/login`, user)
    //.pipe( catchError(this.handleError)).toPromise()
    .pipe(

      map((data: any) => {

        return data;

      }), catchError( error => {
        if(error.error.message){
          this.toast.presentToast(error.error.message)
        }else{
          this.toast.presentToast("Network Error:Server is down")
        }
       
        return throwError(error );

      })

   )
     
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

  public handleError(error: HttpErrorResponse) {
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

  async presentLoading(){
    let loading = await this.loadingCtrl.create({
      message: 'Please Wait...',
      
    });
    loading.present();
     setTimeout(() => {
     loading.dismiss();
    //  this.toast.presentToast(msg)
   }, 8000); 
 }
}
