import { markdownRenderer } from 'inkdrop'
import breaks from 'remark-breaks'

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
