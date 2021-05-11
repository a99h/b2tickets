import MessageCollection from '@/apps/chat/js/models/MessageCollection'

import ModelCollection from '@/js/lib/ModelCollection'

function createModelCollection(data = [], options = {}) {
  return new MessageCollection({
    ...options,
    data
  })
}

describe('Class MessageCollection', () => {
  test('new works', () => {
    expect(createModelCollection()).toBeInstanceOf(MessageCollection)
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