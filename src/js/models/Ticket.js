import ModelEntity from '@/js/lib/ModelEntity'

export default class Ticket extends ModelEntity {
  constructor(options = {}) {
    const data = options.data || undefined

    if (data === undefined) throw new Error('Data must be defined')

    super(options)
  }
}