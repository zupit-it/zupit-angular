import { Tree, formatFiles, installPackagesTask } from '@nx/devkit'
import { libraryGenerator } from '@nx/angular/generators'
import {
  Schema,
  commitChanges,
  updateLibraryNgPackage,
  updateLibraryPackage,
  updateLibraryProject
} from './utils'

export default async function (tree: Tree, schema: Schema) {
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
