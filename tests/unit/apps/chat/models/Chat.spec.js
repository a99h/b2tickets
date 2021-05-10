import Chat from '@/apps/chat/js/models/Chat'

import ModelEntity from '@/js/lib/ModelEntity'

function createModel(options = {}) {
  // const data = options.data || {
  //   id: Date.now(),
  //   channel_name: '7178e6f1-f72e-38cd-a6aa-fd4f84257940',
  //   message: 'Jest test message',
  //   operators_online: 1,
  //   created_at: '2021-05-03T05:45:57.000000Z',
  //   updated_at: '2021-05-03T05:45:57.000000Z',
  //   client: {
  //     id: Date.now(),
  //     name: 'Ethyl Sanford',
  //     email: 'tfahey@example.org',
  //     created_at: '2021-05-03T05:45:57.000000Z',
  //     updated_at: '2021-05-03T05:45:57.000000Z',
  //     userRoles: [{
  //       id: 1,
  //       hasPermissions: [],
  //       name: 'Client'
  //     }]
  //   }
  // }

  const data = options.data || {}

  return new Chat({
    data,
    ...options
  })
}

describe('Class ChatRequest', () => {
  test('new works', () => {
    expect(createModel()).toBeInstanceOf(Chat)
  })

  test('extends model structure', () => {
    expect(createModel()).toBeInstanceOf(ModelEntity)
  })

  test('Throws error if no data', () => {
    expect(() => {
      new Chat()
    }).toThrow('Data must be defined')
  })
})

// describe('fields', () => {
//   test('Chat Request structure', () => {
//     expect(createChatRequest()).toEqual(expect.objectContaining({
//       $fields: expect.objectContaining({
//         id: expect.any(Number),
//         channel_name: expect.any(String),
//         message: expect.any(String),
//         operators_online: expect.any(Number),
//         updated_at: expect.any(String),
//         created_at: expect.any(String),
//         client: expect.objectContaining({
//           id: expect.any(Number),
//           name: expect.any(String),
//           email: expect.any(String),
//           created_at: expect.any(String),
//           updated_at: expect.any(String),
//           userRoles: expect.arrayContaining([expect.objectContaining({
//             id: expect.any(Number),
//             name: expect.any(String),
//             hasPermissions: expect.any(Array)
//           })])
//         })
//       })
//     }))
//   })
// })