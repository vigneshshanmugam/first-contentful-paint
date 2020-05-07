const rAF = window.requestAnimationFrame;
let callbacks = [];
let firstContentfulPaint;
let isImage = false;
let currentNode;

function getFCP(callback) {
  callbacks.push(callback);
  reportFCP();
}

function reportFCP() {
  if (firstContentfulPaint >= 0) {
    callbacks.forEach(function(callback) {
      callback(firstContentfulPaint, currentNode);
    });
    callbacks = [];
  }
}

function isPainted(node) {
  return node.offsetHeight > 0;
}

/**
 * Measure FCP only after the image is fetched
 */
function isImageCompleted() {
  if (currentNode.complete && isPainted(currentNode)) {
    firstContentfulPaint = performance.now();
    reportFCP();
  } else {
    rAF(() => isImageCompleted());
  }
}

function checkFCP() {
  const iterator = document.createNodeIterator(
    document.body,
    NodeFilter.SHOW_ALL,
    function(node) {
      if (!node) {
        return false;
      }
      /**
       * Text Node representing non-empty text, and the node must
       * be visible and opacity must not be 0
       */
      const isNonEmptyTextNode =
        node.nodeType === Node.TEXT_NODE && /[^s]/.test(node.nodeValue.trim());
      if (isNonEmptyTextNode && isPainted(node.parentNode)) {
        return isNonEmptyTextNode;
      }

      /**
       * Image node with a proper contentful image
       */
      const isContentfulImage = node.tagName === "IMG" && node.src != "";
      if (isContentfulImage) {
        isImage = true;
        return isContentfulImage;
      }

      return false;
    },
    false
  );

  currentNode = iterator.nextNode();

  if (currentNode != null) {
    if (isImage) {
      rAF(isImageCompleted);
    } else {
      rAF(() => {
        firstContentfulPaint = performance.now();
        reportFCP();
      });
    }
  } else {
    rAF(checkFCP);
  }
}

rAF(checkFCP);

export default getFCP;
