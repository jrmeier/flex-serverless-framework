export class FrameworkError extends Error {
    constructor (options) {
      super(...options)
    }
}
// Genertic Erorrs
export class PassswordError extends FrameworkError {
    constructor (options) {
      super(...options)
    }
  }
  
  // Application specific errors
  export class UserLoginError extends FrameworkError {
    constructor (options) {
      super(...options)
    }
  }
  export class UserPasswordError extends FrameworkError {
    constructor (options) {
      super(...options)
    }
  }