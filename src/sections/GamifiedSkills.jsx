import { motion } from 'framer-motion';
import { Trophy, Zap, Target, TrendingUp, Award, Star, Code, Server, Brain, Link, Settings } from 'lucide-react';
import { skillsData, overallStats, achievements, recentXPGains } from '../data/gamification';
import GlassmorphismCard from '../components/GlassmorphismCard';
import Advanced3DBackground from '../components/3d/Advanced3DBackground';
import { useState, Suspense } from 'react';

const GamifiedSkills = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Icon mapping
  const iconMap = {
    Code,
    Server,
    Brain,
    Link,
    Settings
  };

  // Calculate level progress
  const levelProgress = (overallStats.totalXP / overallStats.nextLevelXP) * 100;

  return (
    <section id="gamified-skills" className="py-20 px-6 relative overflow-hidden min-h-screen">
      {/* 3D Neural Network Background */}
      <Suspense fallback={null}>
        <Advanced3DBackground variant="neural" />
      </Suspense>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-animate">
            Skills Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Track your progress, earn XP, and unlock achievements
          </p>
        </motion.div>

        {/* Overall Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <GlassmorphismCard
            className="p-8 rounded-2xl"
            animated={true}
            glow={true}
            glowColor="purple"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Level */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-3 animate-pulse-glow">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Level {overallStats.level}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Current Level</div>
                <div className="mt-2 w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {overallStats.totalXP.toLocaleString()} / {overallStats.nextLevelXP.toLocaleString()} XP
                </div>
              </div>

              {/* Projects */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mb-3">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{overallStats.projectsCompleted}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects Completed</div>
              </div>

              {/* Hackathons */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 mb-3">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{overallStats.hackathonsWon}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Hackathons Won</div>
              </div>

              {/* Streak */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-3">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{overallStats.streakDays}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak 🔥</div>
              </div>
            </div>
          </GlassmorphismCard>
        </motion.div>

        {/* Skills by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {Object.values(skillsData).map((category, catIndex) => {
            const Icon = iconMap[category.icon];
            
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1, duration: 0.5 }}
              >
                <GlassmorphismCard
                  className="p-6 rounded-2xl h-full"
                  animated={true}
                  glow={false}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl ${category.bgColor}`}>
                      {Icon && <Icon className={`w-6 h-6 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`} strokeWidth={2.5} />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category.category}</h3>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-4">
                    {category.skills.map((skill, idx) => (
                      <div key={idx} className="space-y-2">
                        {/* Skill Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{skill.name}</span>
                            {skill.badges.length > 0 && (
                              <div className="flex items-center gap-1">
                                {skill.badges.map((badge, bIdx) => (
                                  <span
                                    key={bIdx}
                                    className="text-xs px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/30"
                                    title={badge}
                                  >
                                    <Star size={10} className="inline" />
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{skill.projects} projects</span>
                            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Lvl {skill.level}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                            <span>{skill.xp} XP</span>
                            <span>{skill.maxXp} XP</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassmorphismCard>
              </motion.div>
            );
          })}
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Trophy className="text-yellow-600 dark:text-yellow-500" />
            Achievements & Badges
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, idx) => {
              const Icon = achievement.icon;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className={`group ${achievement.earned ? '' : 'opacity-50'}`}
                >
                  <GlassmorphismCard
                    className="p-4 rounded-xl text-center"
                    animated={achievement.earned}
                    glow={achievement.earned}
                    glowColor={achievement.color.includes('yellow') ? 'orange' : achievement.color.includes('purple') ? 'purple' : 'cyan'}
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${achievement.color} mb-3 ${achievement.earned ? 'animate-pulse-glow' : 'grayscale'}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{achievement.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{achievement.description}</p>
                    {achievement.earned && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/30">
                        <Zap size={10} className="text-yellow-500" />
                        <span className="text-xs text-yellow-500 font-semibold">+{achievement.xpReward} XP</span>
                      </div>
                    )}
                    {!achievement.earned && (
                      <div className="text-xs text-gray-600 dark:text-gray-500">🔒 Locked</div>
                    )}
                  </GlassmorphismCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent XP Gains */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-green-600 dark:text-green-500" />
            Recent XP Gains
          </h3>

          <GlassmorphismCard className="p-6 rounded-2xl" animated={true}>
            <div className="space-y-3">
              {recentXPGains.map((gain, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-200/50 dark:bg-white/5 hover:bg-gray-300/50 dark:hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{gain.activity}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                      <span>{gain.date}</span>
                      <span>•</span>
                      <span className="text-cyan-600 dark:text-cyan-400">{gain.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/30">
                    <Zap size={14} className="text-green-500" />
                    <span className="text-green-500 font-bold">+{gain.xp}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassmorphismCard>
        </motion.div>
      </div>
    </section>
  );
};

export default GamifiedSkills;
