import consola from 'consola';
import { parse } from '~/utils/parse';

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

    const PUBLISH_KEY = '<!-- PUBLISH-FROM-HERE -->';

    try {
      const start = Date.now();
      consola.log(`Transforming Obsidian-file ${file._id} ...`);

      // see #31 for more information on draft handling and publish-config
      if (!file.body.includes(PUBLISH_KEY)) {
        file.body = "\nNO PUBLISHED FILE on this path\nIf you see this message, please check the file in the Editor and add the " + PUBLISH_KEY + " to the file to publish it.";
      }

      // remove the PUBLISH_KEY and everything above it, except the frontmatter

      // TODO: find the correct regex for frontmatter
      const split = file.body.split(PUBLISH_KEY);
      consola.log(split);
      const frontmatter = split[0].match(/---\n(([^---].*)\n)*---/);
      if (frontmatter) {
        file.body = frontmatter[0] + '\n' + split[1];
      } else {
        file.body = split[1];
      }


      // validate file that no keywords are used that would confuse the parsing-results
      const rkeys = ['\n::', '<prose>', '<section>'];
      for (const key of rkeys) {
        consola.log(`Checking for reserved keyword: ${key}`);
        if (file.body.match(key)) {
          consola.error(`File ${file._id} contains reserved keyword: ${key}`);
          file.body = 'ERROR: Reserved keyword found in file: ' + key;
          return;
        };
      };
      
      const parsed = parse(file.body);      
      consola.log(`... parsed in ${(Date.now() - start)} milli-seconds!`);
      consola.log(parsed);
      file.body = parsed;
    } catch (err) {
      consola.error('Could not parse file', err);
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

