import ModelCollection from '@/lib/ModelCollection'

export default class ChatRequestCollection extends ModelCollection {
  constructor(options = {}) {
    options.primaryKey = 'id'

    super(options)
  }
}