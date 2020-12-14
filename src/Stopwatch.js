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
import { useMachine } from '@xstate/react';

const ticker = ctx => cb => {
  console.log( 'ticker invoked', ctx);
  const interval = setInterval(() => {
    cb("TICK");
    console.log('tick');
  }, ctx.interval * 1000);
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
      entry: 
        assign({
          laps: [],
          elapsed: 0
        })
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
        onDone: () => console.log('done was called')
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
});

const Stopwatch = () => {
  const [current, send] = useMachine(stopwatchMachine);

  return (
    <div>
      <div>Current state: {JSON.stringify(current.value)}</div>
      <div>Lap count: {current.context.laps.length}</div>
      {current.context.laps.length > 0 &&
        <div>
          {current.context.laps.map(lap => (
            <ul key={lap}>lap {lap}</ul>
          ))}
        </div>
      }
      <div>Elapsed: {current.context.elapsed}</div>
      <div>
        <button disabled={current.matches('IDLE')} onClick={() => {
          current.matches('running') ? send('PAUSE') : send('START')
          }
        }>
          {current.matches('running') ? 'PAUSE' : 'START'}</button>
        <button onClick={() => send('RESET')}>RESET</button>
        <button onClick={() => send('LAP')}>LAP</button>
      </div>
    </div>
  )
}

export default Stopwatch;