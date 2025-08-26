import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const LandingCourses: React.FC = () => {
  const { isAuthenticated, signInWithGoogle } = useAuthStore();

  const courses = [
    {
      title: 'LLMs: Understand Transformers',
      description: 'Deep dive into attention mechanisms and neural architectures',
      duration: '2 hours',
      students: '1.2k',
      progress: 85,
      color: 'indigo'
    },
    {
      title: 'Classical ML: Basics of SVMs',
      description: 'Support Vector Machines and traditional machine learning',
      duration: '90 min',
      students: '2.1k',
      progress: 92,
      color: 'blue'
    },
    {
      title: 'Computer Vision with CNNs',
      description: 'Convolutional networks for image recognition',
      duration: '3 hours',
      students: '980',
      progress: 78,
      color: 'purple'
    },
    {
      title: 'Reinforcement Learning',
      description: 'Training agents through reward systems',
      duration: '4 hours',
      students: '650',
      progress: 65,
      color: 'green'
    }
  ];

  const handleStartCourse = async () => {
    if (!isAuthenticated) {
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error('Sign in failed:', error);
      }
    }
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">
            Interactive Learning Tracks
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Master AI concepts with hands-on lessons and real-time visualizations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900">{course.title}</h3>
                    <p className="text-slate-600">{course.description}</p>
                  </div>
                  <div className={`w-3 h-3 bg-${course.color}-500 rounded-full`}></div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students} students</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="text-slate-900 font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div
                      className={`bg-${course.color}-500 h-2 rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${course.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                    />
                  </div>
                </div>

                <motion.button
                  onClick={handleStartCourse}
                  className={`w-full bg-${course.color}-600 hover:bg-${course.color}-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Start Course</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-semibold border border-slate-200 transition-all duration-200">
            View All Courses
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingCourses;