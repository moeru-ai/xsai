export class DelayedPromise<T> {
  get promise(): Promise<T> {
    if (this._promise == null) {
      this._promise = new Promise<T>((resolve, reject) => {
        if (this.status.type === 'resolved') {
          resolve(this.status.value)
        }
        else if (this.status.type === 'rejected') {
          reject(this.status.error)
        }

        this._resolve = resolve
        this._reject = reject
      })
    }

    return this._promise
  }

  private _promise: Promise<T> | undefined
  private _reject: ((error: unknown) => void) | undefined
  private _resolve: ((value: T) => void) | undefined

  private status:
    | { error: unknown, type: 'rejected' }
    | { type: 'pending' }
    | { type: 'resolved', value: T } = { type: 'pending' }

  reject(error: unknown): void {
    this.status = { error, type: 'rejected' }

    if (this._promise) {
      this._reject?.(error)
    }
  }

  resolve(value: T): void {
    this.status = { type: 'resolved', value }

    if (this._promise) {
      this._resolve?.(value)
    }
  }
}
