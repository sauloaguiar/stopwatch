import {
  Machine,
  State,
  actions,
  assign,
  send,
  sendParent,
  interpret,
  spawn
} from 'xstate';

const ticker = ctx => cb => {
  const interval = setInterval(() => {
    cb("TICK");
  }, ctx.interval * 0.1);
  return () => clearInterval(interval);
};

const stopwatchMachine = Machine({
  id: 'stopwatch',
  initial: 'idle',
  context: {
    laps: [],
    interval: 1,
    elapsed: 0
  },
  states: {
    idle: {
      on: {
        START: 'running'
      },
      entry: ['resetState']
    },
    paused: {
      on: {
        START: 'running',
        RESET: 'idle'
      }
    },
    running: {
      invoke: {
        src: ticker,
        id: 'ticker',
      },
      on: {
        RESET:'idle',
        PAUSE:'paused',
        LAP: {
          target: 'running',
          actions: assign({
            laps: (context, event) => {
              console.log('elapsed: ', context.elapsed);
              context.laps.push(context.elapsed)
              return context.laps;
            }
            })
          },
        TICK: {
          actions: assign({
            elapsed: (ctx) => ctx.elapsed + ctx.interval,
          }),
        },
      },
      }
    },
}, {
  actions: {
    resetState:
      assign({
        laps: [],
        elapsed: 0
      }),
    }
});

export default stopwatchMachine;