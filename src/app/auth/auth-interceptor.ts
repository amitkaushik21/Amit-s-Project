import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor( private AuthService: AuthService ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.AuthService.getToken();    //token from the authservice
    const authRequest = req.clone({
      headers: req.headers.set("authorization","Bearer " + authToken)   //bearer is added as it is a convention to add
    });
    return next.handle(authRequest);
  }
}
