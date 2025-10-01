import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { urls } from '../../shared/Urls/urlList';


export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  console.log('inside the interceptor');

  // Check if the request URL matches any of the URLs in the list
  const isExcludedUrl = urls.some((url) => req.url.includes(url) && req.method === 'GET');
  if (isExcludedUrl) {
    return next(req);
  }

  if (token) {
    console.log('inside the if token condition');
    const modifiedReq = req.clone({
      headers: req.headers.set('X-Auth-Token', token),
    });
    return next(modifiedReq);
  } else {
    console.log('Token not found, navigating to login');
    router.navigate(['/']);
    return next(req); // Optionally, you can return a request without modification or handle it differently
  }
};