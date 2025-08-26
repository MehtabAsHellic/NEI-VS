import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const LandingTestimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "Finally understood LLMs! The visualizations made everything click.",
      author: "Sarah Chen",
      role: "CS Student",
      rating: 5
    },
    {
      quote: "Best AI learning platform I've used. The sandbox is incredible.",
      author: "Marcus Rodriguez",
      role: "Data Scientist",
      rating: 5
    },
    {
      quote: "My students love the interactive approach. Game changer for education.",
      author: "Dr. Emily Watson",
      role: "Professor",
      rating: 5
    }
  ];

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
            Loved by learners worldwide
          </h2>
          <p className="text-xl text-slate-600">
            Join thousands who've transformed their AI understanding
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="space-y-4">
                <div className="flex space-x-1">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-slate-700 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="border-t border-slate-100 pt-4">
                  <div className="font-semibold text-slate-900">{testimonial.author}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingTestimonials;