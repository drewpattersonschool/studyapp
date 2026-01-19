import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TimerScreen from './screens/TimerScreen';
import StatsScreen from './screens/StatsScreen';
import JournalScreen from './screens/JournalScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      {/* Desktop wrapper - shows mobile frame on larger screens */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
        {/* Mobile container with iPhone dimensions */}
        <div className="w-full max-w-[430px] min-h-screen md:min-h-[932px] md:max-h-[932px] bg-white md:rounded-[3rem] md:shadow-2xl md:overflow-hidden relative">
          {/* iPhone notch simulation on desktop */}
          <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50"></div>

          {/* App content */}
          <div className="h-full overflow-auto">
            <Routes>
              <Route path="/" element={<TimerScreen />} />
              <Route path="/stats" element={<StatsScreen />} />
              <Route path="/journal" element={<JournalScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
            <BottomNav />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
