import { Star, Quote } from 'lucide-react';

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 relative">
      <Quote className="absolute top-4 right-4 text-primary-100" size={48} />
      
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      
      <p className="text-gray-600 mb-6 relative z-10">"{testimonial.text}"</p>
      
      <div className="border-t pt-4">
        <p className="font-semibold text-gray-900">{testimonial.name}</p>
        <p className="text-sm text-gray-500">{testimonial.location} | {testimonial.date}</p>
      </div>
    </div>
  );
}
