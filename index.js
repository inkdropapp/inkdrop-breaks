var breaks = require('remark-breaks')

module.exports = {
  activate () {
    const { MDEPreview } = inkdrop.components.classes
    if (MDEPreview) {
      return MDEPreview.remarkPlugins.splice(0, 0, breaks)
    }
  },

  deactivate () {
    const { MDEPreview } = inkdrop.components.classes
    if (MDEPreview) {
      MDEPreview.remarkPlugins = MDEPreview.remarkPlugins.filter(function (plugin) {
        return plugin !== breaks
      })
    }
  }
}
