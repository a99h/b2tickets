import ChatRequestCollection from '@/apps/chat/models/ChatRequestCollection'
import ModelCollection from '@/lib/ModelCollection'

function createModelCollection(data = [], options = {}) {
  return new ChatRequestCollection({
    ...options,
    data
  })
}

test('new works', () => {
  expect(new ChatRequestCollection).toBeInstanceOf(ModelCollection)
  expect(new ChatRequestCollection).toBeInstanceOf(ChatRequestCollection)
})

test('extends model structure', () => {
  expect(createModelCollection()).toEqual(expect.objectContaining({
    $collection: expect.any(Array),
    $options: expect.objectContaining({
      primaryKey: 'id'
    }),
    record: expect.any(Function),
    all: expect.any(Function),
    find: expect.any(Function),
    update: expect.any(Function)
  }))
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