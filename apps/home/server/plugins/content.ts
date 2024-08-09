import consola from 'consola';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:beforeParse', (file) => {
    // Filter out non-markdown files
    if (!file._id?.endsWith('.md')) {
      return;
    }

    // Filter out files without body
    if (!file.body) {
      return;
    }

    // don't index readme and other general tweaks
    /* if (file._id === 'README.md') {
      file.body = '---\nnavigation: false\n---'
    }  */

    // TODO: detect origin of file and apply transformation accordingly
    const GENERATE_KEY = '<!-- CREARIS_PUBLISH -->';

    try {
      const start = Date.now();
      consola.log(`Transforming Obsidian-file ${file._id} ...`);

      if (!file.body.includes(GENERATE_KEY)) {
        return console.warn(`Could not find ${GENERATE_KEY} in ${file._id}`);
      }

      // parse and replace transformation-tokens
      const keys = ['tags', 'frontmatter', 'wikilinks', 'mark', 'callouts'];
      let parsed = file.body;

      for (const key of keys) {
        // main integration-path could follow
        // this issue: https://github.com/nuxt/content/issues/2502
        // this spec: https://github.com/syntax-tree/hast
        // for other options, see: https://github.com/awwaiid/thelackthereof/blob/8cd04743a16a9cfad82af3c6dcdb014e6fe8f979/lib/tweakMarkdown.js
        switch (key) {
          case 'tags':
            // parsed = ??
            // see:
            break;

          case 'frontmatter':
            // parsed = parsed.replace(/---\n(.*)\n---/, '')
            break;

          case 'wikilinks':
            // see: https://github.com/WiIIiam278/william278-site/blob/bdf6effedd2e6e7bb22ed60b703a41630b828309/server/plugins/wikilinks.js
            break;

          case 'mark':
            parsed = parseMarks(parsed);
            break;

          case 'callouts':
            parsed = parseCallouts(parsed);
            break;
        }
      }
      consola.log(`... parsed in ${(Date.now() - start)} milli-seconds!`);
      consola.log(parsed);
      file.body = parsed;
    } catch (err) {
      console.error('Could not parse file', err);
    }
  });
  /* disabled for now
  nitroApp.hooks.hook('content:file:afterParse', (file: ContentFile) => {
    // Filter out non-markdown files
    if (!file._id?.endsWith('.md')) {
      return
    }

    transformFile(file)
    resolveFileIcon(file)

    for (const [idx, node] of (file.body?.children || []).entries()) {
      transformGithubAlert(node)
      transformStepsList(node)
      // transformCodeGroups(idx, file.body?.children)
      // transformJSDocs(idx, file.body?.children)
    }
  }) */
});

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

// ts-expect-error incompleted types
function parseCallouts(text: string, level: number = 0) {
  consola.log('Parse callouts on level: ', level);
  consola.log(text);
  let parsed = text;

  // make sure the text ends with a newline to avoid issues with the regex
  if (!text.endsWith('\n')) {
    parsed = `${text}\n`;
  }

  // stop execution if nesting-level > 3
  if (level > 3) {
    consola.error('Callout-nesting too deep (max allowed: 3), stopping execution');
    return parsed;
  }

  // TODO: make regex 1 safer / regex 2 can evtl. be simplified (see lint-warnings)
  const findCalloutsRegex = /> (\[![^\n\]]*\][^\n]*)\n((>[^\n]*\n)*)/g; // regex documented here: https://regexr.com/83ic7
  const tag = `::${':'.repeat(level)}`;

  // Find all callouts in the markdown, extract header and body
  const callouts = parsed.matchAll(findCalloutsRegex);

  // 2. for every callout in the markdown
  for (const callout of callouts) {
    const header = parseCalloutHeader(callout[1]);
    const body = parseCalloutBody(callout[2], level);

    if (!header) {
      consola.error('Could not parse callout-header');
      continue;
    }
    const newCallout = `${tag}${header.type}\n---\ntitle: '${header.title}'${header.attributes}\n---\n\n${body}\n\n${tag}\n`;
    parsed = parsed.replace(callout[0], newCallout);
  }
  return parsed;
}

function parseCalloutHeader(header: string) {
  // 2a. parse header: type, attributes, title
  // TODO: regex should evtl. be simplified (see lint-warnings)
  // - applies the regex from here: https://regexr.com/83igh
  // const extractCalloutheaderRegex = /\[!([^\n|\]]*)\] ?([^\n\]]*)|\[!([^\n\]]*)\|([^\n]*)\]([^\n]*)/g;
  const extractCalloutheaderRegex = /\[!([^\n|\]]*)\] ?([^\n\]]*)|\[!([^\n\]]*)\|([^\n]*)\]([^\n]*)/g;

  const match = extractCalloutheaderRegex.exec(header);
  if (!match) {
    return null;
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
  const attributes: string = match[4];
  // if attributes exist, build array of key-value pairs
  if (attributes) {
    // TODO: detect potential errors in attributes
    const attributesArray = attributes.split(' ').map((attr) => {
      const [key, value] = attr.split('=');
      return { key, value };
    });
    // rewrite attributes as string with YAML-attributes
    const attributesString = attributesArray.map(attr => `\n${attr.key}: '${attr.value}'`).join('');
    return { type, title, attributes: attributesString };
  }

  return { type, title, attributes: '' };
}

function parseCalloutBody(body: string, level: number) {
  // add a newline at the beginning of the body to avoid issues with the first not matching the regex
  if (body.length > 2 && body.startsWith('> '))
    body = `\n${body}`;

  // parse body:
  // - deletion of '\n> '
  // - replacement '\n>\n' by '\n\n'
  // - replacement '>>' by '>'
  let newBody = body.replace(/\n> /g, '\n').replace(/\n>\n/g, '\n\n').replace(/>>/g, '>');
  // check if there are nested callouts and apply recursion
  // - look whether there are '\n>' in the body
  // - if so, apply recursion
  if (/> \[/.exec(newBody)) {
    newBody = parseCallouts(newBody, level + 1);
  }
  newBody = newBody.replace(/> /g, ''); // strip all leftover '>' from the body
  return newBody;
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

/* code-groups not needed for no
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
