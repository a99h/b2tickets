import Model from '@/lib/Model'

function createModel(data = [], options = {}) {
  return new Model({
    ...options,
    data
  })
}

test('new works', () => {
  expect(createModel()).toBeInstanceOf(Model)
})

test('model structure', () => {
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

describe('customizations', () => {
  test('we can customize the primaryKey', () => {
    const model = createModel([],{
      primaryKey: 'name'
    })

    expect(model.$options.primaryKey).toBe('name')
  })
})

describe('record', () => {
  const heroes = [{
    id: 1,
    name: 'Batman'}, {
    name: 'Black Panther'
  }]

  test('can add data to the collection', () => {
    const model = createModel()

    model.record(heroes)
    expect(model.$collection).toEqual([
      heroes[0],
      {
        id: expect.any(Number),
        name: heroes[1].name
      }
    ])
  })

  test('gets called when data is passed to Model', () => {
    const spy = jest.spyOn(Model.prototype, 'record')
    const model = createModel(heroes)

    expect(spy).toHaveBeenCalled()

    expect(model.$collection).toEqual(heroes)

    spy.mockRestore()
  })
})

describe('all', () => {
  test('returns empty model', () => {
    const model = createModel()

    expect(model.all()).toEqual([])
  })

  test('returns model data', () => {
    const model = createModel([{
      name: 'Batman'}, {
      name: 'Joker'
    }])

    expect(model.all().length).toBe(2)
  })

  test('original data stays intact', () => {
    const model = createModel([{ name: 'Batman' }])
    const data = model.all()

    data[0].name = 'Joker'
    expect(model.$collection[0].name).toBe('Batman')
  })
})

describe('find', () => {
  const heroes = [{
    id: 1,
    name: 'Batman'
  }, {
    id: 2,
    name: 'Black Panther'
  }]

  test('returns null if nothing matches', () => {
    const model = createModel()

    expect(model.find(heroes[0].id)).toEqual(null)
  })

  test('find returns a matching entry', () => {
    const model = createModel(heroes)

    expect(model.find(heroes[0].id)).toEqual(heroes[0])
  })
})

describe('update', () => {
  const heroesAndVillains = [{ id: 1, name: 'Batman' }]
  let model

  beforeEach(() => {
    const dataset = JSON.parse(JSON.stringify(heroesAndVillains))

    model = createModel(dataset)
  })

  test('an entry by id', () => {
    const hero = { name: 'Joker' }

    model.update(1, hero)
    expect(model.find(1).name).toBe(hero.name)
  })

  test('extend an entry by id', () => {
    model.update(1, { cape: true })
    expect(model.find(1)).toEqual(expect.objectContaining({
      name: 'Batman',
      cape: true
    }))
  })

  test('return false if no entry matches', () => {
    expect(model.update(2, {})).toBe(false)
  })
})