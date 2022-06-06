module.exports = {
    apps : [{
      name   : "DialogFlow",
      script : "server.js",
      instances:1,
      autorestart: true,
      watch: false,
      
      max_memory_restart:'350M',
      watch_delay: 1000,
      ignore_watch : ["node_modules"],
      log_date_format: "DD/MM/YYYY HH:MM:ss"
    }]
  }
  