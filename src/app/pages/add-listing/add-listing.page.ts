import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage-angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.page.html',
  styleUrls: ['./add-listing.page.scss'],
})
export class AddListingPage implements OnInit {
  files: any  =  {}
  image: string | ArrayBuffer;
  file = []
  video = []
  v: any = {}
  fileArr = [];
  imgArr = [];
  fileObj = [];
  form: FormGroup;
  imageSrc: string | ArrayBuffer;
  itemname;price;negotiable;washroom;kitchen;
  details;title;water;beds
  fil: any;


  constructor(private toast:ToastService,
    private authservice:AuthService,
    private sanitizer: DomSanitizer,
    public fb: FormBuilder,
    private storage: Storage,
    private loading:LoadingService) { 
    this.v = {
      images:  [], images_links: []
    }
    this.files = {
      images:  []
    }
   
  }
  user = []
 async ngOnInit() {
  this.form = this.fb.group({
    avatar: [null],
    id:[''],
    username:['',[
      Validators.required,
      Validators.maxLength(150)]],
    itemname:['',[
      Validators.required,
      Validators.maxLength(150)]],
    water:['',[
      Validators.required,
      Validators.maxLength(150)]],
    price:['',[
      Validators.required,
      Validators.maxLength(150)]],
    negotiable:['',[
      Validators.required,
      Validators.maxLength(150)]],
    washroom:['',[
      Validators.required,
      Validators.maxLength(150)]],
    kitchen:['',[
      Validators.required,
      Validators.maxLength(150)]],
    details:['',[
      Validators.required,
      Validators.maxLength(150)]],
    title:['',[
      Validators.required,
      Validators.maxLength(150)]],
    beds:['',[
      Validators.required,
      Validators.maxLength(150)]]
  })
    await this.storage.create();

    this.storage.get("session_storage").then((res:any)=>{
      this.user=res
     // console.log(this.user)
      this.form.get("itemname").value == this.user['username'];
      
    })
  }

   async save(){
  
    if(this.form.get('avatar').value === null){
      return this.toast.presentToast("Please Add At Least One Image");
    }else{
    // console.log(this.form.value)

     this.form.get('username').setValue(this.user)
        this.loading.Loading();
            this.authservice.addFiles(this.form.value).subscribe((res:any)=>{
              
              if(res){
                this.loading.dismiss()
                this.toast.presentToast(res.message)
                
              }
              setTimeout(() => {
               this.loading.dismiss()
               //this.toast.presentToast(res.message)
               this.form.reset()
               }, 5000);
               console.log(res.message)
            })
          }
          
 }

   // Clean Url
   sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }


  upload(e) {
    const fileListAsArray = Array.from(e);
    fileListAsArray.forEach((item, i) => {
      const file = (e as HTMLInputElement);
      const url = URL.createObjectURL(file[i]);
      this.imgArr.push(url);
      this.fileArr.push({ item, url: url });
      console.log(this.fileArr[0].item)
    })
    this.fileArr.forEach((item) => {
      this.fileObj.push(item.item)

    })
    // Set files form control
    this.form.patchValue({
      avatar: this.fileObj
    })
    this.form.get('avatar').updateValueAndValidity()
    //console.log(this.fileObj)
    this.show != this.show
  }


   
  async getVideoCover(file, seekTo = 0.0) {
    //  console.log("getting video cover for file: ", file);
      return new Promise((resolve, reject) => {
          // load the file to a video player
          const videoPlayer = document.createElement('video');
          videoPlayer.setAttribute('src', URL.createObjectURL(file));
          videoPlayer.load();
          videoPlayer.addEventListener('error', () => {
              reject("error when loading video file");
          });
          // load metadata of the video to get video duration and dimensions
          videoPlayer.addEventListener('loadedmetadata', () => {
              // seek to user defined timestamp (in seconds) if possible
              if (videoPlayer.duration < seekTo) {
                  reject("video is too short.");
                  return;
              }
              // delay seeking or else 'seeked' event won't fire on Safari
              setTimeout(() => {
                videoPlayer.currentTime = seekTo;
              }, 200);
              // extract video thumbnail once seeking is complete
              videoPlayer.addEventListener('seeked', () => {
                //  console.log('video is now paused at %ss.', seekTo);
                  // define a canvas to have the same dimension as the video
                  const canvas = document.createElement("canvas");
                  canvas.width = videoPlayer.videoWidth;
                  canvas.height = videoPlayer.videoHeight;
                  // draw the video frame to canvas
                  const ctx = canvas.getContext("2d");
                  ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
                  // return the canvas image as a blob
                  ctx.canvas.toBlob(
                      blob => {
                          resolve(blob);
                      },
                      "image/jpeg",
                      0.75 /* quality */
                  );
              });
          });
      });
  }
  

    /**
   * 
   * when video file is selected
   */
     onFileChange(event:any)  {
  
      this.video.push(event.target.files[0]);
      const file = event.target.files[0];
  
      const reader = new FileReader();
      reader.onload = () => this.imageSrc = reader.result;
     
      reader.readAsDataURL(file);

}
   //filechanged
   fileChangeEvent(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
    this.file.push(event.target.files[i]);
    const file = event.target.files[i];

    const reader = new FileReader();
    reader.onload = () => {
      this.image=reader.result;
    }
    reader.readAsDataURL(file);
    }
    console.log(this.file)
  
}

processImage(e: any) {
  let self = this;
  for (var i = 0; i < e.target.files.length; i++) {
    let file = e.target.files[i];
    
    let reader = new FileReader();
    reader.onload = (r) => {
 self.v['images_links'] = self.v.images_links.concat(reader.result);
      self.file = self.file.concat(file); 
      this.v.images = reader.result
    }
    reader.readAsDataURL(file);
    this.files.images.push(e.target.files[i])
  };
  
  console.log(this.files.images)
} 

  show:boolean=true
  deleteImage(i: number) {
  const a = this.fileArr.indexOf(i);
  this.fileArr.splice(a,1)
 this.show = false
   
  }

  deletevideo(i: number){
    this.imageSrc = null
  }

}
