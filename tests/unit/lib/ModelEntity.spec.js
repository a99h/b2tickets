import ModelEntity from '@/lib/ModelEntity'

function createModelEntity(data = {}, options = {}) {
  return new ModelEntity({
    data,
    ...options
  })
}

test('new works', () => {
  expect(createModelEntity()).toBeInstanceOf(ModelEntity)
})

test('model structure', () => {
  expect(createModelEntity()).toEqual(expect.objectContaining({
    $fields: expect.any(Object),
    record: expect.any(Function),
    show: expect.any(Function),
    update: expect.any(Function)
  }))
})
describe('record', () => {
  const hero = {
    id: 1,
    name: 'Batman'
  }

  test('can add data to the model fields', () => {
    const modelEntity = createModelEntity()

    modelEntity.record(hero)
    expect(modelEntity.$fields).toEqual(hero)
  })

  test('gets called when data is passed to Model', () => {
    const spy = jest.spyOn(ModelEntity.prototype, 'record')
    const modelEntity = createModelEntity(hero)

    expect(spy).toHaveBeenCalled()

    expect(modelEntity.$fields).toEqual(hero)

    spy.mockRestore()
  })
})

describe('show', () => {
  const hero = {
    name: 'Batman',
    job: 'superhero'
  }

  test('returns empty model', () => {
    const modelEntity = createModelEntity()

    expect(modelEntity.show()).toEqual({})
  })

  test('returns model data', () => {
    const model = createModelEntity(hero)

    expect(model.show()).toEqual(hero)
  })

  test('original data stays intact', () => {
    const modelEntity = createModelEntity(hero)
    const data = modelEntity.show()

    data.name = 'Joker'
    expect(modelEntity.$fields.name).toBe('Batman')
  })
})

describe('update', () => {
  const hero = { id: 1, name: 'Batman' }
  let modelEntity

  beforeEach(() => {
    const dataset = JSON.parse(JSON.stringify(hero))

    modelEntity = createModelEntity(dataset)
  })

  test('update an entry', () => {
    const hero = { name: 'Joker' }

    modelEntity.update(hero)
    expect(modelEntity.$fields.name).toBe(hero.name)
  })

  test('extend an entry', () => {
    modelEntity.update({ cape: true })
    expect(modelEntity.$fields).toEqual(expect.objectContaining({
      name: 'Batman',
      cape: true
    }))
  })
})