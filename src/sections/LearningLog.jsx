import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, BookOpen, ChevronRight, Zap, TrendingUp } from 'lucide-react';
import { learningLog } from '../data/learningLog';
import { useState, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import GlassmorphismCard from '../components/GlassmorphismCard';
import Advanced3DBackground from '../components/3d/Advanced3DBackground';

const LearningLog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedPost, setExpandedPost] = useState(null);

  // Extract unique categories
  const categories = ['All', ...new Set(learningLog.map(post => post.category))];

  // Filter posts by category
  const filteredPosts = selectedCategory === 'All' 
    ? learningLog 
    : learningLog.filter(post => post.category === selectedCategory);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section id="learning-log" className="py-20 px-6 relative overflow-hidden min-h-screen">
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            Learning Log
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Documenting my journey - experiments, insights, and lessons learned along the way
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-gray-200 dark:bg-white/10 dark:dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20 dark:dark:hover:bg-white/10 border border-gray-300 dark:border-white/20 dark:dark:border-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group h-full"
            >
              <GlassmorphismCard
                className="h-full p-6 rounded-2xl flex flex-col"
                animated={true}
                glow={false}
                depth={false}
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-3">
                      <BookOpen size={14} className="text-cyan-500" />
                      <span className="text-sm font-medium text-cyan-500">{post.category}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </div>

                {/* Meta Information with XP */}
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                  {post.xpGained && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                      <Zap size={14} className="text-yellow-500" />
                      <span className="text-yellow-500 font-semibold">+{post.xpGained} XP</span>
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20"
                    >
                      <Tag size={12} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-700 dark:text-gray-300">{tag}</span>
                    </div>
                  ))}
                </div>

                {/* Skills Improved Badge */}
                {post.skillsImproved && post.skillsImproved.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <TrendingUp size={14} className="text-green-500" />
                    <div className="flex flex-wrap gap-1">
                      {post.skillsImproved.map((skill, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-500 border border-green-500/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expandable Markdown Content */}
                {expandedPost === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-6 rounded-xl bg-gray-100 dark:bg-white/5 dark:dark:bg-black/20 border border-gray-300 dark:border-white/10 overflow-hidden"
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-cyan-600 dark:prose-code:text-cyan-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-300 dark:prose-pre:border-white/10">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {post.content}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                )}

                {/* Read More Button */}
                <div className="mt-auto pt-4">
                  <button
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 font-medium transition-colors"
                  >
                    {expandedPost === post.id ? 'Show Less' : 'Read Full Article'}
                    <ChevronRight 
                      size={16} 
                      className={`transition-transform ${expandedPost === post.id ? 'rotate-90' : ''}`} 
                    />
                  </button>
                </div>
              </GlassmorphismCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningLog;
