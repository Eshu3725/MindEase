import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#66FCF1] mb-6">📧 Contact Us</h1>
      
      <div className="bg-[#1F2833] rounded-xl p-6 shadow-lg">
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold text-[#66FCF1] mb-2">Thank You!</h2>
            <p className="text-[#CFC6C7]">Your message has been sent. We'll get back to you soon.</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-[#66FCF1] mb-4">Get in Touch</h2>
            <p className="text-[#CFC6C7] mb-6">
              Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll respond as soon as possible.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-[#CFC6C7] mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-[#0B0C10] text-[#CFC6C7] border border-[#45A29E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66FCF1]"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-[#CFC6C7] mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-[#0B0C10] text-[#CFC6C7] border border-[#45A29E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66FCF1]"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-[#CFC6C7] mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-[#0B0C10] text-[#CFC6C7] border border-[#45A29E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66FCF1]"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-[#CFC6C7] mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full p-3 bg-[#0B0C10] text-[#CFC6C7] border border-[#45A29E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66FCF1]"
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="bg-[#66FCF1] text-[#0B0C10] px-6 py-3 rounded-lg font-semibold hover:bg-[#45A29E] transition duration-300"
              >
                Send Message
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
