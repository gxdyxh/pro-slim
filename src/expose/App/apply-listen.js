import _gc from '../../helpers/gc.js';

export default (App) => {
  App.prototype._applyListen = function (host, port, is_ssl) {
    const { _console, _config: config, _app: app } = this;

    const sslString = is_ssl ? 'HTTPS ' : is_ssl === false ? 'HTTP ' : '';

    return new Promise((resolve, reject) => {
      if (port === undefined) {
        const _errorContext = _console.error ? _console : console;

        _errorContext.error('[Server]: PORT is required');
        return undefined;
      }
      port = Number(port);
      const id = `${host}:${port}`;

      const onListenHandler = (token) => {
        if (token) {
          const _debugContext = _console.debug ? _console : console;
          const end = process.hrtime(this.time);

          this._instance[id] = token;
          _debugContext.debug(
            `[${sslString}Server]: started successfully at [${id}] in [${(
              (end[0] * 1000 + end[1]) /
              1000000
            ).toFixed(2)}ms]`
          );
          _gc();
          resolve(token);
        } else {
          const _errorContext = _console.error ? _console : console;

          const err = new Error(
            this.https &&
            (!config.https.cert_file_name || !config.https.key_file_name)
              ? `[${sslString}Server]: SSL certificate was not defined or loaded`
              : `[${sslString}Server]: failed to host at [${id}]`
          );
          _errorContext.error(err.message);
          _gc();
          reject(err);
        }
      };

      if (host) {
        app.listen(host, port, onListenHandler);
      } else {
        app.listen(port, onListenHandler);
      }
    });
  };
};
