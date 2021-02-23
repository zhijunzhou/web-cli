export declare interface Server {
  path: string
  server: string
  username?: string
  password?: string
}

export declare interface ServerParams {
  local: RegExp | string
  path: string
  server: string
  type?: string
  username?: string
  password?: string
  exclude: Array<string | RegExp>
}

export declare interface ENV {
  [key: string]: Server
}

export declare interface Project {
  name: string
  local: string | RegExp
  env: ENV
  exclude: Array<string | RegExp>
}

export declare interface Answer {
  project: string
  env: string
  type?: string
}
