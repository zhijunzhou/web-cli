import inquirer from 'inquirer'
import mappings from '../config'
import { _log, _tlog, _error } from '../utils'
import { Answer, Project, ServerParams } from '../types'
import { checkNet, scpDir, rsyncDir } from './Publisher'

_log('Welcome to web-rsync-cli!')

const defaultOptions = [
  {
    type: 'rawlist',
    name: 'project',
    message: 'Please choose a project: ',
    choices: mappings.map((item) => item.name)
  },
  {
    type: 'rawlist',
    name: 'env',
    message: 'Please choose which environment you want to publish?',
    choices: ['Staging', 'RC', 'Production']
  },
  {
    type: 'rawlist',
    name: 'type',
    message: 'Please choose which way to upload?',
    choices: ['rsync', 'scp']
  }
]

/**
 * @description parse the choices of the user
 * @param answer
 */
function parse(answer: Answer): ServerParams | undefined {
  const { project, env, type } = answer
  const e = env.toLowerCase()

  if (project) {
    const selected = <Project>mappings.find((item) => item.name === project)

    if (selected) {
      const { env, local, exclude } = selected
      return { ...env[e], local, exclude, type }
    }
  }
  return undefined
}

export async function uploadDir(serverParams: ServerParams) {
  const _debug = true

  switch (serverParams.type) {
    case 'rsync':
      await rsyncDir(serverParams, _debug)
      break
    case 'scp':
      await scpDir(serverParams, _debug)
      break
    default:
      break
  }
}

/**
 * @description start engine smoothly!
 */
export function start() {
  inquirer.prompt(defaultOptions).then(async (answer: Answer) => {
    const serverParams = parse(answer)

    if (serverParams) {
      const { server } = serverParams
      const code = await checkNet(server, false)

      // if the server is reachable and rsync was installed in user machine
      // we have the ability to upload our assets using scp tools
      if (code === 0) {
        uploadDir(serverParams)
      }
    }
  })
}
