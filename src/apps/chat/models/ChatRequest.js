import Model from '@/lib/Model'

export default class ChatRequest extends Model {
  constructor(options = {}) {
    options.primaryKey = 'id'

    super(options)

    const data = options.data || []

    this.$collection = []
    this.$options = Object.assign({}, options)

    if (data.length)
      this.record(data)
  }
}