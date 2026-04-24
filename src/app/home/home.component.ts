import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { Posts } from './posts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  Posts: Posts[] = [];

  constructor(private service: HomeService) { }

  ngOnInit(): void {
    this.service.getPosts().subscribe((data) => {
      this.Posts = data;
      console.log(this.Posts);
      console.log(this.Posts[0].filepath);
      console.log(this.getFileUrl(this.Posts[10].filepath));
    });
  }
  getFileName(filePath: string): string {
    return filePath.split('/').pop()!;
  }

  // isImage(filePath: string): boolean {
  //     const ext = filePath.split('.').pop()?.toLowerCase();
  //     return ext === 'png' || ext === 'jpg';
  // }
  getFileUrl(filePath: string): string | undefined {
    return this.service.getFileUrl(filePath);
  }

  isImage(fileName: string): boolean {
    return /\.(png|jpg|jpeg)$/i.test(fileName);
  }

  isAudio(fileName: string): boolean {
    return /\.mp3$/i.test(fileName);
  }

  // isText(fileName: string): boolean {
  //   return /\.txt$/i.test(fileName);
  // }
}
