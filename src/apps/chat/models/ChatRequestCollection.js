import ModelCollection from '@/lib/ModelCollection'

export default class ChatRequestCollection extends ModelCollection {
  constructor(options = {}) {
    options.primaryKey = 'id'

    super(options)

    // const data = options.data || []
    //
    // this.$collection = []
    // this.$options = Object.assign({}, options)
    //
    // if (data.length)
    //   this.record(data)
  }
}