import ModelCollection from '@/js/lib/ModelCollection'

function createModelCollection(data = [], options = { primaryKey: 'id' }) {
  return new ModelCollection({
    ...options,
    data
  })
}

test('new works', () => {
  expect(createModelCollection()).toBeInstanceOf(ModelCollection)
})

test('model structure', () => {
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
  test('we can customize the primaryKey', () => {
    const modelCollection = createModelCollection([],{
      primaryKey: 'name'
    })

    expect(modelCollection.$options.primaryKey).toBe('name')
  })
})

describe('record', () => {
  const heroes = [{
    id: 1,
    name: 'Batman' }, {
    id: 2,
    name: 'Black Panther'
  }]

  test('can add data to the collection', () => {
    const modelCollection = createModelCollection()

    modelCollection.record(heroes)
    expect(modelCollection.$collection).toEqual([
      heroes[0],
      {
        id: expect.any(Number),
        name: heroes[1].name
      }
    ])
  })

  test('gets called when data is passed to Model', () => {
    const spy = jest.spyOn(ModelCollection.prototype, 'record')
    const modelCollection = createModelCollection(heroes)

    expect(spy).toHaveBeenCalled()

    expect(modelCollection.$collection).toEqual(heroes)

    spy.mockRestore()
  })

  test('Throws error if primary key in data is not defined', () => {
    expect(() => {
      const modelCollection = createModelCollection()

      modelCollection.record([{ name: 'Bamblbee' }])
    }).toThrow('Primary key must be defined!')
  })
})

describe('all', () => {
  test('returns empty model', () => {
    const modelCollection = createModelCollection()

    expect(modelCollection.all()).toEqual([])
  })

  test('returns model data', () => {
    const model = createModelCollection([{
      id: 1,
      name: 'Batman' }, {
      id: 2,
      name: 'Joker'
    }])

    expect(model.all().length).toBe(2)
  })

  test('original data stays intact', () => {
    const modelCollection = createModelCollection([{ id:1, name: 'Batman' }])
    const data = modelCollection.all()

    data[0].name = 'Joker'
    expect(modelCollection.$collection[0].name).toBe('Batman')
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
    const modelCollection = createModelCollection()

    expect(modelCollection.find(heroes[0].id)).toEqual(null)
  })

  test('find returns a matching entry', () => {
    const modelCollection = createModelCollection(heroes)

    expect(modelCollection.find(heroes[0].id)).toEqual(heroes[0])
  })
})

describe('update', () => {
  const heroesAndVillains = [{ id: 1, name: 'Batman' }]
  let modelCollection

  beforeEach(() => {
    const dataset = JSON.parse(JSON.stringify(heroesAndVillains))

    modelCollection = createModelCollection(dataset)
  })

  test('an entry by id', () => {
    const hero = { name: 'Joker' }

    modelCollection.update(1, hero)
    expect(modelCollection.find(1).name).toBe(hero.name)
  })

  test('extend an entry by id', () => {
    modelCollection.update(1, { cape: true })
    expect(modelCollection.find(1)).toEqual(expect.objectContaining({
      name: 'Batman',
      cape: true
    }))
  })

  test('return false if no entry matches', () => {
    expect(modelCollection.update(2, {})).toBe(false)
  })
})

describe('delete', () => {
  const heroesAndVillains = [{ id: 1, name: 'Batman' }]
  let modelCollection

  beforeEach(() => {
    const dataset = JSON.parse(JSON.stringify(heroesAndVillains))

    modelCollection = createModelCollection(dataset)
  })

  test('can delete an entry by id', () => {
    modelCollection.delete(1)

    expect(modelCollection.find(1)).toBeNull()
  })
})