// Hearth & Ledger — a household budget site for the Marlowe household.
// The entry program (Node 22, standard library only). It hands the site in:
// it copies app/ and screenshots/ from beside this file into /output and
// writes /output/dossier.json with the vendored make.fun library, exactly as
// the kit's starter does. vendor/makefun-frontend.ts is the kit's copy,
// unchanged: the scorer rebuilds the dossier with its own copy and compares
// the two byte for byte.
//
// The site itself is plain static files under app/ — index.html, one
// stylesheet, and ES modules with no build step — so any static server can
// serve it, on a desktop or a phone, with no network request.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Read a file back from the output dir and assert its bytes equal the
// expected data; throws on any mismatch so a bad copy can never pass.
function verify(path, data) {
  const actual = readFileSync(path);
  if (!actual.equals(data)) {
    throw new Error(`verify failed: ${path} differs from its source`);
  }
}

// Verify every file under an output directory byte-for-byte against its
// source tree, recursing into subdirectories.
function verifyTree(srcDir, outDir) {
  for (const name of readdirSync(srcDir)) {
    const src = join(srcDir, name);
    const dst = join(outDir, name);
    if (statSync(src).isDirectory()) {
      verifyTree(src, dst);
    } else {
      verify(dst, readFileSync(src));
    }
  }
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}
verifyTree(join(here, 'app'), join(out, 'app'));
if (existsSync(join(here, 'screenshots'))) {
  verifyTree(join(here, 'screenshots'), join(out, 'screenshots'));
}

// The scorer's own caps (from the kit's reference/gate.json): only
// text_max_bytes shapes the bytes; the rest refuse an entry the scorer
// would refuse — more than 4 screenshots or one over 256 KiB, more than 993
// files and directories in app/, or more than 16 MiB of app files.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

console.log(`Hearth & Ledger handed in to ${out}`);
