import ModelEntity from '@/js/lib/ModelEntity'

export default class Chat extends ModelEntity {
  constructor(options = {}) {
    if (options.data === undefined) throw new Error('Data must be defined')

    super(options)
  }
}