
const fs = require("fs")
const path = require("path")
const { argv } = require("process")

const projectRoot = argv[2] || path.join(__dirname, "..")

const packageJSON = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"))
packageJSON.devDependencies = Object.assign(packageJSON.devDependencies, {
  "svelte-check": "^1.0.0",
  "svelte-preprocess": "^4.0.0",
  "@rollup/plugin-typescript": "^4.0.0",
  "typescript": "^3.9.3",
  "tslib": "^2.0.0",
  "@tsconfig/svelte": "^1.0.0"
})

packageJSON.scripts = Object.assign(packageJSON.scripts, {
  "validate": "svelte-check"
})

fs.writeFileSync(path.join(projectRoot, "package.json"), JSON.stringify(packageJSON, null, "  "))

const beforeMainJSPath = path.join(projectRoot, "src", "main.js")
const afterMainTSPath = path.join(projectRoot, "src", "main.ts")
fs.renameSync(beforeMainJSPath, afterMainTSPath)

const appSveltePath = path.join(projectRoot, "src", "App.svelte")
let appFile = fs.readFileSync(appSveltePath, "utf8")
appFile = appFile.replace("<script>", '<script lang="ts">')
appFile = appFile.replace("export let name;", 'export let name: string;')
fs.writeFileSync(appSveltePath, appFile)

const rollupConfigPath = path.join(projectRoot, "rollup.config.js")
let rollupConfig = fs.readFileSync(rollupConfigPath, "utf8")

rollupConfig = rollupConfig.replace(`'rollup-plugin-terser';`, `'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';`)

rollupConfig = rollupConfig.replace(`'src/main.js'`, `'src/main.ts'`)

let foundCSS = false
let match

const configEditor = new RegExp(/css:.|\n*}/gmi)
while (( match = configEditor.exec(rollupConfig)) != null) {
  if (foundCSS) {
    const endOfCSSIndex = match.index + 1
    rollupConfig = rollupConfig.slice(0, endOfCSSIndex) + ",\n			preprocess: sveltePreprocess()," + rollupConfig.slice(endOfCSSIndex);
    break
  }
  if (match[0].includes("css:")) foundCSS = true
}


// Add TypeScript
rollupConfig = rollupConfig.replace("commonjs(),", 'commonjs(),\n\t\ttypescript({ sourceMap: !production }),')
fs.writeFileSync(rollupConfigPath, rollupConfig)

// Add TSConfig
const tsconfig = `{
  "extends": "@tsconfig/svelte/tsconfig.json",

  "include": ["src/**/*"],
  "exclude": ["node_modules/*", "__sapper__/*", "public/*"],
}`
const tsconfigPath =  path.join(projectRoot, "tsconfig.json")
fs.writeFileSync(tsconfigPath, tsconfig)

// Delete this script, but not during testing
if (!argv[2]) {
  // Remove the script
  fs.unlinkSync(path.join(__filename))

  // Check for Mac's DS_store file, and if it's the only one left remove it
  const remainingFiles = fs.readdirSync(path.join(__dirname))
  if (remainingFiles.length === 1 && remainingFiles[0] === '.DS_store') {
    fs.unlinkSync(path.join(__dirname, '.DS_store'))
  }

  // Check if the scripts folder is empty
  if (fs.readdirSync(path.join(__dirname)).length === 0) {
    // Remove the scripts folder
    fs.rmdirSync(path.join(__dirname))
  }
}

// Adds the extension recommendation
fs.mkdirSync(path.join(projectRoot, ".vscode"))
fs.writeFileSync(path.join(projectRoot, ".vscode", "extensions.json"), `{
  "recommendations": ["svelte.svelte-vscode"]
}
`)

console.log("Converted to TypeScript.")

if (fs.existsSync(path.join(projectRoot, "node_modules"))) {
  console.log("\nYou will need to re-run your dependency manager to get started.")
}
