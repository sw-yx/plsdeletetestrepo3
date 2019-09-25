// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode'
import { NetlifyTreeView } from './treeview'
import * as Deploys from './deploys'

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  console.log('Our Netlify extension is now active!')

  // The command has been defined in the package.json file
  // The commandId parameter must match the command field in package.json
  let init = vscode.commands.registerCommand('extension.netlifyInit', () => {
    // to see this run, cmd + shift + P and choose "Initialize Netlify"
    // we dont actually use this for anything real right now
    vscode.window.showInformationMessage('Netlify extension successfully loaded!')
    vscode.commands.registerCommand('netlifyTreeView.selectNode', (item: vscode.TreeItem) => {
      console.log(item.label)
    })
  })

  // initialize commands available at the top level
  // example code https://github.com/microsoft/vscode-extension-samples/blob/12a3528bae5fd7f97c9966fba2daede8b8adde31/tree-view-sample/src/extension.ts#L18
  vscode.commands.registerCommand('netlifyTreeView.sayHelloSarah', () =>
    vscode.window.showInformationMessage(`Hi Sarah!`),
  )
  vscode.commands.registerCommand('netlifyTreeView.sayHelloTara', () =>
    vscode.window.showInformationMessage(`Hi Tara!`),
  )
  vscode.commands.registerCommand('netlifyTreeView.sayHelloPhil', () =>
    vscode.window.showInformationMessage(`Hi Phil!`),
  )
  vscode.commands.registerCommand('netlifyTreeView.refreshEntry', () =>
    vscode.window.showInformationMessage(`Successfully called refresh entry.`),
  )

  // initialize commands available only inside each feature
  Deploys.registerCommands()
  // Forms.registerCommands() // todo
  // Functions.registerCommands() // todo

  // Initialize treeview
  // we use workspaceFolders instead of vscode.workspace.rootPath because of
  // https://github.com/microsoft/vscode/wiki/Adopting-Multi-Root-Workspace-APIs#eliminating-rootpath
  let treeview = vscode.window.registerTreeDataProvider(
    'netlifyTreeView',
    new NetlifyTreeView(vscode.workspace.workspaceFolders),
  )
  // SWYX TODO: implement workspace.onDidChangeWorkspaceFolders // https://github.com/microsoft/vscode/wiki/Adopting-Multi-Root-Workspace-APIs#eliminating-rootpath

  context.subscriptions.push(init)
  context.subscriptions.push(treeview)
}

// this method is called when your extension is deactivated
export function deactivate() {}
