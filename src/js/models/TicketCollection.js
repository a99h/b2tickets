import ModelCollection from '@/js/lib/ModelCollection'

export default class TicketCollection extends ModelCollection {
  constructor(options = {}) {
    options.primaryKey = 'id'

    super(options)
  }
}