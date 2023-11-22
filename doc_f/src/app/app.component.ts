import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  images: string[] = [];
  baseUrl = environment.baseUrl;
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getImages();
  }

  getImages() {
    this.http.get(this.baseUrl)
      .subscribe((images: any) => {
        this.images = images;
      });
  }

  upload(e: Event) {
    const input = e.target as HTMLInputElement;
    const {files} = input;
    if (!files?.length) return;

    const file = files.item(0)!;
    const fd = new FormData();
    fd.append('image', file);

    this.http.post(this.baseUrl, fd)
      .subscribe(_ => {
        this.getImages();
      });
  }
}
