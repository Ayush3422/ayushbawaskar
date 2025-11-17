import { motion } from 'framer-motion';
import { useState, Suspense } from 'react';
import { Mail, Linkedin, Github, Send, Briefcase, Users, MessageSquare, FileText, ExternalLink, Code2 } from 'lucide-react';
import Advanced3DBackground from '../components/3d/Advanced3DBackground';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone: ''
  });

  const [showCallForm, setShowCallForm] = useState(false);
  const [callFormData, setCallFormData] = useState({
    name: '',
    phone: ''
  });
  const [showCallConfirmation, setShowCallConfirmation] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, use mailto fallback
    const subject = encodeURIComponent('Portfolio Contact from ' + formData.name);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:ayushbawaskar4@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleCallSubmit = (e) => {
    e.preventDefault();
    
    // Send email with user details using mailto (opens email client)
    const subject = encodeURIComponent('Call Request from ' + callFormData.name);
    const body = encodeURIComponent(
      `New call request received!\n\nName: ${callFormData.name}\nPhone: ${callFormData.phone}\n\nPlease call them after 6 PM.`
    );
    window.location.href = `mailto:ayushbawaskar4@gmail.com?subject=${subject}&body=${body}`;
    
    setShowCallConfirmation(true);
    setShowCallForm(false);
    // Reset form after 10 seconds
    setTimeout(() => {
      setShowCallConfirmation(false);
      setCallFormData({ name: '', phone: '' });
    }, 10000);
  };

  const socialLinks = [
    { 
      icon: Linkedin, 
      label: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/ayush-bawaskar-254322340/', 
      color: 'from-blue-600 to-blue-400',
      hoverColor: 'hover:shadow-blue-500/50',
      description: 'Connect professionally',
      username: '@ayush-bawaskar'
    },
    { 
      icon: Github, 
      label: 'GitHub', 
      href: 'https://github.com/Ayush3422', 
      color: 'from-gray-700 to-gray-500',
      hoverColor: 'hover:shadow-gray-500/50',
      description: 'View my code',
      username: '@Ayush3422'
    },
    { 
      icon: Code2, 
      label: 'Google Colab', 
      href: 'https://colab.research.google.com/drive/yournotebook', 
      color: 'from-orange-600 to-yellow-500',
      hoverColor: 'hover:shadow-orange-500/50',
      description: 'ML experiments',
      username: 'View notebooks'
    },
    { 
      icon: Mail, 
      label: 'Email', 
      href: 'mailto:ayushbawaskar4@gmail.com', 
      color: 'from-red-600 to-pink-500',
      hoverColor: 'hover:shadow-red-500/50',
      description: 'Direct contact',
      username: 'ayushbawaskar4@gmail.com'
    },
  ];

  const callToActions = [
    {
      icon: Briefcase,
      title: 'Hire Me',
      description: 'Looking for a talented developer? Let\'s build something amazing together.',
      buttonText: 'View Resume',
      buttonColor: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600',
      href: '#', // Add your resume link
      external: true
    },
    {
      icon: Users,
      title: 'Collaborate',
      description: 'Have an exciting project idea? I\'m open to collaborations and partnerships.',
      buttonText: 'Start Collaboration',
      buttonColor: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      href: 'mailto:ayushbawaskar4@gmail.com?subject=Collaboration Opportunity',
      external: false
    },
    {
      icon: MessageSquare,
      title: 'Discuss a Project',
      description: 'Want to discuss your next big idea? I\'m all ears for innovative projects.',
      buttonText: 'Schedule a Call',
      buttonColor: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
      action: 'scheduleCall',
      external: false
    }
  ];

  return (
    <section id="contact" className="min-h-screen px-4 py-20 relative overflow-hidden">
      {/* 3D Neural Network Background */}
      <Suspense fallback={null}>
        <Advanced3DBackground variant="neural" />
      </Suspense>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gradient-animate mb-4 text-center">
            Let's Work Together
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg text-center mb-16 max-w-3xl mx-auto">
            Ready to bring your ideas to life? Whether you're looking to hire, collaborate, or just chat about technology, I'm here to help.
          </p>

          {/* Call to Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {callToActions.map((cta, index) => (
              <motion.div
                key={cta.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-strong rounded-2xl p-6 hover:glass-card transition-all duration-300 group"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${cta.buttonColor} mb-4 group-hover:scale-110 transition-transform`}>
                  <cta.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cta.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">{cta.description}</p>
                {cta.action === 'scheduleCall' ? (
                  <button
                    onClick={() => setShowCallForm(true)}
                    className={`inline-flex items-center gap-2 ${cta.buttonColor} text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm`}
                  >
                    {cta.buttonText}
                  </button>
                ) : (
                  <a
                    href={cta.href}
                    target={cta.external ? "_blank" : undefined}
                    rel={cta.external ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center gap-2 ${cta.buttonColor} text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm`}
                  >
                    {cta.buttonText}
                    {cta.external && <ExternalLink size={14} />}
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Social Links - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Connect With Me</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.4, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className={`glass-strong rounded-xl p-5 transition-all duration-300 hover:shadow-xl ${social.hoverColor} group`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${social.color}`}>
                      <social.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 dark:text-white font-semibold group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{social.label}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{social.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-500">{social.username}</span>
                    <ExternalLink size={14} className="text-gray-600 dark:text-gray-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass-strong rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Send Me a Message</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Or use the quick contact options above</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass-subtle rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder="Your Name"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass-subtle rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 glass-subtle rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"
                    placeholder="Tell me about your project or inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>

              {/* Quick Stats */}
              <div className="mt-8 pt-8 border-t border-gray-300 dark:border-white/10">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">24h</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Response Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">100%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Client Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">Open</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">For Opportunities</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Schedule Call Modal */}
      {showCallForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCallForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-strong rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Schedule a Call</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please provide your contact details. I'll reach out to you after 6 PM.
            </p>
            <form onSubmit={handleCallSubmit} className="space-y-4">
              <div>
                <label htmlFor="callName" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
                  Your Name
                </label>
                <input
                  type="text"
                  id="callName"
                  value={callFormData.name}
                  onChange={(e) => setCallFormData({ ...callFormData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 glass-subtle rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="callPhone" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium text-sm">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="callPhone"
                  value={callFormData.phone}
                  onChange={(e) => setCallFormData({ ...callFormData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 glass-subtle rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCallForm(false)}
                  className="flex-1 px-6 py-3 glass-subtle rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Call Confirmation Message */}
      {showCallConfirmation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCallConfirmation(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-strong rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Thank You!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              I've received your contact request. Please call me after <span className="font-bold text-cyan-600 dark:text-cyan-400">6 PM</span> at:
            </p>
            <a 
              href="tel:6352985184"
              className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
            >
              6352985184
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Looking forward to talking with you!
            </p>
            <button
              onClick={() => setShowCallConfirmation(false)}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Contact;

