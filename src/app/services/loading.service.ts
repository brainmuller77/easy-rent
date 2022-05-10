import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
msg:any
  constructor(public loadingCtrl:LoadingController, 
    public alertController: AlertController,
    public toast:ToastService) 
  {

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



