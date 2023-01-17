export const getCurrentVerse = (currentNode) => {
  let currentVerse
  const previousElementSibling = currentNode.previousElementSibling
  let prev = previousElementSibling;

  while (prev) {
    if ( prev.dataset.type === 'mark' && prev.dataset.subtype === 'verses' ) {
      currentVerse = prev.dataset.attsNumber
      break;
    }

    // Get the previous sibling
    prev = prev.previousElementSibling
  }
  if (!currentVerse) {
    const parents = [currentNode.parentElement.parentElement]
    let parent
    // eslint-disable-next-line no-cond-assign
    while ( parent = parents.pop() ) {
      for (const child of parent.children) {
        if ( child === previousElementSibling ) {
          parent = parent.parentElement
          break
        }
        if ( prev.dataset.type === 'mark' && prev.dataset.subtype === 'verses' ) {
          currentVerse = prev.dataset.attsNumber
          break
        }
        if ( child.children.length > 0 ) {
          parents.push( child )
        }
      }
    }

  }
  console.log('current verse' + currentVerse )
}