import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  item;

  constructor(private activatedRoute: ActivatedRoute,public authservice:AuthService,
    private modalController:ModalController) { }

  ngOnInit() {
    this.folder = this.item.title;
    console.log(this.item)
  }

  dismiss(){
    this.modalController.dismiss();
  }

}
