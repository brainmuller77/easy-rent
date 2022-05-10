import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/services.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  register: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public service: ServicesService,
    private router: Router, 
    private toastService: ToastService,
    private loadService: LoadingService,
    private http: HttpClient,
  ) { }


  ngOnInit() {
    this.register = this.fb.group({
      firstname: this.fb.control('', [
         Validators.required,
         Validators.maxLength(150)
       ]),
       lastname: this.fb.control('', [
        Validators.required,
        Validators.maxLength(150)
      ]),
      phonenumber: this.fb.control('', [
         Validators.required,
         Validators.maxLength(150)
       ]),
       username: this.fb.control('', [
         Validators.required,
         Validators.maxLength(150)
       ]),
       email: this.fb.control('', [
         Validators.required,
         Validators.email
       ]),
       password: this.fb.control('', [
         Validators.required,
         Validators.minLength(6),
         Validators.maxLength(150)
       ]),
       password_confirm: this.fb.control('', [
         Validators.required,
         Validators.minLength(6),
         Validators.maxLength(150)
       ])
     }, {
       validators: this.passwordConfirmMatchValidator
     });
   }
 
   passwordConfirmMatchValidator(g: FormGroup) {
     const password = g.get('password');
     const passwordConfirm = g.get('password_confirm');
 
     if (passwordConfirm.hasError('required') || passwordConfirm.hasError('minlength')) { return; }
 
     if (password.value !== passwordConfirm.value) {
       passwordConfirm.setErrors({
         mismatch: true
       });
     } else {
       passwordConfirm.setErrors(null);
     }
   }

   registerUser() {
   /*  this.service.post(this.register.value,"register").subscribe((res:any)=>{
      console.log(res)
    }) */
    this.loadService.presentLoading();
    this.authService.create(this.register.value).subscribe((res) => {
      if (res.message==="User created successfully") {
        this.loadService.dismiss()
        this.register.reset();
        this.router.navigate(['sign-in']);
      }else{
        this.toastService.presentToast(res.message);
        this.loadService.alert("Error",res.message)
        this.loadService.dismiss()
      }
    })
 }

}
