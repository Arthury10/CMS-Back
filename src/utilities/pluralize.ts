export function pluralize(word: string): string {
  const transformedWord = word

  if (transformedWord.endsWith('y')) {
    return transformedWord.replace(/y$/, 'ies')
  } else if (
    transformedWord.endsWith('s') ||
    transformedWord.endsWith('x') ||
    transformedWord.endsWith('z') ||
    transformedWord.endsWith('sh') ||
    transformedWord.endsWith('ch')
  ) {
    return transformedWord + 'es'
  } else {
    return transformedWord + 's'
  }
}
