import UserSettings from '@/js/models/UserSettings'

import ModelEntity from '@/js/lib/ModelEntity'

function createModel(options = {}) {
  const data = options.data || {
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

  return new UserSettings({
    data,
    ...options
  })
}

describe('Class UserSettings', () => {
  test('new works', () => {
    expect(createModel()).toBeInstanceOf(UserSettings)
  })

  test('extends model structure', () => {
    expect(createModel()).toBeInstanceOf(ModelEntity)
  })

  test('Throws error if no data', () => {
    expect(() => {
      new UserSettings()
    }).toThrow('Data must be defined')
  })
})

describe('fields', () => {
  test('Operator structure', () => {
    expect(createModel()).toEqual(expect.objectContaining({
      $fields: expect.objectContaining({
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
    }))
  })
})