import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { forkJoin, from, fromEvent, interval, of } from 'rxjs';
import { map, distinctUntilChanged, mergeMap, take, buffer, bufferTime, concatMap, concatWith, scan, debounce } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rxjs-operators';
  constructor(private http: HttpClient) { }
  ngOnInit() { }

  mapOperator() {
    console.clear()
    //map() operator
    console.log("RxJs Operator  map()");
    console.log("Source value 1,2,3,4,5");
    console.log("After map() executes it adds 10 to each value");
    const source = from([1, 2, 3, 4, 5]);   //It emits 1,2,3,4,5
    const example = source.pipe(map(val => val + 10));  //map transforms each value emitted by source observable, here it transforms by adding 10 to each value
    console.log("Map Output :");
    const subscribe = example.subscribe(val => console.log(val));  //map creates an new observable after transforming - Output - 11,12,13,14,15 

  }

  distinctUntilChangedOperator() {
    console.clear()
    //distinctUnitilChanged() operator
    console.log("RxJs Operator  distinctUnitlChanged()");
    console.log("Source value 1,1,2,2,3,3,4,5");
    console.log("After distinctUnitlChanged() executes it returns onlt distinct values ");
    const source$ = from([1, 1, 2, 2, 3, 3, 4, 5]);
    console.log("distinctUnitlChanged Output :");
    source$
      .pipe(distinctUntilChanged()) // It only output distinct values, based on the last emitted value
      .subscribe((val) => console.log(val)); // output: 1,2,3,4,5

  }
  forkJoinOperator() {
    console.clear()
    //when all observables complete, provide the lastemitted value from each observables
    console.log("On subscribing we get all the emitted values at a time ");
    forkJoin(
      {
        posts: this.http.get('https://jsonplaceholder.typicode.com/posts'),
        comments: this.http.get('https://jsonplaceholder.typicode.com/comments'),
        albums: this.http.get('https://jsonplaceholder.typicode.com/albums')
      }
    )
      //Output - { posts: object, comments: object, albums: array }
      .subscribe(console.log);
  }

  mergeMapOperator() {
    console.clear()

    const letters = of('a', 'b', 'c');
    const result = letters.pipe(
      mergeMap(x => interval(1000).pipe(map(i => x + i)).pipe(take(5))),  //take operator emits the first count values as observables. (Here it takes the first 5 seconds of an infinite one-second interval Observable)
    );
    result.subscribe(x => console.log(x));

    // Output :
    // a0
    // b0
    // c0
    // a1
    // b1
    // c1
    // continues to list a,b,c with respective ascending integers
  }

  bufferOperator() {
    console.clear()

    //Collects values from the past as an array, and emits that array only when another Observable emits.
    const clicks = fromEvent(document, 'click');
    const intervalEvents = interval(1000);
    const buffered = intervalEvents.pipe(buffer(clicks));
    buffered.subscribe(x => console.log(x));
    // const clicks = fromEvent(document, 'click');
    // const buffered = clicks.pipe(bufferTime(1000));
    // buffered.subscribe(x => console.log(x));

  }

  concatMapOperator() {
    //Each new inner Observable is concatenated with the previous inner Observable.
    const clicks = fromEvent(document, 'click');
    const result = clicks.pipe(
      concatMap(ev => interval(1000).pipe(take(4)))
    );
    result.subscribe(x => console.log(x));
  }

  concatWithOperator() {
    //Emits all of the values from the source observable, then, once it completes, subscribes to each observable source provided,
    const clicks = fromEvent(document, 'click')
    const moves = fromEvent(document, 'mousemove')

    clicks.pipe(
      map(() => 'click'),
      take(1),
      concatWith(moves.pipe(map(() => 'move')))
    )
      .subscribe(x => console.log(x));

  }

  debounceOperator() {
    /*debounce delays notifications emitted by the source Observable, but drops 
    previous pending delayed emissions if a new notification arrives on the source Observable*/
    const clicks = fromEvent(document, 'click');
    const result = clicks.pipe(
      scan(i => ++i, 1),
      debounce(i => interval(200 * i))
    );
    result.subscribe(x => console.log(x));
  }
}
