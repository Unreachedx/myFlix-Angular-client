import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module'; // Import only necessary parts from AppModule
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,  // Import only browser-independent services or components
    ServerModule,
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
