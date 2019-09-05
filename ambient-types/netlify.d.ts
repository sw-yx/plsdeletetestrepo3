declare module 'netlify'

declare module '@netlify/cli-utils' {
  // import { ComponentType, StyleHTMLAttributes } from "react"

  // export interface BaseTabProps<A> {
  //   children?: React.ReactNode
  //   as?: ComponentType
  //   rest?: A
  //   style?: StyleHTMLAttributes
  // }

  // export interface TabsProps<A = React.HTMLAttributes<HTMLDivElement>> extends BaseTabProps<A> {
  //   children: React.ReactNode

  //   defaultIndex?: number
  //   index?: number
  //   onChange?(index: number): void
  // }
  // export class Tabs extends React.Component<TabsProps> {}

  // export type TabListProps<A = React.HTMLAttributes<HTMLDivElement>> = BaseTabProps<A>
  // export class TabList extends React.Component<TabListProps> {}

  // export type TabPanelsProps<A = React.HTMLAttributes<HTMLDivElement>> = BaseTabProps<A>
  // export class TabPanels extends React.Component<TabPanelsProps> {}

  // export type TabPanelProps<A = React.HTMLAttributes<HTMLDivElement>> = BaseTabProps<A>
  // export class TabPanel extends React.Component<TabPanelProps> {}

  // export interface TabProps<A = React.HTMLAttributes<HTMLDivElement>> extends BaseTabProps<A> {
  //   disabled?: boolean
  // }
  export class NetlifyCLIUtilsCommand {
    init(path?: string): void
    netlify: {
      /** Netlify API - don't access directly, refer to `netlify api --list` */
      api: any
      site: {
        root?: string
        configPath?: string
        id?: string
      }
      config?: {
        build?: {
          command?: string
          functions?: string
          publish?: string
        }
      }
      globalConfig?: {
        path?: string
      }
      state: {
        root: string
        path: string
      }
    }
  }
}

type Deploy = {
  id: string
  site_id: string
  build_id: string
  state: string
  name: string
  url: string
  ssl_url: string
  admin_url: string
  deploy_url: string
  deploy_ssl_url: string
  created_at: string
  updated_at: string
  user_id: string
  error_message: null
  required: any[]
  required_functions: any[]
  commit_ref: string | null
  review_id: null
  branch: string
  commit_url: string
  skipped: null
  locked: null
  log_access_attributes: Object
  title: string
  review_url: null
  published_at: string
  context: string
  deploy_time: number
  available_functions: any[]
  summary: Object
  screenshot_url: string
  site_capabilities: Object
  committer: string
  skipped_log: null
}
