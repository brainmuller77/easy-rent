import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ServicesService } from 'src/app/services.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  login: FormGroup;
  hide : boolean = true;
  ismyTextFieldType;
  currentUser: any;
  constructor(
    private fb: FormBuilder,
    private router: Router, 
    public authService: AuthService,
    private toastService: ToastService,
    private loadService: LoadingService,
    private storage: Storage,
    private serveservice: ServicesService,
   
  ) { }

  async ngOnInit(){
    this.login = this.fb.group({
      logUsername: this.fb.control('', [
        Validators.required,
        
      ]),
      logPassword: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(150)
      ])
    });
  await this.storage.create();
    }

    onlogin() {
      
      this.loadService.presentLoading();

      this.authService.login(this.login.value).subscribe((res: any) => {
      
      if(res['message']==="Login successful"){
        this.loadService.dismiss()
        this.toastService.presentToast("Login Success");
        localStorage.setItem('access_token', res.token)
        this.storage.set('user', res.token)
          this.storage.set('session_storage',res.user);
          this.router.navigate(['listings']);
       // })
    
      }else{
        this.toastService.presentToast(""+res['message'])
      }
      if(!res){
        this.loadService.alert(this.authService.handleError,this.authService.handleError(res));
      
      }

    })

}
}
