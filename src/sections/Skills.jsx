import { motion } from 'framer-motion';
import { skills } from '../data/skills';
import Advanced3DBackground from '../components/3d/Advanced3DBackground';
import { Suspense } from 'react';

const Skills = () => {
  const getWidthClass = (level) => {
    if (level >= 90) return 'w-11/12';
    if (level >= 80) return 'w-5/6';
    if (level >= 70) return 'w-3/4';
    if (level >= 60) return 'w-2/3';
    return 'w-1/2';
  };

  return (
    <section id="skills" className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 text-center">
            Skills & Technologies
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
            Technologies I work with to build amazing projects
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skillCategory, categoryIndex) => (
              <motion.div
                key={skillCategory.category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: categoryIndex * 0.15, 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card rounded-2xl p-4 sm:p-6 shadow-xl hover:glass-card-hover transition-all duration-300"
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {skillCategory.category}
                </h3>
                
                <div className="space-y-4">
                  {skillCategory.items.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: categoryIndex * 0.15 + skillIndex * 0.08, 
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                        <span className="text-cyan-600 dark:text-cyan-400 text-sm">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ 
                            delay: categoryIndex * 0.15 + skillIndex * 0.08 + 0.2, 
                            duration: 1,
                            ease: "easeOut"
                          }}
                          viewport={{ once: true, margin: "-50px" }}
                          className={`h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full`}
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tech Chips */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-12 glass-card rounded-2xl p-6 sm:p-8 shadow-xl"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6 text-center">
              All Technologies
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {['Python', 'JavaScript', 'TensorFlow', 'React', 'Solidity', 
                'Google Colab', 'VS Code', 'Git', 'Node.js', 'Tailwind CSS', 
                 'Keras', 'Next.js', 'C++'].map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.5 + index * 0.04, 
                    duration: 0.3,
                    ease: "backOut"
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 font-medium hover:bg-cyan-500/20 transition-all cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;

