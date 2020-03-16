import * as vscode from 'vscode'

// todo: do stuff with netlify api!
// const NetlifyCLIUtilsCommand = require('@netlify/cli-utils')

/**
 *
 * TreeView child item for just deploys
 * will show under the TopLevelItem for Deploy
 *
 */
// todo: use html instead! https://github.com/microsoft/vscode/blob/93bb67d7efb669b4d1a7e40cd299bfefe5e85574/src/vs/workbench/contrib/extensions/browser/extensionsViews.ts#L119
export function createDeployTreeItem(deploy: Deploy) {
  const { branch, commit_ref, title: commit_msg, published_at } = deploy
  // TODO: TARA: check if branch == 'NULL', if it is 'null' it is a manual deploy
  const short_git_ref = commit_ref && commit_ref.slice(0, 6)
  const timeStamp = new Date(published_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
  const label = `${branch} @ ${short_git_ref} ${timeStamp}`
  const newItem = new vscode.TreeItem(
    label,
    vscode.TreeItemCollapsibleState.None
  );
  newItem.description = commit_msg
  newItem.contextValue = 'DeployTreeItem';
  newItem.tooltip = `This is a deploy for ${label}`
  return newItem
}

/**
 *
 * View Actions called for Deploys
 *
 */

// make sure these all show up accordingly on package.json
// annoying, right? see the docs https://code.visualstudio.com/api/extension-guides/tree-view#view-actions

// there seem to be undocumented api's to do this
// https://github.com/microsoft/vscode/blob/6581d602aa03e7b9cc51c9adb650f6cd766792d3/src/vs/workbench/contrib/extensions/browser/extensionsViewlet.ts#L88
export function registerCommands() {
  // example code https://github.com/microsoft/vscode-extension-samples/blob/12a3528bae5fd7f97c9966fba2daede8b8adde31/tree-view-sample/src/extension.ts#L18
  vscode.commands.registerCommand('netlifyTreeView.deploy.Publish', (node: any) =>
    vscode.window.showInformationMessage(`Successfully called publish on ${node.label}.`),
  )
  vscode.commands.registerCommand('netlifyTreeView.deploy.Lock', (node: any) =>
    vscode.window.showInformationMessage(`Successfully called lock on ${node.label}.`),
  )
}
