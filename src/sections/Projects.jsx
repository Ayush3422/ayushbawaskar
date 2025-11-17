import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';
import Advanced3DBackground from '../components/3d/Advanced3DBackground';
import { Suspense } from 'react';

const Projects = () => {
  return (
    <section id="projects" className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* 3D Neural Network Background */}
      <Suspense fallback={null}>
        <Advanced3DBackground variant="neural" />
      </Suspense>
      
      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 text-center">
            Featured Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
            Some of my recent work in AI/ML and Web Development
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.15, 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-80px" }}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </div>

          {/* View More */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mt-12"
          >
            <motion.a
              href="https://github.com/Ayush3422"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
            >
              View More on GitHub
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;

