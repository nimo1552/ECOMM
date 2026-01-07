import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from 'src/app/Data';
import { Category } from 'src/app/Models/Category';

@Component({
  selector: 'app-seller-auth-signup',
  templateUrl: './seller-auth-signup.component.html',
  styleUrls: ['./seller-auth-signup.component.css'],
})
export class SellerAuthSignupComponent {
  name!: string;
  phone!: string;
  email!: string;
  password!: string;
  town!: string;
  city!: string;
  state!: string;
  country!: string;
  serverError: string = '';
  loginStatsus: string = 'attempting';

  constructor(private http: HttpClient, private router: Router) {
  }

  sellerSignUp() {
    const url = Data.domain + Data.auth_api + 'seller-signup';

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('phone', this.phone);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('town', this.town);
    formData.append('city', this.city);
    formData.append('state', this.state);
    formData.append('country', this.country);

    this.http.post(url, formData, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {
          console.log('receved positive response');

          const uid = jsonResponse.uid;

          if (uid != null) {
            localStorage.setItem('sellerAuthUid', uid);
            localStorage.setItem('isSeller', '1');
            this.loginStatsus = 'success';

            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);
          } else {
            const error = jsonResponse.error;
            this.serverError = error;
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }


}
