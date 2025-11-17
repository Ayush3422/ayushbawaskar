import { motion } from 'framer-motion';
import { achievements } from '../data/achievements';
import GlassmorphismCard from '../components/GlassmorphismCard';
import Advanced3DBackground from '../components/3d/Advanced3DBackground';
import { Suspense } from 'react';

const Achievements = () => {
  return (
    <section id="achievements" className="py-20 px-6 relative overflow-hidden min-h-screen flex items-center">
      {/* 3D Neural Network Background */}
      <Suspense fallback={null}>
        <Advanced3DBackground variant="neural" />
      </Suspense>
      
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            Achievements
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Milestones and recognitions along my journey in AI/ML and software development
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ 
                  delay: index * 0.12, 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="relative group h-full"
              >
                <GlassmorphismCard
                  className="h-full p-6 rounded-2xl"
                  animated={true}
                  glow={true}
                  glowColor={achievement.color.includes('yellow') ? 'orange' : achievement.color.includes('blue') ? 'cyan' : achievement.color.includes('green') ? 'green' : achievement.color.includes('purple') ? 'purple' : 'fuchsia'}
                  depth={false}
                  hoverEffect={false}
                >
                  {/* Icon with Gradient Background */}
                  <div className={`inline-flex p-3 rounded-xl ${achievement.bgColor} mb-4 animate-pulse-glow`}>
                    <Icon className={`w-6 h-6 bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent`} strokeWidth={2.5} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {achievement.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {achievement.description}
                  </p>
                  
                  {/* Date Badge */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {achievement.date}
                    </span>
                  </div>
                  
                  {/* Animated Gradient Border Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${achievement.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none animate-rotate-gradient`} />
                </GlassmorphismCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
