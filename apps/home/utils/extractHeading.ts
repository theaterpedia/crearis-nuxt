/**
 *
 * @param content
 * @returns { headline, overline, subline, tags, shortcode }
 * @description ...
 */
export function extractHeading(content: string) {
  if (!content) return { headline: '', overline: '', subline: '', tags: '', shortcode: '' }
  var restContent = content.trim()
  var shortcode = restContent.startsWith('_') ? restContent.split('_ ')[0] : null
  if (shortcode) {
    restContent = restContent.replace(`${shortcode}_ `, '').trim()
    shortcode = shortcode.replace('_', '').trim()
  }

  var tags = restContent.match(/(==.*==)/g) ? restContent.split('==')[1] : null
  if (tags) {
    restContent = restContent.replace(` ==${tags}== `, '').trim()
    tags = tags.replace('==', '').trim()
  }

  const simple = restContent.match(/(\*\*.*\*\*)/g) ? false : true
  const headline = simple ? restContent : restContent.split('**')[1]

  const overline = !simple && restContent.startsWith('**') ? null : restContent.split('**')[0]
  const subline = !simple && !overline && restContent.startsWith('**') ? restContent.split('**')[2] : null

  return { headline, overline, subline, tags, shortcode }
}
