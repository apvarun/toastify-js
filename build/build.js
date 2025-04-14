const root = process.cwd();
import { join, parse } from 'path';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import esbuild from 'esbuild';
function mkdir(path) {
    return existsSync(path) || mkdirSync(path)
}
const sourcePath = join(root, 'src');
const packagePath = join(root, 'package.json');
const tsconfigPath = join(root, 'tsconfig.json');
const packageConfig = JSON.parse(readFileSync(packagePath, 'utf8'));
const tsConfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
const distPath = parse(packageConfig.main).dir;
const mainPath = join(sourcePath, `${packageConfig.name}.ts`);
const cssPath = join(sourcePath, `${packageConfig.name}-ts.css`);
mkdir(distPath);
esbuild.build({
    allowOverwrite: true,
    entryPoints: [mainPath],
    outfile: join(distPath, `${packageConfig.name}.js`),
    minify: false,
    sourcemap: true,
    platform: 'browser',
    format: 'iife',
    target: tsConfig.target,
    charset: 'utf8'
});
esbuild.build({
    allowOverwrite: true,
    entryPoints: [mainPath],
    outfile: join(distPath, `${packageConfig.name}.min.js`),
    minify: true,
    sourcemap: true,
    platform: 'browser',
    format: 'iife',
    target: tsConfig.target,
    charset: 'utf8'
});
esbuild.build({
    allowOverwrite: true,
    entryPoints: [cssPath],
    outfile: join(distPath, `${packageConfig.name}.css`),
    minify: false,
    loader: {
        '.css': 'css'
    },
    platform: 'browser',
    charset: 'utf8'
});
esbuild.build({
    allowOverwrite: true,
    entryPoints: [cssPath],
    outfile: join(distPath, `${packageConfig.name}.min.css`),
    minify: true,
    loader: {
        '.css': 'css'
    },
    platform: 'browser',
    charset: 'utf8'
});