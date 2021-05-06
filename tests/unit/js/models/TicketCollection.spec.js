import TicketCollection from '@/js/models/TicketCollection'

import ModelCollection from '@/js/lib/ModelCollection'

function createModelCollection(data = [], options = {}) {
  return new TicketCollection({
    ...options,
    data
  })
}

describe('Class TicketCollection', () => {
  test('new works', () => {
    expect(createModelCollection()).toBeInstanceOf(TicketCollection)
  })

  test('Extends model structure', () => {
    expect(createModelCollection()).toBeInstanceOf(ModelCollection)
  })
})

describe('collection', () => {
  test('Call with empty data end expect empty array', () => {
    expect(createModelCollection()).toEqual(expect.objectContaining({
      $collection: expect.arrayContaining([])
    }))
  })
})

describe('customizations', () => {
  test('primary key must be id', () => {
    const modelCollection = createModelCollection()

    expect(modelCollection.$options.primaryKey).toBe('id')
  })

  test('we can\'t customize the primaryKey', () => {
    const modelCollection = createModelCollection([],{
      primaryKey: 'name'
    })

    expect(modelCollection.$options.primaryKey).toBe('id')
  })
})