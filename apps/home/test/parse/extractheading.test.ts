import { expect, test } from 'vitest'
import { extractHeading } from '../../utils/md-renderer'

/** DESCRIPTION


*/
test('extractHeading subline', () => {
  const input = '_M16E_ **Einstiege ins Theaterspiel** ==course== Mue 19.9 - 8.12.2024 // Sonntags & Online'
  const output = {
    headline: 'Einstiege ins Theaterspiel',
    overline: null,
    subline: 'Mue 19.9 - 8.12.2024 // Sonntags & Online',
    tags: 'course',
    shortcode: 'M16E',
  }
  expect(extractHeading(input)).toStrictEqual(output)
})
