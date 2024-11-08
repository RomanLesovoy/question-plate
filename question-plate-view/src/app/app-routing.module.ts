import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { NotAuthGuard } from './auth/guards/notAuth.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [NotAuthGuard]
  },
  {
    path: 'user',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'questions',
        title: 'Quiz',
        loadChildren: () => import('./questions/questions.module').then(m => m.QuestionsModule)
      },
      {
        path: 'profile',
        title: 'Profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: '',
        redirectTo: 'questions',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
