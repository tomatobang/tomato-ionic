import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TomatoPage } from './tomato';

const routes: Routes = [
    {
        path: '',
        component: TomatoPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TomatoPageRoutingModule { }
