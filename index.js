const { markdownRenderer } = require('inkdrop')
const breaks = require('remark-breaks')

module.exports = {
  activate() {
    return markdownRenderer.remarkPlugins.splice(0, 0, breaks)
  },

  deactivate() {
    if (markdownRenderer) {
      markdownRenderer.remarkPlugins = markdownRenderer.remarkPlugins.filter(
        plugin => {
          return plugin !== breaks
        }
      )
    }
  }
}
