import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { urls } from '../Urls/urlList';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Skipping token interceptor for testing');
  return next(req); // Pass the request without modification
};