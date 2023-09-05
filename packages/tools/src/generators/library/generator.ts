import { libraryGenerator } from '@nx/angular/generators'
import {
  Tree,
  formatFiles,
  installPackagesTask,
  readJson,
  updateJson
} from '@nx/devkit'
import { simpleGit } from 'simple-git'
import { LibraryGeneratorSchema } from './schema'

export default async function (tree: Tree, schema: LibraryGeneratorSchema) {
  await libraryGenerator(tree, { name: schema.name, buildable: true })

  await updateLibraryNgPackage(tree, schema)
  await updateLibraryPackage(tree, schema)
  await updateLibraryProject(tree, schema)

  await formatFiles(tree)

  return async () => {
    await installPackagesTask(tree)
    await commitChanges(tree, schema)
  }
}

function updateLibraryNgPackage(tree: Tree, schema: LibraryGeneratorSchema) {
  updateJson(tree, `packages/${schema.name}/ng-package.json`, (ngPackage) => {
    ngPackage.assets = ['CHANGELOG.md', 'README.md']

    return ngPackage
  })
}

function updateLibraryPackage(tree: Tree, schema: LibraryGeneratorSchema) {
  updateJson(tree, `packages/${schema.name}/package.json`, (pkg) => {
    pkg.name = `@zupit-it/${pkg.name}`
    pkg.repository = {
      type: 'git',
      url: 'https://github.com/zupit-it/zupit-angular.git'
    }

    return pkg
  })
}

function updateLibraryProject(tree: Tree, schema: LibraryGeneratorSchema) {
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

function getAngularMajorVersion(tree: Tree) {
  const packageJson = readJson(tree, 'package.json')
  const angularVersion = packageJson.dependencies['@angular/core']

  return angularVersion.split('.')[0].replace(/[~^]/, '')
}

async function commitChanges(tree: Tree, schema: LibraryGeneratorSchema) {
  const git = simpleGit()
  await git.add([`packages/${schema.name}/*`, 'tsconfig.base.json'])

  await git.commit(`feat(${schema.name}): init library`)

  const version = `${getAngularMajorVersion(tree)}.0.0`
  const tag = `${schema.name}-${version}`
  const message = `chore(${schema.name}): release version ${version}`

  await git.tag(['-a', tag, '-m', message])

  await git.push()
  return git.pushTags()
}
