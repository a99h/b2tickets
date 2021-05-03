import ModelEntity from '@/lib/ModelEntity'

export default class ChatRequest extends ModelEntity {
  constructor(options = {}) {
    const data = options.data || undefined

    if (data === undefined) throw new Error('Data must be defined')

    super(options)

    const { id, channel_name, message, operators_online, created_at, updated_at } = data

    this.$fields.id = id
    this.$fields.channel_name = channel_name
    this.$fields.message = message
    this.$fields.operators_online = operators_online
    this.$fields.created_at = created_at
    this.$fields.updated_at = updated_at
  }
}