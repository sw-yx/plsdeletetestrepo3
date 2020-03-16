# netlify-ext-setup README

Netlify DX VSCode Extension

- Repo: https://github.com/sdras/netlify-ext-setup
- Project: https://github.com/netlify/developer-experience/projects/3
- Notion: https://www.notion.so/netlify/VS-Code-Kickoff-59d1a073cad74d72b8e8038550ace917
- **Overview of Codebase (New!)**: https://www.dropbox.com/s/d8ju388657nfgvj/vscodeextension_swyx-tzm.mp4?dl=0

## Features

For projects with Linked Sites:

- Context Menu: Open to Admin UI
- Context Menu: Open to Site
- Tree View: Show 5 recent Deploys*
- Tree View: Show data on all Functions*
- Tree View: Show data on all Forms*

*from currently published deploy

For projects that are not yet linked:

- Link Site

## Local Development For Contributors

1. Clone this repo 
2. `yarn` to install dependencies
2. `yarn watch` to run an initial build and rebuild on changing code
3. press F5 (fn + F5 on a Mac) to open a new vscode instance with your extension installed
4. If you change code, you probably need to reload the vscode instance. you can hit the green reload arrow in the box at the top, or alternatively `Cmd+Shift+P` and select "Developer: Reload"

As you see develop the extension, the logs and errors for your extension will be visible in the "Debug Console", not in "Output".

---

> everything below is generated boilerplate we may want to add to our readme later

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: enable/disable this extension
- `myExtension.thing`: set to `blah` to do something

## Known Issues

- We assume you are logged in through the Netlify CLI. this reuses Netlify CLI code so that you dont have to relogin.
- **Single Workspace**: VS Code has [no notion of primary workspaces](https://github.com/microsoft/vscode/wiki/Adopting-Multi-Root-Workspace-APIs#eliminating-rootpath), so if you have multiple workspaces open we just warn you and pick the first one. We might tweak this logic in future to give you more choice.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Basic features -link to site

---
