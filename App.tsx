import React, { useCallback, useMemo, useState } from 'react'
import ReactCurse, { Input, Text, List, ListPos, useExit, useInput, useSize, useClipboard } from 'react-curse'
import icons from './icons.json'

const App = () => {
  const { height } = useSize()
  const [, setClipboard] = useClipboard()
  const [value, setValue] = useState('')

  const result = useMemo(() => {
    const re = new RegExp(
      value
        .replace(/[^\da-z-]/gi, '')
        .split('')
        .join('.*')
    )
    const resIn = Object.keys(icons).filter(i => i.includes(value))
    const resRe = Object.keys(icons).filter(i => !resIn.includes(i) && re.test(i))
    const res = [...resIn, ...resRe]
    return res.map(i => [String.fromCharCode(parseInt(icons[i], 16)), i])
  }, [value, height])

  const onSubmit = useCallback(
    (pos: ListPos) => {
      if (result.length === 0) return

      setClipboard(`${result[pos.y][0]} `)
      useExit()
    },
    [result]
  )

  useInput(
    (input: string) => {
      if (input === '\x1b') useExit()
    },
    [result]
  )

  const highlight = (str: string, q: string) => {
    let index = -1
    const indexes = q
      .replace(/[^\da-z-]/gi, '')
      .split('')
      .map(letter => {
        return (index = str.split('').findIndex((i, j) => {
          return i === letter && j > index
        }))
      }, -1)
    if (indexes.includes(-1)) return null

    const res =
      'x1b[0m' +
      str
        .split('')
        .map((i, index) => {
          return indexes.includes(index) ? `x1b[Greenm${i}x1b[0m` : i
        })
        .join('')

    return (
      <Text>
        {res.split('x1b[').map((i, key) => {
          const [color] = i.split('m', 2)
          return (
            <Text key={key} color={color !== '0' ? color : undefined}>
              {i.substring(color.length + 1)}
            </Text>
          )
        })}
      </Text>
    )
  }

  return (
    <>
      <Text block>
        <Text>
          <Text bold dim>
            Search:{' '}
          </Text>
          <Input onChange={setValue} color="Green" />
          <Text dim> ({result.length})</Text>
        </Text>
      </Text>
      <List
        data={result}
        renderItem={({ item: [icon, name], selected, pass: value }) => (
          <>
            {selected && <Text color="Yellow"> </Text>}
            <Text x={2}>{icon + '  '}</Text>
            <Text dim>
              <Text color="Cyan">nf-</Text>
              {highlight(name, value)}
            </Text>
          </>
        )}
        height={height - 1}
        vi={false}
        pass={value}
        onSubmit={onSubmit}
      />
    </>
  )
}

ReactCurse.render(<App />)
