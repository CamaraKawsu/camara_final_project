import {
  bootstrapApplication,
  provideProtractorTestingSupport,
} from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core'; // Important for standalone components
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // For forms

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Your routing configuration
import { AuthInterceptor } from './app/interceptors/auth.interceptor'; // Your custom interceptor

bootstrapApplication(AppComponent, {
  providers: [
    provideProtractorTestingSupport(),
    provideRouter(routes), // Provide your defined routes
    importProvidersFrom(HttpClientModule, ReactiveFormsModule, FormsModule), // Import necessary modules
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Provide your interceptor
  ],
}).catch((err) => console.error(err));
