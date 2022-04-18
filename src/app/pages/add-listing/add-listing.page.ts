import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.page.html',
  styleUrls: ['./add-listing.page.scss'],
})
export class AddListingPage implements OnInit {
  files: any[]  =  []
  image: string | ArrayBuffer;
  file = []
  v: any = {}


  constructor() { 
    this.v = {
      images:  [], images_links: []
    }
  }

  ngOnInit() {

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
  };
} 

deleteImage(i: number) {
   
  this.v['images'] = this.v.images.split(',').filter((img: any, a: number) => a !== i).join(',');
  
   this.v['images_links'] = this.v.images_links.filter((img: any, a: number) => a !== i); 
 }

}
