import type { Environment, IInkdropPlugin } from '@inkdropapp/types'
import breaks from 'remark-breaks'

class BreaksPlugin implements IInkdropPlugin {
  activate(app: Environment) {
    app.markdownRenderer.remarkPlugins.unshift(breaks)
  }

  deactivate(app: Environment) {
    if (app.markdownRenderer) {
      app.markdownRenderer.remarkPlugins = app.markdownRenderer.remarkPlugins.filter(
        plugin => plugin !== breaks
      )
    }
  }
}

export default new BreaksPlugin()
