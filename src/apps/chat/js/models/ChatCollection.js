import ModelCollection from '@/js/lib/ModelCollection'

export default class ChatCollection extends ModelCollection {
  constructor(options = {}) {
    options.primaryKey = 'id'

    super(options)
  }
}