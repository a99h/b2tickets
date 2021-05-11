import ModelCollection from '@/js/lib/ModelCollection'

export default class MessageCollection extends ModelCollection {
  constructor(options = {}) {
    options.primaryKey = 'id'

    super(options)
  }
}