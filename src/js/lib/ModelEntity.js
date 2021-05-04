export default class ModelEntity {
  constructor(options = {}) {
    const data = options.data || {}

    this.$fields = {}
    this.$options = Object.assign({}, options)
    if (data !== {})
      this.record(data)
  }

  record(data) {
    this.$fields = data
  }
  show() {
    return Object.assign({}, this.$fields)
  }
  update(data) {
    this.$fields = Object.assign(this.$fields, data)

    return this.$fields
  }
}