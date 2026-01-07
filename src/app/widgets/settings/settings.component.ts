import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Data } from 'src/app/Data';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  activeTab: string = 'profile';
  userData: any = {};
  isSeller: boolean = false;
  userId: string | null = null;
  message: string = '';
  msgType: string = '';

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    const sellerUid = localStorage.getItem('sellerAuthUid');
    const userUid = localStorage.getItem('userAuthUid');

    if (sellerUid) {
      this.isSeller = true;
      this.userId = sellerUid;
      this.fetchSellerData(sellerUid);
    } else if (userUid) {
      this.isSeller = false; // Even if isSeller='0', they are a user here
      this.userId = userUid;
      this.fetchUserData(userUid);
    }
  }

  fetchUserData(uid: string) {
    this.http.get(Data.fetch_user_data + uid).subscribe(
      (res: any) => {
        this.userData = res;
        // Password should not be pre-filled for security, usually
        this.userData.password = '';
      },
      err => console.error(err)
    );
  }

  fetchSellerData(uid: string) {
    this.http.get(`${Data.fetch_seller_info}?seller_id=${uid}`).subscribe(
      (res: any) => {
        this.userData = res;
        this.userData.password = '';
      },
      err => console.error(err)
    );
  }

  updateProfile() {
    const url = this.isSeller ? Data.update_seller : Data.update_user;
    const body = {
      ...this.userData,
      userId: this.userId, // For user update
      sellerId: this.userId // For seller update
    };

    this.http.put(url, body).subscribe(
      (res: any) => {
        this.message = 'Profile updated successfully!';
        this.msgType = 'success';
        // Optionally update localStorage if name changed?
      },
      (err) => {
        this.message = 'Failed to update profile.';
        this.msgType = 'error';
        console.error(err);
      }
    );
  }

  logout() {
    localStorage.removeItem('isSeller');
    localStorage.removeItem('userAuthUid');
    localStorage.removeItem('sellerAuthUid');
    window.location.reload();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }

}
