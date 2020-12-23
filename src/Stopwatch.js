import { useMachine } from '@xstate/react';
import stopwatchMachine from './machines/Stopwatch';
import { ProgressCircle } from './components/ProgressCircle';

const Stopwatch = () => {
  const [current, send] = useMachine(stopwatchMachine);
  console.log('laps: ', current.context);
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
      <ProgressCircle />
      <div className="buttonContainer">
        {current.matches('running') || current.matches('paused') &&
          <div className="resetButton">
            <button onClick={() => send('RESET')}>RESET</button>
          </div>
        }
      
        <div className="runningPauseButton">
          <button onClick={() => {
            current.matches('running') ? send('PAUSE') : send('START')}}>
              {current.matches('running') ? 'PAUSE' : 'START'}
          </button>
        </div>
        
        {current.matches('running') &&
        <div className="lapButton">
          <button onClick={() => send('LAP')}>LAP</button>
        </div>
        }
      </div>
    </div>
  )
}

export default Stopwatch;