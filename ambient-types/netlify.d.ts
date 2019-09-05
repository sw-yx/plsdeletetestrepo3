declare module '@netlify/cli-utils' {
  class NetlifyCLIUtilsCommand {
    init(path?: string): void
    netlify: NetlifyCLIData
  }
}
type NetlifyCLIData = {
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
