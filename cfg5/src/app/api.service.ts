import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private rootURI = '';
  private targetURI =  '';
  private getURI = 'https://v5demo.app.reblaze.io/api/v4.0/conf/prod/backend-services';

  constructor(private http: HttpClient) { }

  getData(): Observable<any>{
	return this.http.get(this.getURI);
  }

  postOrigin(payload: any): Observable<any> {
	
	return this.http.post(this.targetURI, payload);

  }
}
