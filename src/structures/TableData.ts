function normalizeArray(sourceArray: string[][]) {
  let columnCount = 0
  for (const row of sourceArray) {
    columnCount = Math.max(columnCount, row.length)
  }

  const result: string[][] = new Array(sourceArray.length)

  for (let i = 0; i < result.length; i++) {
    const sourceRow = sourceArray[i]
    const row = [...sourceRow]
    while (row.length < columnCount) row.push('')
    result[i] = row
  }

  return result
}

export default class TableData {
  private readonly _values: string[][]
  private readonly _readonlyValues: ReadonlyArray<ReadonlyArray<string>>

  public constructor(values: string[][]) {
    this._values = normalizeArray(values)
    this._readonlyValues = this.generateReadonlyValues(this._values)
  }

  private generateReadonlyValues(values: string[][]) {
    const arrayProxyKey = Symbol('proxy key')

    const rowProxyHandler: ProxyHandler<string[]> = {
      set() {
        return true
      },
    }

    const rootProxyHandler: ProxyHandler<string[][]> = {
      get(target, property, reciever) {
        const result = Reflect.get(target, property, reciever)
        if (typeof result !== 'object') return result

        //To prevent creating new proxy for each array[index] call
        if (!result[arrayProxyKey]) result[arrayProxyKey] = new Proxy(result, rowProxyHandler)
        return result[arrayProxyKey]
      },
      set() {
        return true
      },
    }

    return new Proxy(values, rootProxyHandler)
  }

  public asReadonlyArray(): ReadonlyArray<ReadonlyArray<string>> {
    return this._readonlyValues
  }

  public get rowCount() {
    return this._values.length
  }

  public get columnCount() {
    return this._values[0]?.length ?? 0
  }

  public getCellValue(rowIndex: number, columnIndex: number) {
    return this._values[rowIndex]?.[columnIndex]
  }

  public setCellValue(rowIndex: number, columnIndex: number, value: string) {
    if (rowIndex >= this.rowCount || columnIndex >= this.columnCount) return
    this._values[rowIndex][columnIndex] = value
  }

  public createRow(afterRowIndex?: number): void {
    if (afterRowIndex === undefined) return this.createRow(this.rowCount - 1)
    if (afterRowIndex >= this.rowCount) afterRowIndex = this.rowCount - 1
    this._values.splice(afterRowIndex + 1, 0, TableData.createEmptyRow(this.columnCount))
  }

  public createColumn(afterColumnIndex?: number): void {
    if (afterColumnIndex === undefined) return this.createColumn(this.columnCount - 1)
    if (afterColumnIndex >= this.columnCount) afterColumnIndex = this.columnCount - 1
    for (const row of this._values) row.splice(afterColumnIndex + 1, 0, '')
  }

  public removeRow(rowIndex: number) {
    if (rowIndex >= this.rowCount) return
    this._values.splice(rowIndex, 1)
  }

  public removeColumn(columnIndex: number) {
    if (columnIndex >= this.columnCount) return
    for (const row of this._values) row.splice(columnIndex, 1)
  }

  private static createEmptyRow(columnCount: number) {
    const rowValues: string[] = new Array(columnCount)
    for (let j = 0; j < columnCount; j++) rowValues[j] = ''
    return rowValues
  }

  public static createFromArray(values: string[][]) {
    return new TableData(values)
  }

  public static createEmpty(rowCount: number, columnCount: number) {
    const values: string[][] = []
    for (let i = 0; i < rowCount; i++) values.push(TableData.createEmptyRow(columnCount))
    return new TableData(values)
  }
}
