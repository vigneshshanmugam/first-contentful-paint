# first-contentful-paint

Polyfill for measuring First Contentful Paint (FCP) on browsers
that does not support the [Paint Timing
API](https://w3c.github.io/paint-timing/).

- **401 Bytes** FCP polyfill.
- Works on all browsers Chromium, Firefox, Safari, IE, etc.

### Installation

```sh
npm install first-contentful-paint
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/first-contentful-paint/dist/first-contentful-paint.umd.js"></script>
```

You can access the library on `window.getFCP`.

### Usage

```js
import getFCP from "first-contentful-paint";

getFCP((fcpValue, node) => {
  console.log("First Contentful Paint", fcpValue);
  console.log("DOM node resposible for FCP ", fcpValue);
});
```

The easiest way to use this library only on unsupported browsers would be like this

```js
if (PerformanceObserver.supportedEntryTypes.indexOf("paint") >= 0) {
  console.log("Paint timing supported - Use Paint Timing API");
} else {
  getFCP(fcp => {
    sendToAnalytics(fcp);
  });
}
```

### API

#### getFCP(fcpValue, node)

Calculates the FCP value for the current page and calls the callback function
along with the first contentful paint value which is reported as
DOMHighResTimeStamp and DOM node responsible for the paint.

### Gotchas

- The measured value is an approximation to the actual First Contentful Paint value
  and may have a variance of +/- 10ms.
- Handles only rendering of Image/Text nodes. It does not handle replaced elements
  like Canvas, Video, Audio, Embed, Iframe, etc which might trigger FCP.
- Does not report correct metrics if the tab is backgrounded as the measurement
  relies heavily on requestAnimationFrame.
