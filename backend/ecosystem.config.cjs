module.exports = {
  apps: [
    {
      name: "codesunny-backend",
      script: "src/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
