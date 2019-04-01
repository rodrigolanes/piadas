import app from './app'

const serverPort = process.env.PORT || 4000

const server = app.listen(serverPort, () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    serverPort,
    app.get('env')
  )
  console.log('  Press CTRL-C to stop\n')
})

export default server
