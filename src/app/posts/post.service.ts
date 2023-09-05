import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";
import { map } from "rxjs/operators";
import { NonNullAssert } from "@angular/compiler";
import { response } from "express";
import { Router } from "@angular/router";
import { Form } from "@angular/forms";


@Injectable({providedIn: 'root'})
export class PostsService {
private posts: Post[] = [];
private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;       // ? separates other urls from this parameter and backticks(``) are used to add values to normal strings dynamically..
    this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts/' + queryParams)
    .pipe(map((postData) => {
    return { posts: postData.posts.map((post: {
      creator: string; /*name: string;*/
      imagePath: any; title: any; content: any; _id: any;    /// this was a problem until definition of type which i used any
}) => {
       return {
        title: post.title,
        content: post.content,
        id: post._id,
        imagePath: post.imagePath,
        creator: post.creator
       };
    }),
    maxPosts: postData.maxPosts
  };
    }))
    .subscribe((transformedPostsData) => {
      console.log(transformedPostsData);
      this.posts = transformedPostsData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostsData.maxPosts

      });
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, name: string, imagePath: string, creator: string }>(
      "http://localhost:3000/api/posts/" + id
      );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
   // postData.append("name", name);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{message: string, post: Post }>('http://localhost:3000/api/posts/', postData)
    .subscribe((responseData) => {
    this.router.navigate(["/"]);
   });
  }

updatePost(id: string, title: string, content: string, image: string | any,/* name: string*/) {    //xxxx
  let postData: Post | FormData;
  if (typeof(image) === 'object') {
    postData = new FormData();
    postData.append("id", id);
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
   // postData.append("name", name);
   }else {
    const postData: Post = {
      id: id,
      title: title,
      content: content,
      imagePath: image,
      creator: null,
     // name: name
    };
   }

   this.http
     .put("http://localhost:3000/api/posts/" + id, postData)
     .subscribe(_response => {
     this.router.navigate(["/"]);
     });
   }



  deletePost(postId: string) {
    return this.http
    .delete("http://localhost:3000/api/posts/" + postId);
  }
}
