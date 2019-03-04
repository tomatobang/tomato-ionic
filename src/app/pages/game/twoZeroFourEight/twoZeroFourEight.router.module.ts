

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TwoZeroFourEightPage } from './twoZeroFourEight';

const routes: Routes = [
    {
        path: '',
        component: TwoZeroFourEightPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TwoZeroFourEightPageRoutingModule { }
