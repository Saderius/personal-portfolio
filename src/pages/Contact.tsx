import React, { useState } from 'react';
import { Mail, Send, MapPin, Linkedin, Github, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mailto fallback for static site
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:saderiusishere@gmail.com,20mincode@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 md:px-6 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-text-main">Let's work together</h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          Whether you have a project in mind or just want to chat about games, design, or code, I'm always open to new opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass rounded-3xl p-8">
            <h3 className="text-xl font-display font-bold mb-6 text-text-main">Contact Information</h3>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4 text-text-muted transition-colors">
                <div className="w-12 h-12 rounded-full bg-glass-icon flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-text-muted mb-1">Emails</p>
                  <a href="mailto:saderiusishere@gmail.com" className="font-medium text-text-main hover:text-primary transition-colors block">
                    saderiusishere@gmail.com
                  </a>
                  <a href="mailto:20mincode@gmail.com" className="font-medium text-text-main hover:text-primary transition-colors block">
                    20mincode@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-text-muted">
                <div className="w-12 h-12 rounded-full bg-glass-icon flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-text-muted mb-1">Location</p>
                  <p className="font-medium text-text-main">Available Worldwide</p>
                  <p className="text-xs text-text-muted mt-1">(located in Poland)</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-surface-border">
              <h4 className="text-sm font-medium text-text-muted mb-4 uppercase tracking-wider">Social Profiles</h4>
              <div className="flex gap-4">
                <a href="https://github.com/Saderius" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/saderius/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/saderius/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/saderius/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 md:p-10 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-text-muted">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-glass-icon border border-surface-border rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-text-muted">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-glass-icon border border-surface-border rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-text-muted">Message</label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="bg-glass-icon border border-surface-border rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto self-start gap-2 mt-2">
              Send Message <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
