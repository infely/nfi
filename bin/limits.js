#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'

const res = readFileSync('./icons.json')
const json = JSON.parse(res)

const arr = Object.values(json)
  .map(i => parseInt(i, 16))
  .sort((a, b) => {
    if (a === b) return 0
    return a > b ? 1 : -1
  })

const chunks = [[]]
for (const i of arr) {
  const chunk = chunks[chunks.length - 1]
  if (chunk.length === 0 || chunk[chunk.length - 1] === i - 1) {
    chunk.push(i)
  } else {
    chunks.push([i])
  }
}

writeFileSync('limits.json', JSON.stringify(chunks, null, 2))
