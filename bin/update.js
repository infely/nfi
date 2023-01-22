#!/usr/bin/env node

import { writeFile } from 'fs/promises'

const filter = icons => {
  const ranges = {
    'IEC Power Symbols': ['23fb', '23fe'],
    Octicons: ['2665'],
    Octicons2: ['26a1'],
    'IEC Power Symbols2': ['2b58'],
    Pomicons: ['e000', 'e00a'],
    Powerline: ['e0a0', 'e0a2'],
    'Powerline Extra': ['e0a3'],
    Powerline2: ['e0b0', 'e0b3'],
    'Powerline Extra2': ['e0b4', 'e0c8'],
    'Powerline Extra3': ['e0ca'],
    'Powerline Extra4': ['e0cc', 'e0d4'],
    'Font Awesome Extension': ['e200', 'e2a9'],
    'Weather Icons': ['e300', 'e3eb'],
    'UI + Custom': ['e5fa', 'e631'],
    Devicons: ['e700', 'e7c5'],
    Codicons: ['ea60', 'ebeb'],
    'Font Awesome': ['f000', 'f2e0'],
    'Font Logos': ['f300', 'f32f'],
    Octicons3: ['f400', 'f4a8'],
    // Octicons4: ['f4a9'], // empty
    'Material Design': ['f500', 'fb1d'],
    'Material Design2': ['fb1f', 'fd46'] // skip 'fb1e' broke iterm
  }

  return Object.fromEntries(
    Object.entries(icons).filter(([_, value]) =>
      Object.values(ranges).find(([from, to]) => {
        to ??= from
        return parseInt(value, 16) >= parseInt(from, 16) && parseInt(value, 16) <= parseInt(to, 16)
      })
    )
  )
}

;(async () => {
  const url = 'https://www.nerdfonts.com/cheat-sheet'

  const res = await fetch(url)
  const text = await res.text()

  const matches = text.matchAll(/<div class="class-name">([^<]+)<\/div><div class="codepoint">([^<]+)<\/div>/gm)
  const json = {}
  for (const match of matches) {
    const [, key, value] = match
    json[key.replace(/^nf-/, '')] = value
  }

  await writeFile('icons.json', JSON.stringify(filter(json), null, 2))
})()
