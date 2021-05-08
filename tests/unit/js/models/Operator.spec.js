import Operator from '@/js/models/Operator'

import ModelEntity from '@/js/lib/ModelEntity'

function createModel(options = {}) {
  const data = options.data || {
    id: Date.now(),
    name: 'Operator 1',
    email: 'operator1@example.com',
    email_verified_at: '2021-05-06T11:54:40.000000Z',
    created_at: '2021-05-06T11:54:40.000000Z',
    updated_at: '2021-05-06T11:54:40.000000Z',
    userRoles: [{
      id: 1,
      hasPermissions: [{
        name: 'show users',
        guard_name: 'api',
        created_at: ''
      }],
      name: 'operator'
    }],
    userSettings: {
      id: 1,
      created_at: '2021-05-06T11:54:39.000000Z',
      updated_at: '2021-05-06T11:54:39.000000Z',
      global_theme: 0,
      toolbar_theme: 2,
      toolbar_style: 1,
      content_layout: 0,
      menu_theme:2,
      primary_color: '#558c14',
      time_format: null,
      avatar: '/images/avatars/avatar1.svg'
    }
  }

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

describe('fields', () => {
  test('Operator structure', () => {
    expect(createModel()).toEqual(expect.objectContaining({
      $fields: expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        email_verified_at: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        userRoles: expect.arrayContaining([expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          hasPermissions: expect.any(Array)
        })]),
        userSettings: expect.objectContaining({
          id: expect.any(Number),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          global_theme: expect.any(Number),
          toolbar_theme: expect.any(Number),
          toolbar_style: expect.any(Number),
          content_layout: expect.any(Number),
          menu_theme: expect.any(Number),
          primary_color: expect.any(String),
          time_format: null,
          avatar: expect.any(String)
        })
      })
    }))
  })
})