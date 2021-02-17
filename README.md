# @rslemos/http-load

Dynamically access http resources directly from angular templates.

## Installation

#### Install the npm module:

```sh
npm install @rslemos/http-load --save
```

or

```sh
yarn add @rslemos/http-load
```

#### Import the `HttpLoadModule`:

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpLoadModule } from '@rslemos/http-load';

@NgModule({
    imports: [
        BrowserModule,
        HttpLoadModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
```

## Text Example

Here is a minimal example for loading text:

(in any angular template, such as `app.component.html`)
```html
<div *rlHttpLoad.text="let loadedText from 'https://tools.ietf.org/rfc/rfc2616.txt'">
  RFC2616 content is {{loadedText}}
</div>
```


## Json Example

Here is a minimal example for loading a json object:

(in any angular template, such as `app.component.html`)
```html
<pre *rlHttpLoad.json="let loadedObject from 'https://raw.githubusercontent.com/rslemos/http-load/master/package.json'">
  {{loadedObject | json}}
</pre>
```


## Other features

### Error handling

For both text and json loading you can handle network and server errors, directing the `rlHttpLoad` directive to show an alternative angular template in case of error:

```html
<div *rlHttpLoad.text="let loadedText from 'https://tools.ietf.org/rfc/rfc2616.txt'; onError: useThisTemplateInCaseOfHttpError">
  RFC2616 content is {{loadedText}}
</div>

<ng-template #useThisTemplateInCaseOfHttpError let-errorObject let-url="rlHttpLoadFrom">
  An error occurred when trying to download from {{url}}. Please try again later.
  <pre>{{errorObject | json}}</pre>
</ng-template>
```

### Throbber

Though `rlHttpLoad` does not implement a throbber itself, it provides means to show one, by allowing you to provide another angular template to be shown right before dispatching the http request until the request resolves (either successfully, or after some error):


```html
<div *rlHttpLoad.text="let loadedText from 'https://tools.ietf.org/rfc/rfc2616.txt'; loading: throbber">
  RFC2616 content is {{loadedText}}
</div>

<ng-template #throbber let-url>
  <ngx-some-fancy-throbber></ngx-some-fancy-throbber> loading {{url}}...
</ng-template>
```
