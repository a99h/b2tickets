import ModelCollection from '@/js/lib/ModelCollection'

export default class OperatorCollection extends ModelCollection {
  constructor(options = {}) {
    options.primaryKey = 'id'

    super(options)
  }
}