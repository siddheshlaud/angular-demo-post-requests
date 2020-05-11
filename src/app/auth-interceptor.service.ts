import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEventType
} from "@angular/common/http";
import { tap } from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedReq = req.clone({
      headers: req.headers.append("Auth", "xyz")
    });

    // this is needed to tell Angular to continue with req with new values
    // as request returns observable we can intercept with response too
    return next.handle(modifiedReq);
  }
}
