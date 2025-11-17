import { motion } from 'framer-motion';
import { Code, Gamepad2, Trophy } from 'lucide-react';
import GlassmorphismCard from '../components/GlassmorphismCard';
import Advanced3DBackground from '../components/3d/Advanced3DBackground';
import { Suspense } from 'react';

const About = () => {
  const timeline = [
    { year: "2024", achievement: "Started CSE [AI/ML] at New LJIET" },
    { year: "2025", achievement: "Won Hackathon - Built AI Solution" },
    { year: "2025", achievement: "Started AI/ML Journey" },
  ];

  const interests = [
    { icon: Code, title: "Coding", description: "Building AI/ML projects" },
    { icon: Gamepad2, title: "Gaming", description: "Strategy & FPS games" },
    { icon: Trophy, title: "Hackathons", description: "Competitive coding" },
  ];

  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* 3D Neural Network Background */}
      <Suspense fallback={null}>
        <Advanced3DBackground variant="neural" />
      </Suspense>
      
      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            <span className="text-gradient-animate">About Me</span>
          </h2>
          
          {/* Story */}
          <GlassmorphismCard
            className="rounded-2xl p-6 sm:p-8 mb-12"
            animated={true}
            glow={true}
            glowColor="cyan"
          >
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
             I am an undergraduate student with an interest in AI/ML and blockchain development. I have experience in building the frontend of decentralized applications (DApps) using React.js and connecting to smart contracts through ethers.js. Passionate about exploring the intersection of artificial intelligence and decentralized technologies, and open to learning, collaboration, and project opportunities.
            </p>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Beyond coding, I'm an avid gamer who loves the strategic thinking involved in competitive 
              gaming. I also actively participate in hackathons and coding competitions, where I get to 
              collaborate with amazing people and build innovative solutions under pressure. Cricket is 
              my favorite sport to unwind and stay active.
            </p>
          </GlassmorphismCard>

          {/* Interests */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <GlassmorphismCard
                  className="rounded-xl p-6 text-center h-full"
                  animated={true}
                  glow={false}
                  depth={true}
                >
                  <div className="animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                    <interest.icon className="w-12 h-12 text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{interest.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{interest.description}</p>
                </GlassmorphismCard>
              </motion.div>
            ))}
          </div>

          {/* Timeline */}
          <GlassmorphismCard
            className="rounded-2xl p-4 sm:p-8"
            animated={true}
            glow={true}
            glowColor="purple"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">My Journey</h3>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 sm:gap-6 group"
                >
                  <div className="flex-shrink-0 w-16 sm:w-20 text-xl sm:text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {item.year}
                  </div>
                  <div className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4 bg-cyan-600 dark:bg-cyan-400 rounded-full group-hover:scale-125 transition-transform"></div>
                  <div className="flex-1 bg-gray-200/50 dark:bg-white/5 rounded-lg p-3 sm:p-4 border border-gray-300 dark:border-white/10 group-hover:bg-gray-300/50 dark:group-hover:bg-white/10 transition-all">
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{item.achievement}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassmorphismCard>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

