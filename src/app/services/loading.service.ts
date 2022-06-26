import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { any } from 'joi';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
msg:any
  constructor(public loadingCtrl:LoadingController, 
    public authservice:AuthService,
    public alertController: AlertController,
    public toast:ToastService) 
  {
    this.msg = authservice.handleError
   }
   async presentLoading(){
    let loading = await this.loadingCtrl.create({
      message: 'Please Wait...',
      
    });
    loading.present();
     setTimeout(() => {
     loading.dismiss();
      this.toast.presentToast(this.msg)
   }, 8000); 
 }

 async alert(header,message){
   
  this.alertController.create({
    header: header,
   
    message: message,
    buttons: [
      {
        text: 'OKAY',
      },
      {
        text: 'CANCEL',
      }
    ]
  }).then(res => {
    res.present();
  });
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



