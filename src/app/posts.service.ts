import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from "@angular/common/http";

import { Post } from "./post.model";
import { map, catchError, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable()
export class PostsService {
  error: Subject<string> = new Subject<string>();
  constructor(private http: HttpClient) {}

  createAndStrorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    // Send Http request
    this.http
      .post<{ name: string }>(
        "https://angular-recipe-61972.firebaseio.com/posts.json",
        postData,
        {
          observe: 'response' //Be deafult we get extracted body. This is used to get full response object
        }
      )
      .subscribe(
        responseData => {
          console.log(responseData); // Full Response object with actual headers
          console.log(responseData.body); //Actual Body content
        },
        error => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append("print", "pretty"); //HttpParams object is immutable so needs to be assigned again
    searchParams = searchParams.append("custom", "key");
    return this.http
      .get<{ [key: string]: Post }>(
        "https://angular-recipe-61972.firebaseio.com/posts.json",
        {
          headers: new HttpHeaders({
            "Custom-Header1": "Hello",
            "Custom-Header2": "World"
          }),
          params: searchParams
        }
      )
      .pipe(
        map(responseData => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError(errorRes => {
          //Log error
          //Send to analytics
          //Generic work on errors

          //Its important to throw the error back
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http.delete(
      "https://angular-recipe-61972.firebaseio.com/posts.json",
      {
        observe: 'events',
        responseType: 'text' //By default json, we can change this using this
      }
    ).pipe(tap(
      event => {
        console.log(event);
        if(event.type === HttpEventType.Sent) {
          console.log('Http Request Sent');
        }
        if(event.type === HttpEventType.Response) {
          console.log(event.body);
        }
      }
    ));
  }
}
