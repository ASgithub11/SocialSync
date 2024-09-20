import React from 'react';
import RandomPhoto from './components/RandomPhoto';
import WeatherInfo from './components/WeatherGenerator';

const App: React.FC = () => {
  return (
      <><div className="App">
          <h1>Random Photo from Unsplash</h1>
          <RandomPhoto />
      </div>
        <div className="App">
            <h1>My Weather App</h1>
            <WeatherInfo />
        </div></>
  );
}

export default App;