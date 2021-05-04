import ChatRequestCollection from '@/apps/chat/models/ChatRequestCollection'
import ChatRequest from '@/apps/chat/models/ChatRequest'

import ModelCollection from '@/js/lib/ModelCollection'
import Client from '@/apps/chat/models/Client'

function createModelCollection(data = [], options = {}) {
  return new ChatRequestCollection({
    ...options,
    data
  })
}

describe('Class ChatRequestCollection', () => {
  test('new works', () => {
    expect(createModelCollection()).toBeInstanceOf(ChatRequestCollection)
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