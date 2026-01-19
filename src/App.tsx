import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TimerScreen from './screens/TimerScreen';
import StatsScreen from './screens/StatsScreen';
import JournalScreen from './screens/JournalScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<TimerScreen />} />
          <Route path="/stats" element={<StatsScreen />} />
          <Route path="/journal" element={<JournalScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
