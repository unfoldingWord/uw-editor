export const getCurrentVerse = (currentNode) => {
  let currentVerse
  let prev = currentNode.previousElementSibling;

  while (prev) {
    if ( prev.dataset.type === 'mark' && prev.dataset.subtype === 'verses' ) {
      currentVerse = prev.dataset.attsNumber
      break;
    }

    // Get the previous sibling
    prev = prev.previousElementSibling
  }
  return currentVerse
}

export const getCurrentChapter = (currentNode) => {
  let currentChapter
  const accordionElement = currentNode.parentElement.closest('.MuiAccordion-root')
  if ( accordionElement ) {
    currentChapter = (Number(accordionElement.getAttribute('index')) + 1).toString()
  }
  return currentChapter
}