import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AddPostComponent } from './add-post/add-post.component';
import { ChatComponent } from './chat/chat.component';
import { ModerationComponent } from './moderation/moderation.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'Home', component:HomeComponent},
  {path:'Login', component:LoginComponent},
  {path:'Register', component:RegisterComponent},
  {path:'AddPost', component:AddPostComponent},
  {path:'Chat', component:ChatComponent},
  {path:'Moderation', component:ModerationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
