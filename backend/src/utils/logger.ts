import pino from "pino";

const logger = pino({
  transport: {
    targets: [
      {
        target: 'pino/file',
        level: "warn",
        options: { destination: `./public/LOGS.log` },
      },
      {
          target: 'pino-pretty',
          level: "info",
          options: {
            levelFirst: true,
            translateTime: true,
            colorize: true,
          }
      },
    ],
  },
});

export { logger };
