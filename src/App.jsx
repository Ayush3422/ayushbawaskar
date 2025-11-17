import { useState } from 'react';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import RobotAssistant from './components/RobotAssistant';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import GamifiedSkills from './sections/GamifiedSkills';
import LearningLog from './sections/LearningLog';
import Contact from './sections/Contact';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleRobotClick = () => {
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-x-hidden transition-colors duration-300">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <GamifiedSkills />
      <Projects />
      <LearningLog />
      <Contact />
      <Chatbot isOpen={isChatOpen} onToggle={setIsChatOpen} />
      <RobotAssistant onOpenChat={handleRobotClick} />
    </div>
  );
}

export default App;



