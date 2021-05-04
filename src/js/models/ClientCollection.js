import ModelCollection from '@/js/lib/ModelCollection'

export default class ClientCollection extends ModelCollection {
  constructor(options = {}) {
    options.primaryKey = 'id'

    super(options)
  }
}