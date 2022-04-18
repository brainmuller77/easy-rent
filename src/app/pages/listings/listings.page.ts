import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.page.html',
  styleUrls: ['./listings.page.scss'],
})
export class ListingsPage implements OnInit {
  loading:boolean = true
  content = []
  constructor() { }

  ngOnInit() {
    this.loading=false
  }

}
