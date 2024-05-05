let consoleColors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    reset: "\x1b[0m",
  };
  
  const logMessage = {
    info: (message) => {
      let logMessage = `📢: ${consoleColors.magenta} ${message} ${consoleColors.reset}`;
      console.log(logMessage);
    },
    error: (message) => {
      let logMessage = `❌ ${consoleColors.red} ${message} ${consoleColors.reset}`;
      console.log(logMessage);
    },
    success: (message) => {
      let logMessage = `✅ ${consoleColors.cyan} ${message} ${consoleColors.reset}`;
      console.log(logMessage);
    },
    debug: (message) => {
      let logMessage = `⚠️ ${message}`;
      console.log(logMessage);
    },
  };

  // Will print logs with specific 'themes'
  logMessage.success('Success logging your personalized information.')