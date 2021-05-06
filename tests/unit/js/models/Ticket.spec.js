import Ticket from '@/js/models/Ticket'

import ModelEntity from '@/js/lib/ModelEntity'

function createModel(options = {}) {
  // const data = options.data || {
  //   id: Date.now(),
  //   name: 'Ethyl Sanford',
  //   email: 'tfahey@example.org',
  //   created_at: '2021-05-03T05:45:57.000000Z',
  //   updated_at: '2021-05-03T05:45:57.000000Z',
  //   userRoles: [{
  //     id: 1,
  //     hasPermissions: [],
  //     name: 'Client'
  //   }]
  // }

  const data = options.data || {}

  return new Ticket({
    data,
    ...options
  })
}

describe('Class Ticket', () => {
  test('new works', () => {
    expect(createModel()).toBeInstanceOf(Ticket)
  })

  test('extends model structure', () => {
    expect(createModel()).toBeInstanceOf(ModelEntity)
  })

  test('Throws error if no data', () => {
    expect(() => {
      new Ticket()
    }).toThrow('Data must be defined')
  })
})

describe('fields', () => {
  test('Ticket structure', () => {
    expect(createModel()).toEqual(expect.objectContaining({
      $fields: expect.objectContaining({
        id: expect.any(Number),
        issue: expect.any(String),
        description: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        ticketChatRequests: expect.arrayContaining([expect.objectContaining({
          id: expect.any(Number),
          message: expect.any(String),
          name: expect.any(String),
          hasPermissions: expect.any(Array)
        })])
      })
    }))
  })
})