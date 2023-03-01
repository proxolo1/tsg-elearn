import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { PopoverComponent } from './@shared/popover/popover.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'profile',
      loadChildren: () =>
        import('./about/about.module').then((m) => m.AboutModule),
    },
    {path:"pop",component:PopoverComponent}
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
