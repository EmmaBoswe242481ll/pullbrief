import { logger, setLogLevel, getLogLevel } from './logger';

describe('logger', () => {
  let consoleSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    setLogLevel('info');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('setLogLevel / getLogLevel', () => {
    it('defaults to info level', () => {
      expect(getLogLevel()).toBe('info');
    });

    it('updates the current log level', () => {
      setLogLevel('debug');
      expect(getLogLevel()).toBe('debug');
    });
  });

  describe('logger.info', () => {
    it('logs info messages to console.log', () => {
      logger.info('hello world');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('[INFO] hello world');
    });

    it('includes context as JSON when provided', () => {
      logger.info('with context', { pr: 42 });
      expect(consoleSpy.mock.calls[0][0]).toContain('{"pr":42}');
    });
  });

  describe('logger.debug', () => {
    it('suppresses debug messages when level is info', () => {
      logger.debug('debug message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('logs debug messages when level is debug', () => {
      setLogLevel('debug');
      logger.debug('debug message');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('[DEBUG] debug message');
    });
  });

  describe('logger.warn', () => {
    it('logs warn messages to console.warn', () => {
      logger.warn('something off');
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('[WARN] something off');
    });
  });

  describe('logger.error', () => {
    it('logs error messages to console.error', () => {
      logger.error('something failed', { code: 500 });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('[ERROR] something failed');
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('{"code":500}');
    });
  });
});
