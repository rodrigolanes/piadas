import app from "./app";

const server_port = process.env.PORT || 3000;

const server = app.listen(server_port, () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    server_port,
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

export default server;
