import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

interface LogMetadata {
  route?: string;
  method?: string;
  params?: object;
  body?: object;
  headers?: object;
  ip?: string;
  userAgent?: string;
}

const logFilePath = path.join(__dirname, '../logs/errors.json');

if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, stack, metadata }) => {
      const meta = metadata as LogMetadata; 
      
      const logEntry = {
        timestamp,
        level,
        message,
        stack,
        metadata: {
          route: meta?.route || null,
          method: meta?.method || null,
          params: meta?.params || null,
          body: meta?.body || null,
          headers: meta?.headers || null,
          ip: meta?.ip || null,
          userAgent: meta?.userAgent || null,
        },
      };

      let logs = [];
      if (fs.existsSync(logFilePath)) {
        try {
          const fileContent = fs.readFileSync(logFilePath, 'utf8');
          logs = JSON.parse(fileContent);
        } catch (error) {
          console.error('Error al leer el archivo de logs:', error);
        }
      }

      logs.push(logEntry);

      try {
        fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
      } catch (error) {
        console.error('Error al escribir en el archivo de logs:', error);
      }

      return JSON.stringify(logEntry); 
    })
  ),
  transports: [
    new transports.Console()
  ]
});

export default logger;
