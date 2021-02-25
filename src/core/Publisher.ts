import { spawn } from 'child_process'
import { ServerParams } from '../types'
import { _log_yellow, _error } from '../utils'

const client = require('scp2')
const Rsync = require('rsync')

function exec(command: string, args: Array<string>, showLog?: Boolean) {
  showLog && _log_yellow(`arguments: ${JSON.stringify(arguments, null, 2)}`)
  return new Promise((resolve, reject) => {
    const ls = spawn(command, args)

    ls.stdout.on('data', (data) => {
      showLog && _log_yellow(`${data}`)
    })

    ls.stderr.on('data', (err) => {
      showLog && _error(`stderr: ${err}`)
      resolve(-1)
    })

    ls.on('close', (code) => {
      resolve(code)
    })
  })
}

function execRsyncDir(serverParams: ServerParams, showLog?: Boolean) {
  return new Promise((resolve, reject) => {
    const { server, username, path, local, exclude } = serverParams
    const rcommand = Rsync.build({
      source: local,
      destination: `${username}@${server}:${path}`,
      exclude: exclude,
      flags: 'aurz',
      shell: 'ssh'
    })
    // set progress
    rcommand.set('progress')
    rcommand.set('super')
    rcommand.set('owner', 'nginx').set('group', 'nginx')

    // Execute the command
    rcommand.output(
      (data: any) => {
        // do things like parse progress
        _log_yellow(data)
      },
      (error: any) => {
        // do things like parse error output
        _error(JSON.stringify(error))
      }
    )

    rcommand.execute((error: Error, code: number, cmd: string) => {
      if (error) {
        reject(-1)
        throw error
      }
      if (code === 0) {
        showLog && _log_yellow(cmd)
        resolve(code)
      }
    })
  })
}

function execRsyncFile(serverParams: ServerParams, showLog?: Boolean) {
  return new Promise((resolve, reject) => {
    const { server, username, path, local } = serverParams
    const rcommand = Rsync.build({
      source: local,
      destination: `${username}@${server}:${path}`,
      include: ['index.html'],
      exclude: ['static', 'images', 'img'],
      flags: 'auz'
    })
    // set progress and list dir
    rcommand.set('progress')

    rcommand.execute((error: Error, code: number, cmd: string) => {
      if (error) {
        reject(-1)
        throw error
      }
      if (code === 0) {
        showLog && _log_yellow(cmd)
        resolve(code)
      }
    })
  })
}

export function checkNet(server: string, showLog?: Boolean) {
  return exec('ping', ['-c', '3', server], showLog)
}

export function sysRsyncDir(serverParams: ServerParams, showLog?: Boolean) {
  const { server, username, path, local } = serverParams
  const targetDir = `${process.cwd()}/${local}`
  // rsync docs: https://www.samba.org/ftp/rsync/rsync.html
  // scp docs: https://man.openbsd.org/scp
  return exec(
    'rsync',
    ['-vurzP', targetDir, `${username}@${server}:${path}`],
    showLog
  )
}

export async function rsyncDir(serverParams: ServerParams, showLog?: Boolean) {
  const code = await execRsyncDir(serverParams, showLog)

  if (code === 0) {
    // await execRsyncFile(serverParams, showLog)
  }
}

export function scpDir(serverParams: ServerParams, showLog?: Boolean) {
  const { server, username, password, path, local } = serverParams
  const targetDir = `${process.cwd()}/${local}`

  return new Promise((resolve, reject) => {
    client.scp(
      targetDir,
      `${username}:${password}@${server}:${path}`,
      (err: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      }
    )
  })
}
