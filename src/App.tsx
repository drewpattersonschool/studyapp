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
      <Router basename="/studyapp">
        <div className="min-h-screen w-full">
          <Routes>
            <Route path="/" element={<TimerScreen />} />
            <Route path="/stats" element={<StatsScreen />} />
            <Route path="/journal" element={<JournalScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/avatar" element={<AvatarScreen />} />
          </Routes>
          <BottomNav />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
