import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(public loadingCtrl:LoadingController) 
  {

   }
   async presentLoading(){
    let loading = await this.loadingCtrl.create({
      message: 'Please Wait...',
      
    });
    loading.present();
     setTimeout(() => {
     loading.dismiss();
   }, 8000); 
 }
 
 async Loading(){
   let loading = await this.loadingCtrl.create({
     message: 'Please Wait...',
     
   });
   loading.present();
     
}
 
 dismiss(){
   this.loadingCtrl.dismiss();
 }
   }



