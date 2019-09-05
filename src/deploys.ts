import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

export class ShowDeploys implements vscode.TreeDataProvider<vscode.TreeItem> {
  constructor(private workspaceRoot: string = '') {
    console.log('called with ' + workspaceRoot)
  }
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element
  }

  getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
    // if (element == null) {
    //   var item = new vscode.TreeItem("Foo")
    //   item.command = {
    //     command: "showDeploys.selectNode",
    //     title: "Select Node",
    //     arguments: [item]
    //   }
    //   return [item]
    // }
    // return null
    console.log('workspace root is ' + this.workspaceRoot)

    vscode.window.showInformationMessage('workspace root is ' + this.workspaceRoot)
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No dependency in empty workspace')
      return Promise.resolve([])
    }

    if (element) {
      return Promise.resolve(
        this.getDepsInPackageJson(path.join(this.workspaceRoot, 'node_modules', element.label || '', 'package.json')),
      )
    } else {
      const packageJsonPath = path.join(this.workspaceRoot, 'package.json')
      if (this.pathExists(packageJsonPath)) {
        return Promise.resolve(this.getDepsInPackageJson(packageJsonPath))
      } else {
        vscode.window.showInformationMessage('Workspace has no package.json')
        return Promise.resolve([])
      }
    }
  }

  /**
   *
   * https://github.com/microsoft/vscode-extension-samples/blob/master/tree-view-sample/src/nodeDependencies.ts
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
    if (this.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

      const toDep = (moduleName: string, version: string): Dependency => {
        if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
          return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.Collapsed)
        } else {
          return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None, {
            command: 'extension.openPackageOnNpm',
            title: '',
            arguments: [moduleName],
          })
        }
      }

      const deps = packageJson.dependencies
        ? Object.keys(packageJson.dependencies).map((dep) => toDep(dep, packageJson.dependencies[dep]))
        : []
      const devDeps = packageJson.devDependencies
        ? Object.keys(packageJson.devDependencies).map((dep) => toDep(dep, packageJson.devDependencies[dep]))
        : []
      return deps.concat(devDeps)
    } else {
      return []
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p)
    } catch (err) {
      return false
    }

    return true
  }
}

export class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
  ) {
    super(label, collapsibleState)
  }

  get tooltip(): string {
    return `${this.label}-${this.version}`
  }

  get description(): string {
    return this.version
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg'),
  }

  contextValue = 'dependency'
}
