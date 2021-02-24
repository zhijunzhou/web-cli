import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'
import { Project } from '../types';

const projectPath = resolve(process.cwd(), 'projects.json')

if (!existsSync(projectPath)) {
  throw new Error("projects.json could not be detected, please create it first!");
}

const buffer = readFileSync(projectPath)

const obj = JSON.parse(buffer.toString())

export default <Project[]>obj.projects

