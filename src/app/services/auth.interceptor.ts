import { HttpInterceptorFn } from '@angular/common/http';

//Servicio que sirve para interceptar las llamadas a la api
//Y así pasar el token de autentificación por ellas
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  return next(req);
};
