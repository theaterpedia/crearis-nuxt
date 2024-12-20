/**
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

  const overline = restContent.startsWith('**') ? null : !simple ? restContent.split('**')[0] : null
  const subline = !simple && !overline && restContent.startsWith('**') ? restContent.split('**')[2] : null

  return { headline, overline, subline, tags, shortcode }
}

/**
 * @param content (basic markdown)
 * @param hlevel (1-5) represents the heading level if first line is a heading
 * @returns { headline, overline, subline, tags, shortcode }
 * @description renders multiline or single line markdown content
 * to basic html to be processed by prose, supports only:
 * - headings
 * - paragraphs, plain text
 * - lists (with catalog-functionality)
 * - bold, italic, underline
 */
export function renderMdProp(content: string, htag: string = 'h3') {
  // get lines
  if (!content) return ''
  const lines = content.split('\n')
  var heading = ''
  var body = ''
  // check if first line is a heading
  if (lines[0].startsWith('#')) {
    // render as heading
    heading = lines[0].replace(/#*/g, '').trim()
    // remove first line
    lines.shift()
  } else {
    // render as paragraph
    body = `<p>${content}</p>\n`
  }
  for (let i = 1; i < lines.length; i++) {
    // check if line is a list
    if (lines[i].startsWith('- ')) {
      // render as list
      if (i === 1 || !lines[i - 1].startsWith('- ')) {
        body += `<ul>\n`
      }
      body += `<li>${lines[i].replace('- ', '')}</li>\n`
      if (i === lines.length - 1 || !lines[i + 1].startsWith('- ')) {
        body += `</ul>\n`
      }
    } else {
      // render as paragraph
      body += `<p>${lines[i]}</p>\n`
    }
  }
  // replace bold, italic
  body = body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  body = body.replace(/\_(.*?)\_/g, '<em>$1</em>')

  return (heading ? `<Heading is="${htag}" content="${heading}" />\n` : '') + body
}
