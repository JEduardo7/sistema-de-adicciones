import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  /*
   * El login no necesita token.
   * Esto evita que un token antiguo interfiera
   * con un nuevo inicio de sesión.
   */
  if (req.url.includes('/api/auth/login')) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (token) {

    const solicitud = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(solicitud);
  }

  return next(req);
};
