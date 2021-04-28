import ChatRequest from '@/apps/chat/models/ChatRequest'

function createModel(data = [], options = {}) {
  return new ChatRequest({
    ...options,
    data
  })
}

test('new works', () => {
  expect(new ChatRequest).toBeInstanceOf(ChatRequest)
})

test('extends model structure', () => {
  expect(createModel()).toEqual(expect.objectContaining({
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