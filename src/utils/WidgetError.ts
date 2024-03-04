class WidgetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WidgetError';
  }
}

export default WidgetError;
