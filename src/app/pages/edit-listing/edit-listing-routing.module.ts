import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditListingPage } from './edit-listing.page';

const routes: Routes = [
  {
    path: '',
    component: EditListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditListingPageRoutingModule {}
