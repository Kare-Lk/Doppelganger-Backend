const wordsToRemoveLowerCase = [
  'model',
  'articulado',
  'kit',
  'bandai',
  'mobile',
  'suit',
  ' - ',
]

export const normalizeName = (name: string): string => {
  const phraseLowerCase = name.toLowerCase()

  const regexPattern = new RegExp(
    '\\b\\d{5}\\b|' + // expresión regular para los 5 números aleatorios al inicio del string
      '\\b(' +
      wordsToRemoveLowerCase.join('|') +
      ')\\b', // expresión regular para palabras específicas a remover
    'gi',
  )

  const result = phraseLowerCase.replace(regexPattern, '')

  /* .replace(/\b\w/g, (c) => c.toUpperCase()) - Devuelve a la capitalizacion original */

  return result
}
