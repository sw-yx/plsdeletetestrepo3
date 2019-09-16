import * as vscode from 'vscode'

export class TreeItemWithDescription extends vscode.TreeItem {
  constructor(
    public readonly label?: string,
    public readonly description?: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed,
    public readonly command?: vscode.Command,
  ) {
    super(label || '', collapsibleState)
  }
}
