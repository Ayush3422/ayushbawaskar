import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, CheckCircle, Lightbulb, Target, Code, BarChart, Rocket, BookOpen, FileCode } from 'lucide-react';
import { getProjectBySlug } from '../data/projects';
import { useEffect } from 'react';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Portfolio</span>
            </button>
            
            <div className="flex gap-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 glass-subtle rounded-lg hover:glass-card transition-all"
                >
                  <Github size={18} />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                >
                  <ExternalLink size={18} />
                  <span className="hidden sm:inline">Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              {project.description}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 glass-card rounded-full text-cyan-400 text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Screenshots/GIFs Section */}
          {project.screenshots && project.screenshots.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-12"
            >
              <div className="glass-card rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Code className="text-cyan-400" size={28} />
                  Project Visuals
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {project.screenshots.map((screenshot, index) => (
                    <div
                      key={index}
                      className="glass-subtle rounded-lg overflow-hidden hover:glass-card transition-all group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                        <img
                          src={screenshot}
                          alt={`${project.title} - Visual ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden flex-col items-center justify-center p-8 text-center">
                          <FileCode className="text-gray-600 mb-2" size={48} />
                          <span className="text-gray-500 text-sm">
                            Add image: {screenshot}
                          </span>
                          <span className="text-gray-600 text-xs mt-2">
                            Place in /public folder
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-900/50">
                        <p className="text-gray-400 text-sm">
                          Figure {index + 1}: {screenshot.split('/').pop().split('.')[0].replace(/-|_/g, ' ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Notebook Links */}
          {(project.colab || project.kaggle || project.notebook) && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mb-12"
            >
              <div className="glass-card rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <BookOpen className="text-cyan-400" size={28} />
                  Interactive Notebooks
                </h2>
                <p className="text-gray-300 mb-6">
                  Explore the full implementation with interactive Jupyter notebooks
                </p>
                <div className="flex flex-wrap gap-4">
                  {project.colab && (
                    <a
                      href={project.colab}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-3 glass-subtle hover:glass-card rounded-lg transition-all group"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" fill="#F9AB00"/>
                        <path d="M8 12c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm4 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z" fill="#F9AB00"/>
                      </svg>
                      <div>
                        <div className="font-semibold text-white">Open in Colab</div>
                        <div className="text-xs text-gray-400">Run code in the cloud</div>
                      </div>
                      <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                    </a>
                  )}
                  {project.kaggle && (
                    <a
                      href={project.kaggle}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-3 glass-subtle hover:glass-card rounded-lg transition-all group"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#20BEFF">
                        <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353C5.151.117 5.269 0 5.505 0h2.431c.234 0 .351.117.351.353v14.343l6.203-6.272c.165-.165.33-.248.495-.248h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.358"/>
                      </svg>
                      <div>
                        <div className="font-semibold text-white">View on Kaggle</div>
                        <div className="text-xs text-gray-400">Explore the dataset</div>
                      </div>
                      <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                    </a>
                  )}
                  {project.notebook && (
                    <a
                      href={project.notebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-3 glass-subtle hover:glass-card rounded-lg transition-all group"
                    >
                      <FileCode className="text-orange-400" size={24} />
                      <div>
                        <div className="font-semibold text-white">View Notebook</div>
                        <div className="text-xs text-gray-400">Browse the code</div>
                      </div>
                      <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.section>
          )}

          {/* Problem Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12"
          >
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="text-cyan-400" size={28} />
                The Problem
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {project.problem}
              </p>
            </div>
          </motion.section>

          {/* Approach Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-12"
          >
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Lightbulb className="text-cyan-400" size={28} />
                My Approach
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {project.approach}
              </p>
              
              {/* Code Example */}
              {project.codeSnippet && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                    <Code size={20} />
                    Key Code Implementation
                  </h3>
                  <div className="relative">
                    <pre className="bg-gray-950/50 border border-cyan-500/20 rounded-lg p-6 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono">
                        {project.codeSnippet}
                      </code>
                    </pre>
                    <div className="absolute top-3 right-3 px-3 py-1 bg-cyan-500/20 rounded text-xs text-cyan-400 font-semibold">
                      {project.language || 'Python'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* Dataset & Methodology */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-12"
          >
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart className="text-cyan-400" size={28} />
                Dataset & Methodology
              </h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">Dataset</h3>
                <p className="text-gray-300 leading-relaxed">
                  {project.dataset}
                </p>
              </div>

              {project.methodology && (
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-3">Methodology</h3>
                  <ul className="space-y-2">
                    {project.methodology.map((step, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.section>

          {/* Tools & Technologies */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-12"
          >
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Code className="text-cyan-400" size={28} />
                Tools & Technologies
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-4 py-2 glass-subtle rounded-lg text-gray-300 hover:glass-card transition-all"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Results */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-12"
          >
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart className="text-cyan-400" size={28} />
                Results & Metrics
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(project.results).map(([key, value]) => (
                  <div key={key} className="glass-subtle p-4 rounded-lg">
                    <div className="text-gray-400 text-sm capitalize mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-cyan-400 text-xl font-bold">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Lessons Learned */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-12"
          >
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Lightbulb className="text-cyan-400" size={28} />
                Lessons Learned
              </h2>
              <ul className="space-y-3">
                {project.lessons.map((lesson, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Next Steps */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-12"
          >
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Rocket className="text-cyan-400" size={28} />
                Future Enhancements
              </h2>
              <ul className="space-y-3">
                {project.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <Rocket className="text-purple-400 flex-shrink-0 mt-1" size={20} />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="glass-strong rounded-2xl p-8 text-center shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Interested in this project?
            </h3>
            <p className="text-gray-300 mb-6">
              Check out the code, try the live demo, or get in touch to discuss similar projects!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 glass-card hover:glass-card-hover rounded-lg transition-all font-semibold"
                >
                  <Github size={20} />
                  View on GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors font-semibold"
                >
                  <ExternalLink size={20} />
                  Try Live Demo
                </a>
              )}
              <Link
                to="/#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all font-semibold"
              >
                Contact Me
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

