const LEVEL_MAP = {
  debug: 1,
  info: 2,
  log: 3,
  warn: 4,
  error: 5
}

export class Logger {
  constructor({
    handlerName,
    version,
    gitBranch,
    gitSha,
    deployTime,
    stage,
    service,
    logLevel
  }) {
    this.record = {
      handlerName,
      version,
      gitBranch,
      gitSha,
      deployTime,
      stage,
      service,
      logLevel
    }
  }

  _out(level, message) {
    const time = new Date().toISOString()
    const levelAccepted = LEVEL_MAP[this.record.logLevel]
    const levelInt = LEVEL_MAP[level] || 0

    if (levelAccepted > levelInt) {
      return
    }
    this.record = {
      ...this.record,
      time
    }

    this.record.message = message

    if (level === 'error' && message?.reportError !== false) {
      const context = {
        ...this.record,
        message: message.message,
        name: message.name,
        payload: message,
        stack: message?.stack
      }

      console.error(context)
    } else {
      console[level](this.record)
    }
  }

  debug(message) {
    this._out('debug', message)
  }

  info(message) {
    this._out('info', message)
  }

  log(message) {
    this._out('log', message)
  }

  warn(message) {
    this._out('warn', message)
  }

  error(message) {
    this._out('error', message)
  }
}
