import React, { useReducer } from 'react';
import SetupForm from './components/SetupForm';
import ClassRoom from './pages/ClassRoom';
import { classDataReducer, initialState } from './store/classDataReducer';

function App() {
  const [state, dispatch] = useReducer(classDataReducer, initialState);
  const [isStarted, setIsStarted] = React.useState(false);

  const handleStart = () => {
    // For now just log, Phase 3 will implement the view
    console.log('Starting class with:', state);
    setIsStarted(true);
  };

  return (
    <div className="App">
      {!isStarted ? (
        <SetupForm state={state} dispatch={dispatch} onStart={handleStart} />
      ) : (
        <ClassRoom state={state} onBack={() => setIsStarted(false)} />
      )}
    </div>
  );
}

export default App;
