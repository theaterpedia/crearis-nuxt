import consola from 'consola';
import { pascalCase, kebabCase } from 'scule'
import type { ComponentSpec, ComponentName, AlertComponent } from './component-spec'
import { componentSpecs } from './component-spec'
const logVerbose = true;

/**
 * 
 * @param markdown 
 * @returns string
 * @description has dual logging capabilities,
 * with logVerbose = true, it logs all steps of the parsing process via console.log
 * optimized to work in conjunction with vitest/ui
 */
export function parse(markdown: string, fileTitle: string = ''): { result: string, messages: string } {
  // parse and replace transformation-tokens and at the end process callouts to components

  // clear whitespace from empty lines
  markdown = markdown.replace(/\n([^\S\n]+)\n/g, '\n\n');      // otherwise use https://regexr.com/84ibg

  // make sure the text ends with a newline to avoid issues with some regex
  if (!markdown.endsWith('\n')) {
    markdown = `${markdown}\n`;
  }

  // reduce all occurences with >2 newlines to only 2 newlines
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  // list tokes to parse
  const keys = ['tags', 'frontmatter', 'wikilinks', 'mark', 'embed', 'tab', 'vars'];

  if (logVerbose) console.log('###### Verbose Log #######');

  for (const key of keys) {
    // main integration-path could follow
    // this issue: https://github.com/nuxt/content/issues/2502
    // this spec: https://github.com/syntax-tree/hast
    // for other options, see: https://github.com/awwaiid/thelackthereof/blob/8cd04743a16a9cfad82af3c6dcdb014e6fe8f979/lib/tweakMarkdown.js
    switch (key) {
      case 'tags':
        // 
        // see:
        break;

      case 'frontmatter':
        // 
        break;

      case 'wikilinks':
        // see: https://github.com/WiIIiam278/william278-site/blob/bdf6effedd2e6e7bb22ed60b703a41630b828309/server/plugins/wikilinks.js
        break;

      case 'mark':
        markdown = parseMarks(markdown);
        break;

      case 'embed':
        // Todo: implement embeds
        break;

      case 'tab':
        // Todo: implement tabs
        break;

      case 'vars':
        // Todo: implement meta-bind inline-vars
        break;
    }
  }

  const tags:Set<string> = new Set()

  const {result, messages } = createMDC(markdown, 0, 0, true, true, fileTitle);

  return {result, messages };
}

// -------------------
// --- beforeParse ---
// ts-expect-error incompleted types
function parseMarks(text: string) {
  if (logVerbose) console.log('Parse marks');
  let parsed = text;

  // make sure the text ends with a newline to avoid issues with the regex
  if (!text.endsWith('\n')) {
    parsed = `${text}\n`;
  }

  // TODO: make regex find all marks
  // even if they are terminated by a double newline
  // or span a newline
  // or include a single '='
  const findMarksRegex = /(==[^\n ][^\n=]*[^ ]==)/g; // regex documented here: https://regexr.com/848bn

  // Find all callouts in the markdown, extract header and body
  const marks = parsed.matchAll(findMarksRegex);

  // 2. for every callout in the markdown
  for (const mark of marks) {
    const fulltag = mark[1];

    if (!fulltag) {
      consola.error('Could not parse mark', mark[0]);
      if (logVerbose) console.log('Could not parse mark here:', marks);
      continue;
    }

    // remove the == from the beginning and end of the tag
    const cleantag = fulltag.substring(2, fulltag.length - 2);

    parsed = parsed.replace(mark[0], `<mark>${cleantag}</mark>`);
  }
  return parsed;
}

/** 
 * @description
 * #### transform Obsidian-style callouts into Nuxt-Content-Components
 * - we follow **[this callouts-specification](https://publish.obsidian.md/slrvb-docs/ITS+Theme/Callouts/Callout+-+Columns)**
 * but extend the props to make them vue-props-compatible > [!agenda|color=primary-dark variant=summary]
* - single-word props [!agenda|.dark providesCards] are allowed, they are used for classes (.dark) and boolean-props (providesCards=true) 
* - binding-notation is allowed [!agenda|:color=theme.colour :id=summary] and targets the YAML-entries of the md-doc > further processing has to be done in the component 
 * (we will further specify this in the test-files)
 * - nested callouts are allowed 5 levels deep
 * - detailed Specification, Tasks and Issues are handled within the test-files
 * - verbose-logging to console.log optimized to work in conjunction with vitest/ui
*/
function createMDC(mdBody: string, level: number = 0, addIndent = 0, openProse: boolean = true, parseCallouts: boolean=true, messageTitle: string = ''): {result: string, messages: string } {

  if (logVerbose) console.log('[PARSE] ################ createMDC on level: ', level);
  if (logVerbose) console.log('(recieved this source-md)\n', mdBody);
  const componentList: string [] = []; // for reporting only
  let result = '';

  if (level === 0 && !openProse) {
    // raise error 'not implemented yet'
    consola.error('[PARSE] ', 'level === 0 && !openProse is not implemented yet');
    return { result, messages: 'level === 0 && !openProse is not implemented yet' };
  }

  // collect shortened Parsing-Messages for stats-like Summary
  let messages = '';

  // stop execution if nesting-level > 3
  if (level > 4) {
    messages += 'Component-nesting too deep (max allowed: 4), stopping execution'
    consola.error('[PARSE] ', messages);
    return { result, messages };
  }

  const indent = addIndent + level;

  const mdcTag = `::${':'.repeat(indent)}`;
  const tags = new Set<string>();

  // track the positioning in the source / fragment
  let calloutCursor = 0;

  const mdLines = mdBody.split('\n');

  // add open-tag to the beginning of the output (we'll check later if it was needed)
  if (level === 0 || openProse) {
    if (isProseOnTheRoad (mdLines, 0)) {
      const otag = level === 0 ? 'section-prose' : 'prose';
      result += '  '.repeat(indent) + `${mdcTag}${otag}\n`;
      tags.add(otag);
      messages += `${messageTitle.toUpperCase}: ${mdLines.length} Lines\n`
    }
  }

  // Find all first-level callouts in the source / fragment
  while (calloutCursor < mdLines.length) {
    const line = mdLines[calloutCursor];
    if (line.startsWith('> [!')) {
      const callout = findCallout(mdLines, calloutCursor);

      // if we DON'T have a valid callout OR are NOT allowed to parse it, we report a detailed error
      const comp = callout ? (parseCallouts ? evalCompHeader(callout.header) : { error: `On Level ${level} Callouts found but not allowed`}) : { error: `Callout-signature found ('> [! ...') but seems valid callout`};
      
      if (comp.header && comp.spec) { // ELSE: we have errors, skip this callout
        let { body, lines } = callout;
        let { type, props, flags } = comp.header;
        const spec = comp.spec;

        // report the component to the list of components (messaging)
        componentList.push('  '.repeat(level) + type);

        if (spec.beforeParseExtension) {
          // run a component-specific extension
          // before the body-transformation
          ({ body, props, flags} = beforeParseExtension(type, body, props, flags));
        }
    
        // first, if image-prop accepted, we look for an image on the firstline
        if (spec.imgProp) {
          // get the first line of the callout
          // check if the first line is an image
          // if so, add it to the header
    
          const bodyLines = body.split('\n');
          // find images but exclude obsidian-embeds
          if (bodyLines[0].startsWith('![') && !bodyLines[0].startsWith('![[')) {
            const [img, ...rest] = body.split('\n');
            props.set(spec.imgProp,img);
            body = rest.join('\n');
          }
        }

        // join the props into a string
        const propstring = Object.entries(props).map(([key, value]) => `${key}="${value}"`).join(' ');

        // ----------- finished header-parsing, now we handle the tags -----------

        // close prose or section-prose if open
        if (level === 0 || openProse) {
          const otag = level === 0 ? 'section-prose' : 'prose';
          if (tags.has(otag)) {
            tags.delete(otag);
            result += '  '.repeat(tags.size + indent) + `${mdcTag}\n`;
          }
        }
        // open section-container (eventually close before > should not be needed)
        if (level === 0 && spec.isPageComponent) {
          if (tags.has('section-container')) {
            consola.error('[PARSE] ', 'IMPLEMENTATION-ERROR: closing unspecified section-container');
            tags.delete('section-container');
            result += '  '.repeat(tags.size + indent) + `${mdcTag}\n`;
          }
          result += '  '.repeat(tags.size + indent) + `${mdcTag}section-container\n`;
          tags.add('section-container');
        }

        // print the callout-header to the result
        result += '  '.repeat(tags.size + indent) + `${mdcTag}${type}{${propstring} ${flags}}\n`;
        tags.add(type);

        // if we have content in the callout call createMDC recursively
        if (body) {
          const { result: calloutResult, messages: calloutMessages } = createMDC(body, level, tags.size, allowsProse(spec), spec.isParent);
          result += calloutResult;
          messages += calloutMessages;
        }

        // ----------- finished body and subcomponents, now we handle the tags -----------
        result += '  '.repeat(tags.size + level) + `${mdcTag}\n`;  // close the component
        tags.delete(type);
        if (level === 0 && spec.isPageComponent) {
          if (tags.has('section-container')) {
            tags.delete('section-container');
            result += '  '.repeat(tags.size + indent) + `${mdcTag}\n`;
          }
        }

        // Eventually re-open wrapper for prose 
        //   code-dulication > see above, open prose or section-prose
        if ((level === 0 || openProse) && isProseOnTheRoad (mdLines, calloutCursor + lines)) {
          const otag = level === 0 ? 'section-prose' : 'prose';
          result += '  '.repeat(tags.size + indent) + `${mdcTag}${otag}\n`;
          tags.add(otag);
        }

        // update the cursor
        calloutCursor += lines;

      } else {
        // if we couldn't find a callout with valid header, we have an error
        result += '  '.repeat(tags.size + indent) + `<!-- ${comp.error} -->\n`;
        calloutCursor++;
      }
    } else {
      // if the line doesn't start with a callout, add it to the prose
      result += '  '.repeat(tags.size + indent) + `${line}\n`;
      calloutCursor++;
    }
  }
  messages += componentList.length > 0 ? `Components found: \n${componentList.join('\n')}\n` : '';
  return {result, messages};
}

function isProseOnTheRoad (mdLines: string[], Cursor: number) {
  // check if we have prose before the next callout in the source / fragment
  const nextCallout = mdLines.slice(Cursor).findIndex((line: string) => line.startsWith('> [!'));
  const proseEnd = nextCallout === -1 ? mdLines.length - Cursor : nextCallout -1;
  const prose = mdLines.slice(Cursor, proseEnd).join('\n');
  return proseEnd < 1 ? false : prose.replace(/\n/g, '').trim() !== '';
}

function beforeParseExtension(type: string, sourceBody: string, props: Map<string, string>, flags: string) {
  // run a component-specific extension
  // before the body-transformation
  switch (type) {

    case 'alert':
      // do something
      consola.warn('Alert-Extension not yet implemented !!!');
      return {body: sourceBody, props, flags};

    case 'catalog':
      // do something
      consola.warn('Catalog-Extension not yet implemented !!!');
      return {body: sourceBody, props, flags};

    default:
      // do something
      return {body: sourceBody, props, flags};
  }
}

export function findCallout(mdLines: string[], cursor: number) {
  const header = mdLines[cursor];
  let body = '';
  let lines = 0;

  // if the header is not a callout, return
  if (!header.startsWith('> [!')) {
    return;
  }

  // find the end of the callout
  for (let i = cursor + 1; i < mdLines.length; i++) {
    const line = mdLines[i];
    if (!line.startsWith('>')) {
      break;
    }
    // remove the '>' and eventually whitespace from the beginning of the line and add it to the body
    body += line.replace(/^> ?/, '') + '\n';
    lines++;
  }

  // strip the last newline from the body
  if (body.endsWith('\n')) {
    body = body.slice(0, -1);
  }

  // does the body contain anything else than whitespace?
  const hasBody = body.replace(/\n/g, '').trim() !== ''

  return {
    header,
    body: hasBody ? body : '',
    lines,
  };
}


/** 
@returns { header: { type: '', title: '', props: {}, flags: '' }, spec: ComponentSpec, error: '', replaceMarkdown: '' } 
*/
function evalCompHeader(sourceHeader: string): { header?: { type: string, props: Map<string, string>, flags: string }, spec?: ComponentSpec, error?: string} {
  const header = parseCalloutHeader(sourceHeader); //returns { type: '', title: '', props: Map(), flags: '' }

  /* ----------------- Validation ----------------- */
  const HeaderError = (!header || !header.type || header.type === '') ? 'Could not parse callout-header' : !ensureComponentExists(header.type) ? 'Component not found: ' + header.type : '';
  if (HeaderError !== '') {
    return { error: HeaderError };
  } else {
    const spec = getSpec(header.type);
    if (spec) {
      return { header: header, spec: spec }; 
    } else {
      consola.warn('Implementation ERROR!! ?Component not in spec?: ' + header.type)
      return { error: 'Implementation ERROR!! ?Component not in spec?: ' + header.type };
    }
  }
}

function allowsProse(spec?: ComponentSpec) {
  return spec ? ('allowsProse' in spec && spec.allowsProse) ? true : false : false;
}

function isParent(spec?: ComponentSpec) {
  return spec ? ('isParent' in spec && spec.isParent) ? true : false: false;
}

function parseCalloutHeader(header: string): { type: string, props: Map<string, string>, flags: string } {
  // 2a. parse header: type, attributes, title
  // TODO: regex should evtl. be simplified (see lint-warnings)
  // - applies the regex from here: https://regexr.com/83igh
  // const extractCalloutheaderRegex = /\[!([^\n|\]]*)\] ?([^\n\]]*)|\[!([^\n\]]*)\|([^\n]*)\]([^\n]*)/g;
  const extractCalloutheaderRegex = /\[!([^\n|\]]*)\] ?([^\n\]]*)|\[!([^\n\]]*)\|([^\n]*)\]([^\n]*)/g;
  
  // Todo: keep this in sync with the Alert-Component
  const AlertNames = ['info', 'abstract', 'summary', 'tldr', 'info', 'todo', 'tip', 'hint', 'important', 'success', 'check', 'done', 'question', 'help', 'faq', 'warning', 'fail', 'failure', 'missing', 'danger', 'error' , 'bug', 'example' , 'quote', 'cite']
  let props: Map<string, string> = new Map();

  const match = extractCalloutheaderRegex.exec(header);
  if (!match) {
    return { type: '', props: new Map(), flags: '' };
  }
  // Variant 1 = Group1 exists
  // G1: type
  // G2: title
  // Variant 2 = Group1 empty
  // G3: type
  // G4: attributes
  // G5: title
  let type: string = (match[1] || match[3]).trim();

  const title: string = (match[2] || match[5]).trim();
  const attributes: string = match[4];
  // if attributes exist, build array of key-value pairs
  if (attributes) {
    // TODO: detect potential errors in attributes
    
    const attributesArray = attributes.split(' ');
    const flags = attributesArray.filter((attr) => !attr.includes('=')).join(' ');

    const propsArray = attributesArray.filter((attr) => attr.includes('=')).map((attr) => { 
      const [key, value] = attr.split('=');
      return { key, value };
    });

    if (AlertNames.includes(type)) {
      propsArray.push({ key: 'alert-type', value: type });
      type = 'alert';
    }

    if (title.length > 0) {
      propsArray.push({ key: 'title', value: title });
    }

    if (propsArray.length === 0) {
      return { type, props, flags };
    } else {
      props = new Map(propsArray.map((propsArray) => [propsArray.key, propsArray.value]));
      return { type, props, flags };
    } 
  }
  return { type, props: new Map(), flags: '' };
}


// ------------------- Helpers -------------------
function getSpec(name: string) {
  consola.log('component specs: ', componentSpecs[pascalCase(name)]);
  const specName = pascalCase(name);
  if (Object.keys(componentSpecs).includes(specName)) {
    return componentSpecs[pascalCase(name)]
  } else { 
    return false 
  }
}

function ensureComponentExists(name: string): boolean {
  return componentSpecs[pascalCase(name)] != undefined
}

// ---------------------
// --- afterParse (copy from Nuxt.com docs-parser) ---

// --- transform github alerts ---

// Handle GitHub flavoured markdown blockquotes
// https://github.com/orgs/community/discussions/16925
function transformGithubAlert(node: ContentNode) {
  const firstChildValue = node.children?.[0]?.children?.[0]?.children?.[0]?.value || '';
  if (
    node.tag === 'blockquote' // blockquote > p x 2 > span > text
    && ['!NOTE', '!TIP', '!IMPORTANT', '!WARNING', '!CAUTION'].includes(firstChildValue)
  ) {
    node.type = 'element';
    node.tag = firstChildValue.slice(1).toLowerCase();
    node.children?.[0].children?.shift();
  }
}

// --- transform steps list ---

function transformStepsList(node: ContentNode) {
  // CONVERT OL->LI to Steps
  // TODO: Find a way to opt out of this transformation if needed within markdown.
  if (node.tag === 'ol' && (node.children?.length || 0) > 0 && node.children?.[0].tag === 'li') {
    const stepsChildren = node.children.map((li) => {
      const label = li.children?.[0]?.value ?? undefined;
      // Exclude br tags from children to avoid spacing
      const children = ((label && li.children?.slice(1)) || []).filter(child => !['br'].includes(child.tag || ''));

      return {
        type: 'element',
        tag: 'div',
        props: {
          label,
        },
        children,
      };
    });

    // For now we only check if there is at least (1) content to generate the steps..
    const stepsHaveContent = stepsChildren.some(step => step.children.length > 0);
    if (stepsHaveContent) {
      node.type = 'element';
      node.tag = 'Steps';
      node.props = {};
      node.children = stepsChildren;
    }
  }
}

// --- transform first h1 and blockquote ---

function transformFile(file: ContentFile) {
  // Remove first h1 from markdown files as it is added to front-matter as title
  if (file.body?.children?.[0]?.tag === 'h1') {
    const text = _getTextContents(file.body.children[0].children);
    if (file.title === text) {
      file.body.children.shift();
    }
  }

  // TODO: test this out from Obsidian
  // Only use the first blockquote as the description
  const firstChild = file.body?.children?.[0];
  const firstChildText = _getTextContents(firstChild?.children);
  if (firstChild?.tag === 'blockquote' && firstChildText && !firstChildText.startsWith('!')) {
    file.description = firstChildText;
    file.body?.children?.shift();
  } else {
    file.description = ''; // Avoid duplication
  }
}

// --- resolve icon ---

function resolveFileIcon(file: ContentFile) {
  if (file.icon) {
    return;
  }
  file.icon = _resolveIcon(file._path);
}

const _commonIcons = [
  {
    pattern: 'guide',
    icon: 'ph:book-open-duotone',
  },
  {
    pattern: 'components',
    icon: 'bxs:component',
  },
  {
    pattern: 'config',
    icon: 'ri:settings-3-line',
  },
  {
    pattern: 'configuration',
    icon: 'ri:settings-3-line',
  },
  {
    pattern: 'examples',
    icon: 'ph:code',
  },
  {
    pattern: 'utils',
    icon: 'ph:function-bold',
  },
];

function _resolveIcon(path: string = '') {
  // Split the path into parts and reverse it
  const paths = path.slice(1).split('/').reverse();

  // Search for icons in reverse order
  for (const p of paths) {
    for (const icon of _commonIcons) {
      if (p.includes(icon.pattern)) {
        return icon.icon;
      }
    }
  }
}

/* code-groups not needed for now
// --- transform code groups ---

function transformCodeGroups(currChildIdx: number, children: ContentNode[] = []) {
  if (!children?.length || !_isNamedCodeBlock(children[currChildIdx])) {
    return
  }

  const group: {
    idx: number
    node: ContentNode
  }[] = []

  for (let i = currChildIdx; i < children.length; i++) {
    const nextNode = children[i]
    if (!_isNamedCodeBlock(nextNode)) {
      break
    }
    group.push({ idx: i, node: nextNode })
  }

  // Replace current children with the new code group if it has two or more code blocks
  if (group.length > 1) {
    // Only  reset children if we have more than one code block
    // Code here is to avoid empty text nodes in the markdown AST
    for (const { idx } of group) {
      children[idx] = { type: 'text', value: '' }
    }

    children[currChildIdx] = {
      type: 'element',
      tag: 'CodeGroup',
      children: group.map((g) => g.node),
    }
  }
}

function _isNamedCodeBlock(children: ContentNode): boolean {
  return children?.tag === 'pre' && children?.children?.[0]?.tag === 'code' && children?.props?.filename
}

End of code-groups */

/* JSDOCs-Import not needed for no
// --- transform automd jsdocs ---

function transformJSDocs(currChildIdx: number, children: ContentNode[] = []) {
  if (!children?.length || !_isJSDocBlock(children[currChildIdx])) {
    return
  }

  const fields: ContentNode[] = []

  const generateFields = (i: number): ContentNode => {
    const name = _parseJSDocName(children[i])
    const type = _parseJSDocType(children[i + 1])

    const props: {
      name: string
      type: string | false
    } = {
      name,
      type,
    }

    const content: ContentNode[] = []

    i++

    if (type !== '') {
      children[i] = _emptyASTNode()
      i++
    }

    while (i < children.length && children[i].tag !== 'h3' && children[i].tag === 'p') {
      content.push(children[i])
      children[i] = _emptyASTNode()
      i++
    }

    return {
      type: 'element',
      tag: 'field',
      props,
      children: content,
    }
  }

  // Go through we find the correct match for all h3
  for (let i = currChildIdx; i < children.length; i++) {
    // Make sure it's a JSDoc block before generating fields
    if (_isJSDocBlock(children[i])) {
      const field = generateFields(i)
      // Double check if has description or a type to avoid empty fields
      if ((field?.children || [])?.length > 0 || field?.props?.type !== '') {
        fields.push(field)
      } else {
        // set blank text node to avoid empty text nodes in the markdown AST
        children[i] = _emptyASTNode()
      }
    }
  }

  // If no fields were generated, return early
  if (fields.length <= 0) {
    return
  }

  // Replace current children with the new field group
  children[currChildIdx] = {
    type: 'element',
    tag: 'field-group',
    children: [...fields],
  }
}

function _isJSDocBlock(children: ContentNode): boolean {
  return (
    children?.tag === 'h3' && children?.children?.[0]?.tag === 'code' && children?.children?.[0]?.type === 'element'
  )
}

function _parseJSDocName(node: ContentNode): string {
  // Code block || id prop || empty string
  return node.children?.[0]?.children?.[0]?.value || node?.props?.id || ''
}
function _parseJSDocType(node: ContentNode): string {
  const hasType = !!node?.children?.[0]?.children?.[0]?.children?.[0]?.value
  if (!hasType) {
    return ''
  }

  return node?.children?.[0]?.children?.[2]?.children?.[0]?.value || ''
}

End of JSDOCs-Import */

// --- internal utils ---

function _getTextContents(children: ContentNode[] = []): string {
  return (children || [])
    .map((child) => {
      if (child.type === 'element') {
        return _getTextContents(child.children);
      }
      return child.value;
    })
    .join('');
}

function _emptyASTNode() {
  return { type: 'text', value: '' };
}

// --- types ---

// TODO: @nuxt/content runtimes seems both not well typed and also crashes my TS server or might be doing it wrong.

interface ContentNode {
  type?: string;
  tag?: string;

  children?: ContentNode[];
  props?: Record<string, any>;
  value?: string;
}

interface ContentFile {
  _id?: string;
  _path?: string;
  icon?: string;
  description?: string;
  title?: string;
  body: {
    children?: ContentNode[];
  };
}
