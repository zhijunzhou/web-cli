import chalk from 'chalk'

function _current() {
  return new Date().toLocaleString()
}

export function _tlog(message: string) {
  console.log(chalk.gray(_current()), chalk.green(message))
}

export function _error(message: string) {
  console.log(chalk.gray(_current()), chalk.red(message))
}

export function _log(message: string) {
  console.log(chalk.green(message))
}

export function _log_yellow(message: string) {
  console.log(chalk.yellow(message))
}
