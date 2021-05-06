import Operator from '@/js/models/Operator'

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

  return new Operator({
    data,
    ...options
  })
}

describe('Class Operator', () => {
  test('new works', () => {
    expect(createModel()).toBeInstanceOf(Operator)
  })

  test('extends model structure', () => {
    expect(createModel()).toBeInstanceOf(ModelEntity)
  })

  test('Throws error if no data', () => {
    expect(() => {
      new Operator()
    }).toThrow('Data must be defined')
  })
})

// describe('fields', () => {
//   test('Client structure', () => {
//     expect(createModel()).toEqual(expect.objectContaining({
//       $fields: expect.objectContaining({
//         id: expect.any(Number),
//         name: expect.any(String),
//         email: expect.any(String),
//         created_at: expect.any(String),
//         updated_at: expect.any(String),
//         userRoles: expect.arrayContaining([expect.objectContaining({
//           id: expect.any(Number),
//           name: expect.any(String),
//           hasPermissions: expect.any(Array)
//         })])
//       })
//     }))
//   })
// })