import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateBomComponent } from './create-bom/create-bom.component';
import { HomeComponent } from './home/home.component';
import { UploadBomComponent } from './upload-bom/upload-bom.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'createbom',
    component: CreateBomComponent
  },
  {
    path: 'uploadbom',
    component: UploadBomComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
