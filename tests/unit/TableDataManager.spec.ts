import TableDataManager from '@/data/TableDataManager'

function prepare() {
  const initialData = [
    ['A', 'B', 'C'],
    ['D', 'E', 'F'],
  ]

  const tableDataManager = new TableDataManager(initialData)

  return { initialData, tableDataManager }
}

describe('TableDataManager', () => {
  it('should return initial data', () => {
    const { tableDataManager, initialData } = prepare()
    const data = tableDataManager.getData()
    expect(data).toStrictEqual(initialData)
  })

  it('should add row after another row', () => {
    const { tableDataManager, initialData } = prepare()
    tableDataManager.createRow(0)

    expect(initialData[0]).toStrictEqual(['A', 'B', 'C'])
    expect(initialData[1]).toStrictEqual(['', '', ''])
    expect(initialData[2]).toStrictEqual(['D', 'E', 'F'])
  })

  it('should add column after another column', () => {
    const { tableDataManager, initialData } = prepare()
    tableDataManager.createColumn(0)

    expect(initialData[0]).toStrictEqual(['A', '', 'B', 'C'])
    expect(initialData[1]).toStrictEqual(['D', '', 'E', 'F'])
  })

  it('should return correct row and column count', () => {
    const { tableDataManager } = prepare()

    expect(tableDataManager.rowCount).toBe(2)
    expect(tableDataManager.columnCount).toBe(3)

    tableDataManager.createColumn(0)
    tableDataManager.createRow(0)

    expect(tableDataManager.rowCount).toBe(3)
    expect(tableDataManager.columnCount).toBe(4)
  })

  it('should return correct cell value', () => {
    const { tableDataManager, initialData } = prepare()

    for (let i = 0; i < initialData.length; i++) {
      const row = initialData[i]
      for (let j = 0; j < row.length; j++) {
        const cell = row[j]
        expect(tableDataManager.getCellValue(i, j)).toBe(cell)
      }
    }
  })

  it('should update cell values', () => {
    const { tableDataManager, initialData } = prepare()

    for (let i = 0; i < initialData.length; i++) {
      const row = initialData[i]
      for (let j = 0; j < row.length; j++) {
        tableDataManager.setCellValue(i, j, 'A')
      }
    }

    expect(initialData).toStrictEqual([
      ['A', 'A', 'A'],
      ['A', 'A', 'A'],
    ])
  })

  it('should remove row', () => {
    const { tableDataManager, initialData } = prepare()

    tableDataManager.removeRow(0)
    expect(initialData).toStrictEqual([['D', 'E', 'F']])

    tableDataManager.removeRow(0)
    expect(initialData).toStrictEqual([['', '', '']])
  })

  it('should remove column', () => {
    const { tableDataManager, initialData } = prepare()

    tableDataManager.removeColumn(0)
    expect(initialData).toStrictEqual([
      ['B', 'C'],
      ['E', 'F'],
    ])

    tableDataManager.removeColumn(0)
    expect(initialData).toStrictEqual([['C'], ['F']])

    tableDataManager.removeColumn(0)
    expect(initialData).toStrictEqual([[''], ['']])
  })

  it('should move row', () => {
    const { tableDataManager, initialData } = prepare()

    tableDataManager.moveRow(0, 1)
    expect(initialData).toStrictEqual([
      ['D', 'E', 'F'],
      ['A', 'B', 'C'],
    ])

    tableDataManager.moveRow(0, 0)
    expect(initialData).toStrictEqual([
      ['D', 'E', 'F'],
      ['A', 'B', 'C'],
    ])
  })

  it('should move column', () => {
    const { tableDataManager, initialData } = prepare()

    tableDataManager.moveColumn(2, -2)
    expect(initialData).toStrictEqual([
      ['C', 'A', 'B'],
      ['F', 'D', 'E'],
    ])

    tableDataManager.moveColumn(1, 1)
    expect(initialData).toStrictEqual([
      ['C', 'B', 'A'],
      ['F', 'E', 'D'],
    ])
  })
})
