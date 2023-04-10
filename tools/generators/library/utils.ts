import { Tree, readJson, updateJson } from '@nrwl/devkit'
import { simpleGit } from 'simple-git'
export interface Schema {
  name: string
}

export function updateLibraryNgPackage(tree: Tree, schema: Schema) {
  updateJson(tree, `packages/${schema.name}/ng-package.json`, (ngPackage) => {
    ngPackage.assets = ['CHANGELOG.md', 'README.md']

    return ngPackage
  })
}

export function updateLibraryPackage(tree: Tree, schema: Schema) {
  updateJson(tree, `packages/${schema.name}/package.json`, (pkg) => {
    pkg.name = `@zupit-it/${pkg.name}`
    pkg.repository = {
      type: 'git',
      url: 'https://github.com/zupit-it/zupit-angular.git'
    }

    return pkg
  })
}

export function updateLibraryProject(tree: Tree, schema: Schema) {
  updateJson(tree, `packages/${schema.name}/project.json`, (project) => {
    project.targets = {
      build: project.targets.build,
      format: {
        executor: 'nx:run-commands',
        options: {
          commands: [
            {
              command: `npx nx format:check --projects ${schema.name}`
            }
          ],
          parallel: false
        }
      },
      lint: project.targets.lint,
      test: project.targets.test,
      release: {
        executor: '@jscutlery/semver:version',
        options: {
          preset: 'conventional',
          postTargets: [
            `${schema.name}:release:github`,
            `${schema.name}:publish`
          ],
          push: true
        }
      },
      'release:github': {
        executor: '@jscutlery/semver:github',
        options: {
          tag: '${tag}',
          notes: '${notes}'
        }
      },
      publish: {
        executor: 'ngx-deploy-npm:deploy',
        options: {
          access: 'public',
          buildTarget: 'production'
        }
      }
    }

    return project
  })
}

export function getAngularMajorVersion(tree: Tree) {
  const packageJson = readJson(tree, 'package.json')
  const angularVersion = packageJson.dependencies['@angular/core']

  return angularVersion.split('.')[0].replace(/[~^]/, '')
}

export async function commitChanges(tree: Tree, schema: Schema) {
  const git = simpleGit()
  await git.add([`packages/${schema.name}/*`, 'tsconfig.base.json'])

  await git.commit(`feat(${schema.name}): init library`)

  const version = `${getAngularMajorVersion(tree)}.0.0`
  const tag = `${schema.name}-${version}`
  const message = `chore(${schema.name}): release version ${version}`

  return git.tag(['-a', tag, '-m', message])
}
