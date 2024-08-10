import consola from 'consola';
import { pascalCase, kebabCase } from 'scule'
import type { ComponentSpec } from './component-spec'
import { componentSpecs } from './component-spec'

export function parse(markdown: string) {
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

  markdown = prepareComponents(markdown);

  return markdown;
}

// -------------------
// --- beforeParse ---
// ts-expect-error incompleted types
function parseMarks(text: string) {
  consola.log('Parse marks');
  consola.log(text);
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
      consola.error('Could not parse mark');
      continue;
    }

    // remove the == from the beginning and end of the tag
    const cleantag = fulltag.substring(2, fulltag.length - 2);

    parsed = parsed.replace(mark[0], `<mark>${cleantag}</mark>`);
  }
  return parsed;
}

// transform Obsidian-style callouts into Nuxt-Content-Components

// TODO: add support for inline-Variables + reference document-yaml in component-vars
// - binding data in Markdown (inline-Variables) see here: https://content.nuxt.com/usage/markdown#binding-data-in-markdown
// - reference document-yaml > support this notation:  ::alert{:type="type"}  - see here: https://content.nuxt.com/usage/markdown#inline-method

/*
- we follow the followind callouts-specification: https://publish.obsidian.md/slrvb-docs/ITS+Theme/Callouts/Callout+-+Columns
- but change the attributes to make them vue-attributes-compatible > [!agenda|color=primary-dark variant=summary]

TAKES IN:
> [!agenda|color=primary-dark variant=summary] **Text**
> Blah
>> [!blank] Column 1
>> - Use another callout for columns
>
>> [!blank] Column 2
>> Need that singular blockquote `>` as separation between columns

RETURNS:
::agenda
----
title: **Text**
color: primary-dark
variant: summary
----
Blah
  ::blank
  ----
  title: Column 1
  ----
  - Use another callout for columns
  ::

  ::blank
  ----
  title: Column 1
  ----
  - Use another callout for columns
  ::
::
*/

function prepareComponents(markdown: string, level: number = 0, isProseOpen: boolean = false) {
  consola.log('prepareComponents on level: ', level);
  consola.log(markdown);
  let result = '';
  let indent = level + (isProseOpen ? 1 : 0);

  // stop execution if nesting-level > 3
  if (level > 5) {
    consola.error('Component-nesting too deep (max allowed: 5), stopping execution');
    return result;
  }

  // define execution-constants
  // TODO: recheck regex 1 / regex 2 can evtl. be simplified (see lint-warnings)
  const findCalloutsRegex = /> (\[!.*\].*)\n((>+.*\n)*)/g; // regex documented here: https://regexr.com/83ic7 (was: > (\[![^\n\]]*\][^\n]*)\n((>[^\n]*\n)*))
  // const startsWithCalloutRegex = /> (\[!.*\].*)\n((>+.*\n)*)/g; // regex documented here: https://regexr.com/83ic7 (was: > (\[![^\n\]]*\][^\n]*)\n((>[^\n]*\n)*))

  const tag = `::${':'.repeat(level)}`;
  const secProse = 'SectionProse';

  // track the positioning in the source / fragment
  let closeTagPos = 0;
  let openTagPos = 1;
  let calloutPos = 0;
  let calloutLength = 0;

  // add open-tag to the beginning of the output (we'll check later if it was needed)
  if (level === 0) {
    indent = 1;
    result = `${tag}${secProse}\n`;
  }

  // Find all first-level callouts in the source / fragment
  const callouts = markdown.matchAll(findCalloutsRegex); 

  // Main Loop
  for (const callout of callouts) { //header: callout[1] - body: callout[2]
    let closedProse = false;  // tracks if we temporarily closed the prose-section (but should reopen it)

    const { header, spec, error, newMarkdown } = getComponentHeader(callout[1], callout[0], markdown);

    if (newMarkdown) { markdown = newMarkdown }
    if (error) { continue }
    /* ----------------- Handle opened tags ----------------- */
    // on the doc-root before opening a new pageComponent, close the previously opened sectionProse
    // same if prose was opened
    if ((level = 0 && spec.isPageComponent) || isProseOpen) {
      // set the cursors on this callout
      calloutPos = callout.index;
      calloutLength = callout[0].length;

      // indent the pendingProse, close the tag and add it to the result, update the lineCounter
      result += processPendingProse(markdown,openTagPos, calloutPos-1, indent);
      indent -= 1;
      result += '\n' + '  '.repeat(indent) + tag + '\n\n';
      closeTagPos = calloutPos -1;
      closedProse = true;
    }
    
    /* ----------------- parse the callout-body ----------------- */
    // remove linebreaks at the beginning of the callout and extract the lines
    let sourceBody = callout[2].replace(/(\n*)./g,'');
    const lines = sourceBody.split('\n');

    // first, if image-prop accepted, we look for an image on the firstline
    if (spec.imgProp) {
      // get the first line of the callout
      // check if the first line is an image
      // if so, add it to the header

      // find images but exclude obsidian-embeds
      if (lines[0].startsWith('![') && !lines[0].startsWith('![[')) {
        const [img, ...rest] = sourceBody.split('\n');
        header.props[spec.imgProp] = img;
        sourceBody = rest.join('\n');
      }
    }

    /*
    if (spec.actionSlot) {
      // get the last line of the callout
      // check if the last line contains links
      // if so, extract them as action-slot from the body
    }
    */

    let body = '';
    
    let bodyIndent = indent + 1;
    if (spec.allowsProse) {
      // if the component allows prose, we open a prose-section
      body = `${tag}${secProse}\n`;  //obs: indentation is done in next block
      bodyIndent += 1;
    }

    if (spec.isParent || spec.allowsProse) {
      const newBodyLines = prepareComponentBody(sourceBody, level, spec).split('\n');
      body += '\n' + '  '.repeat(bodyIndent) + newBodyLines.join('\n' + '  '.repeat(bodyIndent));
    }   

/* a note on the Indentation:
it is mainly handled here, relative to the callout
sub-components add more indentation to the body, they see their callout as the root
*/

    if (spec.allowsProse) {  // close a prose-section and handle the indentation
      bodyIndent -= 1;
      body += '\n' + '  '.repeat(bodyIndent) + `${tag}${secProse}`;
    }

    // Prepare the the prose-Reopen if it was closed and adjust the indent (indent adjusted below)
    const proseReOpenLine = isProseOpen && closedProse ? '\n' + '  '.repeat(indent) + `${tag}${secProse}` : '';

    // join the header.props into a string
    const props = Object.entries(header.props).map(([key, value]) => `${key}="${value}"`).join(' ');

    // join the parts together, close the tag and reopen the prose
    const newCallout = '  '.repeat(indent) +`${tag}${header.type}{title=${header.title} ${props} ${header.attributes}}\n\n${body}\n\n` + '  '.repeat(indent) + `${tag}\n` + '  '.repeat(indent) + `${proseReOpenLine}` + '\n';
    indent = isProseOpen && closedProse ? indent + 1 : indent;
    result += newCallout
  }

  if ((level = 0) || isProseOpen) {
    const endOfLastCallout = calloutPos + calloutLength;  //if no callout was found, this will be 0
    // add the unprocessed source-content (prose) until the file-end with correct indentation
    result += processPendingProse(markdown,endOfLastCallout, markdown.length, indent);
    indent -= 1;
    result += '\n' + '  '.repeat(indent) + tag + '\n';
  }
  
  // TODO: remove empty sections and empty prose (level 0)
  return result;

}

function getComponentHeader(sourceHeader: string, sourceCallout: string, markdown: string) {
  const header = parseCalloutHeader(sourceHeader); //returns { type: '', title: '', props: {}, attributes: '' }

  /* ----------------- Validation ----------------- */
  let newMarkdown = '';
  const HeaderError = (!header || !header.type || header.type === '') ? 'Could not parse callout-header' : !ensureComponentExists(header.type) ? 'Component not found' : '';
  if (HeaderError !== '') {
    consola.error(HeaderError + ' - skipping this callout: \n', sourceCallout);
    // alter the source to prevent entering this to pendingProse later on
    if (sourceCallout.length > 7) {
      // exactly keep the lenght of the callout, but replace the content with a comment
      newMarkdown = markdown.replace(sourceCallout, '<!--' + 'X'.repeat(sourceCallout.length - 7) + '-->'); 
    } else {
      newMarkdown = markdown.replace(sourceCallout, '\n'.repeat(sourceCallout.length));
    }
    return { header, spec: {}, error: HeaderError, newMarkdown };
  } else {
    const spec = getSpec(header.type);
    return { header, spec}
  }
}

function processPendingProse(markdown: string, fromPos: number, toPos: number, indent: number) {
  // get the unprocessed source-content above the callout
  const pendingProse = markdown.substring(fromPos, toPos);
  consola.log('pendingProse: ', pendingProse);
  // indent the pendingProse, close the tag and add it to the result, update the lineCounter
  const indPendingProse = pendingProse.replace(/\n/g, `\n${'  '.repeat(indent)}`);
  return indPendingProse;
}

function parseCalloutHeader(header: string) {
  // 2a. parse header: type, attributes, title
  // TODO: regex should evtl. be simplified (see lint-warnings)
  // - applies the regex from here: https://regexr.com/83igh
  // const extractCalloutheaderRegex = /\[!([^\n|\]]*)\] ?([^\n\]]*)|\[!([^\n\]]*)\|([^\n]*)\]([^\n]*)/g;
  const extractCalloutheaderRegex = /\[!([^\n|\]]*)\] ?([^\n\]]*)|\[!([^\n\]]*)\|([^\n]*)\]([^\n]*)/g;

  const match = extractCalloutheaderRegex.exec(header);
  if (!match) {
    return { type: '', title: '', props: {}, attributes: '' };
  }
  // Variant 1 = Group1 exists
  // G1: type
  // G2: title
  // Variant 2 = Group1 empty
  // G3: type
  // G4: attributes
  // G5: title
  const type: string = (match[1] || match[3]).trim();
  const title: string = (match[2] || match[5]).trim();
  const allAttributes: string = match[4];
  // if attributes exist, build array of key-value pairs
  if (allAttributes) {
    // TODO: detect potential errors in attributes
    
    // split the attributes by ' '
    // - then extract key-value pairs to the properties-array
    // - remove the key-value pairs from the attributes
    // - return the properties-array and the concatenated remaining attributes
    
    const allAttributesArray = allAttributes.split(' ');
    const attributes = allAttributesArray.filter((attr) => !attr.includes('='));

    const propsArray = allAttributesArray.filter((attr) => attr.includes('=')).map((attr) => { 
      const [key, value] = attr.split('=');
      return { key, value };
    });

    // transform the propsArray into a props-object
    const props: { [key: string]: string } = {};
    for (const prop of propsArray) {
      props[prop.key] = prop.value;
    }

    const attributesString = attributes.join(' ');
    return { type, title, props, attributes: attributesString };
  }

  return { type, title, props: {}, attributes: '' };
}

function prepareComponentBody(body: string, level: number, spec: ComponentSpec) {
  // 2b. parse body
  // - deletion of '\n> '
  // - replacement '\n>\n' by '\n\n'
  // - replacement '>>' by '>'
  let newBody = body.replace(/\n> /g, '\n').replace(/\n>\n/g, '\n\n').replace(/>>/g, '>');
  // check if there are nested callouts and apply recursion
  // - look whether there are '\n>' in the body
  // - if so, apply recursion
  if (/> \[/.exec(newBody)) {
    if (spec.isParent) {
      newBody = prepareComponents(newBody, level + 1, spec.allowsProse)
    } else {
      // remove all nested callouts
      const findCalloutsRegex = /> (\[!.*\].*)\n((>+.*\n)*)/g;  // same as in prepareComponents
      const callouts = newBody.matchAll(findCalloutsRegex);
      for (const callout of callouts) {
        newBody = newBody.replace(callout[0], '');
      }
    }
  }
  newBody = newBody.replace(/\n> /g, '\n'); // strip all leftover '>' from the body
  return newBody;

}


// ------------------- Helpers -------------------
function getSpec(name: string): ComponentSpec {
  consola.log('component specs: ', componentSpecs[pascalCase(name)]);
  return componentSpecs[pascalCase(name)]
}

function ensureComponentExists(name: string): boolean {
  return componentSpecs[pascalCase(name)] != undefined
}

// ---------------------
// --- afterParse ---

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
