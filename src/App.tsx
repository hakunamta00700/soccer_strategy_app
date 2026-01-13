import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import TacticalBoard from './components/board/TacticalBoard';
import BottomPanel from './components/bottom/BottomPanel';
import DevSeedAnimation from './components/DevSeedAnimation';
import KeyboardShortcuts from './components/KeyboardShortcuts';

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <DevSeedAnimation />
      <KeyboardShortcuts />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TacticalBoard />
          <BottomPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
