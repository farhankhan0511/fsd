import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { interceptors } from './shared/Interceptors';

 // your component

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
 
  
  ],
  providers: [provideHttpClient(withInterceptors(interceptors))],
  bootstrap: [AppComponent]
})
export class AppModule { }
