const idMap = new WeakMap<string[], number>()
let lastId = 0

export default function getRowId(rowData: string[]) {
  const id = idMap.get(rowData)

  if (id === undefined) {
    lastId++
    idMap.set(rowData, lastId)
    return lastId
  }

  return id
}
