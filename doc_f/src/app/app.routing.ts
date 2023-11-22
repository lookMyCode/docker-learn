import { RouterModule, Routes } from "@angular/router";
import { OneComponent } from "./one/one.component";
import { TwoComponent } from "./two/two.component";


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'one',
    pathMatch: 'full',
  },
	{
    path: 'one',
    component: OneComponent,
  },
  {
    path: 'two',
    component: TwoComponent,
  },
];

export const routing = RouterModule.forRoot(appRoutes);