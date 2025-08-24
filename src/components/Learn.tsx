import React from 'react';
import { BookOpen, Play, Clock, Users, CheckCircle } from 'lucide-react';

const Learn: React.FC = () => {
  const courses = [
    {
      id: 'llm-basics',
      title: 'Large Language Models',
      description: 'Transformers, attention, text generation',
      duration: '2 hours',
      students: 1250,
      completed: 890,
      level: 'Beginner',
      color: 'bg-blue-500',
    },
    {
      id: 'cnn-vision',
      title: 'Computer Vision with CNNs',
      description: 'Image recognition, feature extraction',
      duration: '3 hours',
      students: 980,
      completed: 750,
      level: 'Intermediate',
      color: 'bg-green-500',
    },
    {
      id: 'classical-ml',
      title: 'Classical Machine Learning',
      description: 'SVMs, decision trees, traditional ML',
      duration: '90 minutes',
      students: 2100,
      completed: 1800,
      level: 'Beginner',
      color: 'bg-orange-500',
    },
    {
      id: 'rl-agents',
      title: 'Reinforcement Learning',
      description: 'Training agents, reward systems',
      duration: '4 hours',
      students: 650,
      completed: 320,
      level: 'Advanced',
      color: 'bg-red-500',
    },
  ];

  return (
    <div id="learn" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Learning Tracks
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master AI concepts with hands-on lessons and real-time visualizations. 
            From theory to practice.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {courses.map((course) => (
            <div key={course.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${course.color} rounded-lg flex items-center justify-center`}>
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>{course.completed} completed</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(course.completed / course.students) * 100}%` }}
                      ></div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2">
                      <Play className="h-4 w-4" />
                      <span>Start Course</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
            View All Courses
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">For Educators</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Create custom curricula, track progress. Comprehensive educator tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105">
              Educator Dashboard
            </button>
            <button className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105">
              Request Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;