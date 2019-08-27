import * as vscode from "vscode"

export class ShowDeploys implements vscode.TreeDataProvider<vscode.TreeItem> {
  getTreeItem(
    element: vscode.TreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element
  }

  getChildren(
    element?: vscode.TreeItem
  ): vscode.ProviderResult<vscode.TreeItem[]> {
    if (element == null) {
      var item = new vscode.TreeItem("Foo")
      item.command = {
        command: "showDeploys.selectNode",
        title: "Select Node",
        arguments: [item]
      }
      return [item]
    }
    return null
  }
}
