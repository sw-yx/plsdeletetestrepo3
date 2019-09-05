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

    // Initialize treeview
    vscode.window.registerTreeDataProvider('showDeploys', new ShowDeploys(vscode.workspace.rootPath))
    vscode.commands.registerCommand('showDeploys.selectNode', (item: vscode.TreeItem) => {
      console.log(item.label)
    })
  })

  context.subscriptions.push(init)
}

// this method is called when your extension is deactivated
export function deactivate() {}
