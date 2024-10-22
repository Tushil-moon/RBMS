import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUser, SignUpUser } from '../../Modules/Auth/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);

  /**
   * Actual api url to make request 
   */
  private readonly apiurl: string = 'https://670754c2a0e04071d229d77b.mockapi.io/users';

  /**
   * Make GET reuest to fetch user data
   * 
   * @param data user data
   * @returns user data
   */
  login(data: LoginUser): Observable<SignUpUser[]> {
    return this.http.get<SignUpUser[]>(`${this.apiurl}?email=${data.email}`);
  }

  /**
   * Make POST request to add user
   * 
   * @param data user data
   * @returns created user data
   */
  register(data: SignUpUser): Observable<SignUpUser> {
    const body = data;
    return this.http.post<SignUpUser>(this.apiurl, body);
  }

  getUser(): SignUpUser {
    const user = sessionStorage.getItem('loginUser');
    if (user) {
      return JSON.parse(user);
    } else {
      return {
        email:'',username:'',password:'',role:''
      };
    }
  }
}
