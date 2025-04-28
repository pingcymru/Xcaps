const imageStripUrl = 'https://pbs.twimg.com/media/Gpo8fnVX0AAKahF?format=png&name=large';

function replaceFirstLetterWithImage(post) {
  const textContainer = post.querySelector('div[data-testid="tweetText"]');

  if (!textContainer) return;

  // Avoid processing if already injected
  if (textContainer.querySelector('.my-image-injection')) {
    return;
  }

  const originalText = textContainer.innerText || textContainer.textContent;
  if (!originalText || originalText.length === 0) {
    return;
  }

  const firstLetter = originalText.charAt(0).toLowerCase();

  if (!/[a-z]/.test(firstLetter)) {
    return;
  }

  const letterIndex = firstLetter.charCodeAt(0) - 'a'.charCodeAt(0);
  const backgroundPositionX = -letterIndex * 61;

  // Create the drop cap image
  const img = document.createElement('div');
  img.className = 'my-image-injection';
  img.style.width = '60px';
  img.style.height = '60px';
  img.style.backgroundImage = `url(${imageStripUrl})`;
  img.style.backgroundPosition = `${backgroundPositionX}px 0`;
  img.style.backgroundRepeat = 'no-repeat';
  img.style.float = 'left';
  img.style.marginRight = '3px';
  img.style.borderRadius = '6px';

  // Actually remove the first letter properly
  function removeFirstLetter(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.length > 0) {
        node.textContent = node.textContent.substring(1);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (let child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
          child.textContent = child.textContent.substring(1);
          break;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          removeFirstLetter(child);
          break;
        }
      }
    }
  }

  removeFirstLetter(textContainer);

  // Insert the image at the start
  textContainer.insertBefore(img, textContainer.firstChild);
}

// MutationObserver to monitor new posts
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        if (node.querySelectorAll) {
          node.querySelectorAll('article').forEach(post => {
            replaceFirstLetterWithImage(post);
          });
          if (node.matches('article')) {
            replaceFirstLetterWithImage(node);
          }
        }
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Run initially on page load
document.querySelectorAll('article').forEach(post => {
  replaceFirstLetterWithImage(post);
});
