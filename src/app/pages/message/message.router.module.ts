

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatPage } from './chat/chat';
import { MessagePage } from './message';

const routes: Routes = [
    {
        path: '',
        component: MessagePage,
    },
    {
        path: 'chat',
        component: ChatPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MessagePageRoutingModule { }
