import ModelEntity from '@/lib/ModelEntity'

export default class ChatRequest extends ModelEntity {
  constructor(options = {}) {
    const data = options.data || undefined

    if (data === undefined) throw new Error('Data must be defined')

    super(options)
  }
}