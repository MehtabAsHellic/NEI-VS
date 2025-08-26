import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Github, Twitter, Mail } from 'lucide-react';

const LandingFooter: React.FC = () => {
  const footerLinks = {
    product: [
      { name: 'Sandbox', href: '#sandbox' },
      { name: 'Courses', href: '#courses' },
      { name: 'Models', href: '/models' },
      { name: 'Educators', href: '/educators' }
    ],
    resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'Blog', href: '/blog' },
      { name: 'Community', href: '/community' }
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' }
    ],
    legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' }
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/neivs' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/neivs' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@neivs.com' }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Section */}
          <motion.div
            className="col-span-2 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold">NEI-VS</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Making AI education accessible through interactive visualizations and hands-on learning.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="text-slate-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h4 className="font-semibold text-white capitalize">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-sm text-slate-400">
            © 2025 NEI-VS. Made with ❤️ for AI education.
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 text-xs">Built with</span>
            <div className="flex items-center space-x-2">
              <div className="bg-slate-800 px-2 py-1 rounded text-xs font-medium text-slate-300">
                React
              </div>
              <div className="bg-slate-800 px-2 py-1 rounded text-xs font-medium text-slate-300">
                Tailwind
              </div>
              <div className="bg-slate-800 px-2 py-1 rounded text-xs font-medium text-slate-300">
                Framer Motion
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default LandingFooter;