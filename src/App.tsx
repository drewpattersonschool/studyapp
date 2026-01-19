import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import TimerScreen from './screens/TimerScreen';
import StatsScreen from './screens/StatsScreen';
import JournalScreen from './screens/JournalScreen';
import SettingsScreen from './screens/SettingsScreen';
import AvatarScreen from './screens/AvatarScreen';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <ThemeProvider>
      <Router>
        {/* Full screen black background wrapper */}
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          {/* iPhone frame container - fixed dimensions */}
          <div className="relative w-full h-full sm:w-[430px] sm:h-[932px] bg-white sm:rounded-[3rem] shadow-2xl overflow-hidden">
            {/* iPhone notch simulation on larger screens */}
            <div className="hidden sm:block absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-7 bg-black rounded-b-3xl z-50"></div>

            {/* App content - scrollable container */}
            <div className="w-full h-full overflow-y-auto overflow-x-hidden">
              <Routes>
                <Route path="/" element={<TimerScreen />} />
                <Route path="/stats" element={<StatsScreen />} />
                <Route path="/journal" element={<JournalScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
                <Route path="/avatar" element={<AvatarScreen />} />
              </Routes>
              <BottomNav />
            </div>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
