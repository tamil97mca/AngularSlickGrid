import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { HttpClientModule } from '@angular/common/http';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomerEntryComponent } from './customer-entry/customer-entry.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import { MdePopoverModule } from '@material-extended/mde';
import { SettingsComponent } from './settings/settings.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import {MatTreeModule} from '@angular/material/tree';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { LoginComponent } from './login/login.component';
import { ImageViewerModule } from 'ngx-image-viewer';

@NgModule({
  declarations: [
    AppComponent,
    CustomerListComponent,
    CustomerEntryComponent,
    SettingsComponent,
    SidenavbarComponent,
    CustomerViewComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularSlickgridModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatChipsModule,
    MdePopoverModule,
    MatDialogModule,
    MatTabsModule,
    MatSidenavModule,
    MatTreeModule,
    ImageViewerModule.forRoot({
      btnClass: 'default', // The CSS class(es) that will apply to the buttons
      zoomFactor: 0.1, // The amount that the scale will be increased by
      containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
      wheelZoom: true, // If true, the mouse wheel can be used to zoom in
      allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
      allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
      btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
        zoomIn: 'fa fa-plus',
        zoomOut: 'fa fa-minus',
        rotateClockwise: 'fa fa-repeat',
        rotateCounterClockwise: 'fa fa-undo',
        next: 'fa fa-arrow-right',
        prev: 'fa fa-arrow-left',
        fullscreen: 'fa fa-arrows-alt',
      },
      btnShow: {
        zoomIn: true,
        zoomOut: true,
        rotateClockwise: true,
        rotateCounterClockwise: true,
        next: true,
        prev: true
      }
    })

  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
