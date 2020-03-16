import * as vscode from 'vscode'
import { TreeItemWithDescription } from './shared'
import { createDeployTreeItem } from './deploys'
import { createFunctionTreeItem } from './functions'
const NetlifyCLIUtilsCommand = require('@netlify/cli-utils')

type NetlifyExtensionData = {
  deploys: Deploy[]
  netlify: NetlifyCLIData
  siteData: NetlifySiteData
  forms: NetlifyFormsData
  init(path: string): void // just so we can run cli utils
}
type NetlifyFormsData = {
  id: String
  site_id: String
  name: String
  paths: String[]
  submission_count: Number
  fields: {}[]
  created_at: String
}[]
export class NetlifyTreeView
         implements vscode.TreeDataProvider<TopLevelItem | vscode.TreeItem> {
         netlifySite?: NetlifyExtensionData;
         workspace?: vscode.WorkspaceFolder;
         constructor(
           private workspaceFolders: vscode.WorkspaceFolder[] | undefined
         ) {
           console.log('DEBUG: parsing workspaceFolders');
           console.time(); // for performance tracking... is this too slow? do we want to defer site initialization?

           // the tricky thing to deal with here is there may be multiple netlify sites in multiple workspaces
           // however this will be by far not the common use case and we shouldnt make our UI more inconvenient for that
           // we'll just pick one, and warn if we detect more than one
           if (workspaceFolders && workspaceFolders.length) {
             for (let workspace of workspaceFolders) {
               const {
                 uri: { fsPath }
               } = workspace;
               const site: NetlifyExtensionData = new NetlifyCLIUtilsCommand(); // we do this to tap into the user's existing login as well as the JS API
               // TODO: WHAT IF USER IS NOT LOGGED IN
               site.init(fsPath); // specify projectroot
               if (site.netlify.site.id) {
                 // there is an id! great, this is a linked site!
                 if (!this.netlifySite) {
                   this.workspace = workspace;
                   this.netlifySite = site;
                   break; // only have one workspace
                 } else {
                   this.warn(
                     `Multiple Netlify sites detected in multiple workspaces: 
              ${this.netlifySite.netlify.site.id} and ${site.netlify.site.id}. 
              This extension is only designed for one site for now.`
                   );
                 }
               } else {
                 // no id! not linked
                 // do nothing, for now. another workspace might have the link
               }
               this.workspace = workspace;
             }
           }
           console.timeEnd();
           console.log('DEBUG: finished parsing workspaceFolders');
         }
         getTreeItem(
           element: vscode.TreeItem
         ): vscode.TreeItem | Thenable<vscode.TreeItem> {
           return element;
         }
         async getChildren(
           element?: TopLevelItem
         ): Promise<(TopLevelItem | vscode.TreeItem)[] | null> {
           console.log('DEBUG: getting Children');
           if (!this.workspace) return null;
           /**
            *
            * Site is NOT linked
            *
            */
           if (!this.netlifySite) {
             vscode.commands.executeCommand(
               'setContext',
               'isNetlifySiteLinked',
               false
             );
             const TreeItem = new vscode.TreeItem(this.workspace.name);
             TreeItem.description = 'Not Linked to a Netlify Site';
             return [TreeItem];
           }

           /**
            *
            *
            * Site is Linked
            *
            */
           if (!element) {
             // if !element, this means we're at the top level of the tree
             const { netlify } = this.netlifySite;

             const siteId = netlify.site.id as string; // we have guaranteed that the site is link and there will be an id
             try {
               console.time();
               const [siteData, deploys, forms] = await Promise.all([
                 netlify.api.getSite({ siteId }),
                 netlify.api.listSiteDeploys({ siteId }), // array of big objects
                 netlify.api.listSiteForms({ siteId }) // array
               ]);
               this.netlifySite.siteData = siteData as NetlifySiteData;
               this.netlifySite.deploys = deploys;
               this.netlifySite.forms = forms;

               vscode.commands.registerCommand(
                 'netlifyTreeView.openToNetlify',
                 () =>
                   vscode.env.openExternal(vscode.Uri.parse(siteData.admin_url))
               );
               vscode.commands.registerCommand(
                 'netlifyTreeView.openToSite',
                 () => vscode.env.openExternal(vscode.Uri.parse(siteData.url))
               );
               vscode.commands.executeCommand(
                 'setContext',
                 'isNetlifySiteLinked',
                 true
               );

               // to get a list of api methods: `netlify api --list` in cli
               const {
                 // url,
                 // custom_domain,
                 // name,
                 updated_at,
                 // screenshot_url // could be interesting to use in future
                 // admin_url
                 published_deploy: { available_functions }
               } = siteData;
               console.log({
                 deploys: deploys.slice(0, 5),
                 siteData,
                 forms,
                 available_functions
               });
               console.timeEnd();
               const parseArr = (arr: any[]) =>
                 arr.length
                   ? vscode.TreeItemCollapsibleState.Collapsed
                   : vscode.TreeItemCollapsibleState.None; // dont show children if its 0 length
               return [
                 new TopLevelItem(
                   'Deploys',
                   updated_at,
                   vscode.TreeItemCollapsibleState.Expanded
                 ),
                 new TopLevelItem(
                   'Functions',
                   String(available_functions.length),
                   parseArr(available_functions)
                 ),
                 new TopLevelItem(
                   'Forms',
                   String(forms.length),
                   parseArr(forms)
                 ),
                 new TopLevelItem(
                   'Performance',
                   'to be done',
                   vscode.TreeItemCollapsibleState.None
                 )
               ];
             } catch (e) {
               if (e.status === 401 /* unauthorized*/) {
                 this.warn(
                   `Log in with a different account or re-link to a site you have permission for`
                 );
                 this.error(
                   `Not authorized to view the currently linked site (${siteId})`
                 );
               }
               if (e.status === 404 /* missing */) {
                 this.error(`The site this folder is linked to can't be found`);
               } else {
                 this.error(e);
               }
               var item = new vscode.TreeItem(this.workspace.name);
               item.description = 'Errored'
               return [item];
             }
           } else {
             // there WAS an `element` specified, this means not at the top level of the tree
             // delegate child handling to a function for more maintainable code
             return handleChildElements(this.netlifySite, element);
           }
         }

         private warn(str: string) {
           console.warn(str);
           vscode.window.showWarningMessage(str);
         }
         private error(str: string) {
           console.error(str);
           vscode.window.showErrorMessage(str);
         }
       }

/**
 *
 *
 * handle individual sections one step down from top level
 *
 *
 */

function handleChildElements(netlifySite: NetlifyExtensionData, element: TopLevelItem) {
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
      const functions = netlifySite.siteData.published_deploy.available_functions
      return functions.map(createFunctionTreeItem)
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
