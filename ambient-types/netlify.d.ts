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
  title: string
  review_url: null
  published_at: string
  context: string
  deploy_time: number
  available_functions: {
    n: string // name! eg "webmentions"
    d: string // not sure but its not deploy eg "135e38cfd6b91063282189dc0d346bfe1fd20c7674d85d0bccb905b20ee5dff2"
    id: string // id eg "1da0dbb7f3e557913077efd140b4b2daf20ee0fe45ea8e9175026c351fb42745"
    a: string // not sure eg "554605863837"
    c: string // datetime eg "2020-02-23T08:00:12.747Z"
    r: string // runtime eg "nodejs12.x"
    s: number // not sure eg 48641
  }[]
  summary: Object
  screenshot_url: string
  site_capabilities: {
    large_media_enabled: true
  }
  committer: string
  skipped_log: null
}


// this is hastily adapted from api responses
// expect some things to be wrong
type NetlifySiteData = {
  id: string
  state: string
  plan: string
  name: string
  custom_domain: string
  domain_aliases: string[]
  password: string
  notification_email: string
  url: string
  ssl_url: string
  admin_url: string
  screenshot_url: string
  created_at: string
  updated_at: string
  user_id: string
  session_id: string
  ssl: true,
  force_ssl: true,
  managed_dns: true,
  deploy_url: string
  published_deploy: Deploy
  account_name: string
  account_slug: string
  git_provider: string
  deploy_hook: string
  capabilities: {
    property1: {},
    property2: {}
  },
  processing_settings: {
    skip: true,
    css: {
      bundle: true,
      minify: true
    },
    js: {
      bundle: true,
      minify: true
    },
    images: {
      optimize: true
    },
    html: {
      pretty_urls: true
    }
  },
  build_settings: {
    id: 0,
    provider: string
    deploy_key_id: string
    repo_path: string
    repo_branch: string
    dir: string
    cmd: string
    allowed_branches: string[]
    public_repo: true,
    private_logs: true,
    repo_url: string
    env: {
      property1: string
      property2: string
    },
    installation_id: 0
  },
  id_domain: string
  default_hooks_data: {
    access_token: string
  },
  build_image: string
}
