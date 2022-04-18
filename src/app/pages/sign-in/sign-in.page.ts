import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  constructor(
    private fb: FormBuilder,
    private router: Router, 
    public authService: AuthService,
    private toastService: ToastService,
    private loadService: LoadingService,
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
  //  await this.storage.create();
    }

    onlogin() {
      this.authService.login(this.login.value)
    }

}
