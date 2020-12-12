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

const stopwatchMachine = Machine({
  id: 'stopwatch',
  initial: 'idle',
  context: {
    laps: 0
  },
  states: {
    idle: {
      on: {
        START: 'running'
      }
    },
    paused: {
      on: {
        START: 'running',
        RESET: {
          target:'idle',
          actions: assign({
            laps: (context, _) => context.laps = 0
          })
        }
      }

    },
    running: {
      on: {
        RESET:{
          target:'idle',
          actions: assign({
            laps: (context, _) => context.laps = 0
          })
        },
        PAUSE:'paused',
        LAP: {
          target: 'running',
          actions: assign({
            laps: (context, event) => context.laps+1
            })
          }
        }
      }
    },
});

const Stopwatch = () => {
  const [current, send] = useMachine(stopwatchMachine);
  
  return (
    <div>
      <div>Current state: {current.value}</div>
      <div>Lap count: {current.context.laps}</div>
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