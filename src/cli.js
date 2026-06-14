const path = require('path');
const minimist = require('minimist');
const { convert } = require('./converter.js');

/**
 * Parse CLI args and run conversion.
 * @param {string[]} argv
 * @returns {Promise<void>}
 */
async function cli(argv) {
  const args = minimist(argv, {
    string: ['theme', 'out'],
    boolean: ['help', 'version'],
    alias: { h: 'help', v: 'version', o: 'out', t: 'theme' },
    default: { theme: 'github' },
  });

  if (args.help) {
    printHelp();
    return;
  }
  if (args.version) {
    const pkg = require('../package.json');
    console.log(`md2pdf v${pkg.version}`);
    return;
  }

  const input = args._[0];
  if (!input) {
    throw new Error('Missing input file. Usage: md2pdf <input.md> [output.pdf]');
  }

  const inputPath = path.resolve(input);
  const outputPath = args.out
    ? path.resolve(args.out)
    : inputPath.replace(/\.md$/, '.pdf');

  await convert(inputPath, outputPath, { theme: args.theme });
  console.log(`✅ PDF written: ${outputPath}`);
}

function printHelp() {
  console.log(`Usage: md2pdf <input.md> [output.pdf]

Options:
  -o, --out <path>     Output PDF path
  -t, --theme <name>   Theme: github (default) | plain | academic
  -h, --help           Show this help
  -v, --version        Show version

Examples:
  md2pdf README.md
  md2pdf docs/foo.md -o /tmp/foo.pdf --theme=academic
`);
}

module.exports = { cli };

// Allow direct execution: `node src/cli.js file.md`
if (require.main === module) {
  cli(process.argv.slice(2)).catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
