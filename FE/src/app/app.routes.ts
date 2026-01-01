import { Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { StoryComponent } from './story/story.component';
import { TaskComponent } from './task/task.component';
import { ProjectComponent } from './project/project.component';
import { KanbanViewComponent } from './kanban-view/kanban-view.component';
import { CardComponent } from './card/card.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'board', component: BoardComponent
    },
    {
        path: 'story', component: StoryComponent
    },
    {
        path: 'story/:id', component: StoryComponent
    },
    {
        path: 'task', component: TaskComponent
    },
    {
        path: 'project',component: ProjectComponent
    },
    {
        path: 'kanban-view', component: KanbanViewComponent
    },
    {
        path: 'card', component: CardComponent
    },
    {
        path: 'profile', component: ProfileComponent
    },
    {
        path: 'user',component: UserComponent
    },
    {
        path: 'app', component: AppComponent
    },
    {
        path: 'home', component: HomeComponent
    }
];
