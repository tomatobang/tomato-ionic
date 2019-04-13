import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TomatoPage } from './tomato';
import { TomatoSettingPage } from './tomatosetting/tomatosetting';

const routes: Routes = [
    {
        path: '',
        component: TomatoPage,
    },
    {
        path: 'tomatosetting',
        component: TomatoSettingPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TomatoPageRoutingModule { }
