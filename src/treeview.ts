import * as vscode from 'vscode'
import { TreeItemWithDescription } from './shared'
import { createDeployTreeItem } from './deploys'
const NetlifyCLIUtilsCommand = require('@netlify/cli-utils')

type NetlifySiteDataType = {
  workspace: vscode.WorkspaceFolder
  deploys: Deploy[]
  netlify: NetlifyCLIData
}

export class NetlifyTreeView implements vscode.TreeDataProvider<TopLevelItem | TreeItemWithDescription> {
  netlifySite?: NetlifySiteDataType
  constructor(private workspaceFolders: vscode.WorkspaceFolder[] | undefined) {
    console.log('DEBUG: parsing workspaceFolders')
    console.time() // for performance tracking... is this too slow? do we want to defer site initialization?

    // the tricky thing to deal with here is there may be multiple netlify sites in multiple workspaces
    // however this will be by far not the common use case and we shouldnt make our UI more inconvenient for that
    // we'll just pick one, and warn if we detect more than one
    if (workspaceFolders && workspaceFolders.length) {
      workspaceFolders.forEach((workspace) => {
        const {
          uri: { fsPath },
        } = workspace
        const site = new NetlifyCLIUtilsCommand() // we do this to tap into the user's existing login as well as the JS API
        // TODO: WHAT IF USER IS NOT LOGGED IN
        site.init(fsPath) // specify projectroot
        if (site.netlify.site.id) {
          // there is an id! great, this is a linked site!
          if (!this.netlifySite) {
            site.workspace = workspace
            this.netlifySite = site
          } else {
            this.warn(
              `Multiple Netlify sites detected in multiple workspaces: 
              ${this.netlifySite.netlify.site.id} and ${site.netlify.site.id}. 
              This extension is only designed for one site for now.`,
            )
          }
        }
      })
    }
    console.timeEnd()
  }
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element
  }
  async getChildren(element?: TopLevelItem): Promise<(TopLevelItem | TreeItemWithDescription)[] | null> {
    console.log('DEBUG: getting Children')
    // no site loaded, don't bother to proceed
    if (!this.netlifySite) return null
    if (!element) {
      // this means we're at the top level of the tree
      const { netlify, workspace } = this.netlifySite
      const wsName = workspace.name
      const siteId = netlify.site.id
      if (siteId) {
        try {
          console.time()
          const [siteData, deploys, forms] = await Promise.all([
            netlify.api.getSite({ siteId }),
            netlify.api.listSiteDeploys({ siteId }), // array of big objects
            netlify.api.listSiteForms({ siteId }), // array
          ])
          this.netlifySite.deploys = deploys
          // to get a list of api methods: `netlify api --list` in cli
          const {
            // url,
            // custom_domain,
            // name,
            updated_at,
            // screenshot_url // could be interesting to use in future
            // admin_url
            published_deploy: { available_functions },
          } = siteData
          console.log({ deploys: deploys.slice(0, 5), forms: forms, available_functions })
          console.timeEnd()
          const parseArr = (arr: any[]) =>
            arr.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None // dont show children if its 0 length
          return [
            new TopLevelItem('Deploys', updated_at, vscode.TreeItemCollapsibleState.Expanded),
            new TopLevelItem('Forms', String(forms.length), parseArr(forms)),
            new TopLevelItem('Performance', 'to be done', vscode.TreeItemCollapsibleState.None),
            new TopLevelItem('Functions', String(available_functions.length), parseArr(available_functions)),
          ]
        } catch (e) {
          if (e.status === 401 /* unauthorized*/) {
            this.warn(`Log in with a different account or re-link to a site you have permission for`)
            this.error(`Not authorized to view the currently linked site (${siteId})`)
          }
          if (e.status === 404 /* missing */) {
            this.error(`The site this folder is linked to can't be found`)
          } else {
            this.error(e)
          }
          var item = new TreeItemWithDescription(wsName, 'Errored')
          return [item]
        }
      } else {
        return [new TreeItemWithDescription(wsName, 'Not Linked')]
      }
    } else {
      // delegate child handling to a function for arguably more maintainable code
      return handleChildElements(this.netlifySite, element)
    }
  }

  private warn(str: string) {
    console.warn(str)
    vscode.window.showWarningMessage(str)
  }
  private error(str: string) {
    console.error(str)
    vscode.window.showErrorMessage(str)
  }
}

/**
 *
 *
 * handle individual sections one step down from top level
 *
 *
 */

function handleChildElements(netlifySite: NetlifySiteDataType, element: TopLevelItem) {
  if (element.contextValue !== 'TopLevelItem') throw new Error('you should not see this')
  switch (element.label) {
    case 'Deploys':
      const deploys = netlifySite.deploys.slice(0, 5)
      return deploys.map(createDeployTreeItem)
    case 'Forms':
      // TODO: SARAH
      return null
    case 'Performance':
      return null
    case 'Functions':
      // TODO: PHIL
      return null
    default:
      // make typescript yell at us if we add a new label and forget to handle it
      // https://basarat.gitbooks.io/typescript/docs/types/discriminated-unions.html#switch
      const _exhaustiveCheck: never = element.label
      return _exhaustiveCheck
  }
  // ultimate fallback, hope not to get here
  return null
}

type TopLevelLabels = 'Deploys' | 'Forms' | 'Functions' | 'Performance'
// we're going to have to do a lot better than this but this is an mvp
export class TopLevelItem extends vscode.TreeItem {
  constructor(
    public readonly label: TopLevelLabels,
    public readonly description: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed,
    public readonly command?: vscode.Command,
  ) {
    super(label, collapsibleState)
  }

  get tooltip(): string {
    return `TODO: Tooltip for ${this.label}`
  }

  // get description(): string {
  //   return `this description is for ${this.version}`
  // }

  // // TODO: add icons for deploys
  // iconPath = {
  //   light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
  //   dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg'),
  // }

  contextValue = 'TopLevelItem' // Docs: "If you want to show an action for specific items, you can do it by defining context of a tree item using TreeItem.contextValue and you can specify the context value for key viewItem in when expression."
}
