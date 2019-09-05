// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode'
import { ShowDeploys } from './deploys'

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  console.log('Our Netlify extension is now active!')

  // The command has been defined in the package.json file
  // The commandId parameter must match the command field in package.json
  let init = vscode.commands.registerCommand('extension.netlifyInit', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('Netlify extension successfully loaded!')

    vscode.commands.registerCommand('showDeploys.selectNode', (item: vscode.TreeItem) => {
      console.log(item.label)
    })
  })

  // Initialize treeview
  // we use workspaceFolders instead of vscode.workspace.rootPath because of
  // https://github.com/microsoft/vscode/wiki/Adopting-Multi-Root-Workspace-APIs#eliminating-rootpath
  let treeview = vscode.window.registerTreeDataProvider(
    'showDeploys',
    new ShowDeploys(vscode.workspace.workspaceFolders),
  )
  // SWYX TODO: implement workspace.onDidChangeWorkspaceFolders // https://github.com/microsoft/vscode/wiki/Adopting-Multi-Root-Workspace-APIs#eliminating-rootpath

  context.subscriptions.push(init)
  context.subscriptions.push(treeview)
}

// this method is called when your extension is deactivated
export function deactivate() {}
