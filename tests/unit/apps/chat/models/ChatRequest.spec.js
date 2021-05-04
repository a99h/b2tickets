import ChatRequest from '@/apps/chat/models/ChatRequest'
import Client from '@/js/models/Client'

import ModelEntity from '@/js/lib/ModelEntity'

function createChatRequest(options = {}) {
  const client = new Client({ data: {} })
  const data = options.data || {
    id: Date.now(),
    channel_name: '7178e6f1-f72e-38cd-a6aa-fd4f84257940',
    message: 'Jest test message',
    operators_online: 1,
    created_at: '2021-05-03T05:45:57.000000Z',
    updated_at: '2021-05-03T05:45:57.000000Z',
    client: client
  }

  return new ChatRequest({
    data,
    ...options
  })
}

describe('Class ChatRequest', () => {
  test('new works', () => {
    expect(createChatRequest()).toBeInstanceOf(ChatRequest)
  })

  test('extends model structure', () => {
    expect(createChatRequest()).toBeInstanceOf(ModelEntity)
  })

  test('Throws error if no data', () => {
    expect(() => {
      new ChatRequest()
    }).toThrow('Data must be defined')
  })
})

describe('fields', () => {
  test('Chat Request structure', () => {
    expect(createChatRequest()).toEqual(expect.objectContaining({
      $fields: expect.objectContaining({
        id: expect.any(Number),
        channel_name: expect.any(String),
        message: expect.any(String),
        operators_online: expect.any(Number),
        updated_at: expect.any(String),
        created_at: expect.any(String),
        client: expect.any(Client)
      })
    }))
  })
})