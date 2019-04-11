import app from './app'
import config from './config/config'

const serverPort = config.serverPort

const server = app.listen(serverPort, () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    serverPort,
    app.get('env')
  )
  console.log('  Press CTRL-C to stop\n')
})

export default server
