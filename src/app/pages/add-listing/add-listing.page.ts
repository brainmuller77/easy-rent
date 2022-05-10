import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage-angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as $ from 'jquery';

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
  imageSrc: string | ArrayBuffer;
  itemname;price;negotiable;washroom;kitchen;
  details;title;water;beds
  fil: any;


  constructor(private toast:ToastService,
    private authservice:AuthService,
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
    await this.storage.create();

    this.storage.get("session_storage").then((res:any)=>{
      this.user=res
      console.log(this.user)
      this.itemname = this.user['username'];
      
    })
  }

   async save(){
    if(this.itemname === "" && this.files.length == 0){
      this.toast.presentToast("Add a file or name")
    }else if(this.price ===""){
      this.toast.presentToast("Please Add price")
    }else if (!this.negotiable && !this.water && !this.beds && !this.title){
      this.toast.presentToast("Please enter required fields")
    }else{
     
        this.loading.Loading();
        let body = {
          username:this.user,
          item:this.itemname,
          water:this.water,
          price:this.price,
          negotiable:this.negotiable,
          washrooms:this.washroom,
          kitchen:this.kitchen,
          details:this.details,
          title:this.title,
          beds:this.beds
        }
        this.authservice.post(body).subscribe((response:any)=>{
         if(response.message==="Post created"){
           if(this.files.images.length >0){
            this.authservice.upload(this.files.images).subscribe((res:any)=>{
              console.log(res)
            })
           }
          
           this.loading.dismiss();
           console.log(response.post)
         }
  
        })
      
    }
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
    this.files.push(event.target.files[i]);
    const file = event.target.files[i];

    const reader = new FileReader();
    reader.onload = () => {
      this.v['images_links']=this.v.images_links.concat(reader.result);
    }
    reader.readAsDataURL(file);
    }
    console.log(this.files)
  
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


  deleteImage(i: number) {
   
  this.v['images'] = this.v.images.split(',').filter((img: any, a: number) => a !== i).join(',');
  
   this.v['images_links'] = this.v.images_links.filter((img: any, a: number) => a !== i); 
  }

  deletevideo(i: number){
    this.imageSrc = null
  }

}
