import {
  Tree,
  formatFiles,
  installPackagesTask,
  updateJson
} from '@nrwl/devkit'
import { libraryGenerator } from '@nrwl/angular/generators'

interface Schema {
  name: string
}

export default async function (tree: Tree, schema: Schema) {
  await libraryGenerator(tree, { name: schema.name, buildable: true })
  await formatFiles(tree)

  updateNgPackage(tree, schema)
  updateProject(tree, schema)

  return () => {
    installPackagesTask(tree)
  }
}

function updateNgPackage(tree: Tree, schema: Schema) {
  updateJson(tree, `packages/${schema.name}/ng-package.json`, (ngPackage) => {
    ngPackage.assets = ['CHANGELOG.md', 'README.md']

    return ngPackage
  })
}

function updateProject(tree: Tree, schema: Schema) {
  updateJson(tree, `packages/${schema.name}/project.json`, (project) => {
    project.targets = {
      build: project.targets.build,
      format: {
        executor: 'nx:run-commands',
        options: {
          commands: [
            {
              command: `npx nx format:write --projects ${schema.name}`
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
