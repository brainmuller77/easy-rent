import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditListingPageRoutingModule } from './edit-listing-routing.module';

import { EditListingPage } from './edit-listing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditListingPageRoutingModule
  ],
  declarations: [EditListingPage]
})
export class EditListingPageModule {}
