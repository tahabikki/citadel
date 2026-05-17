'use client';

import { useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Loader2, CheckCircle } from "lucide-react";
import { mediaUrl } from "@/lib/images";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />
      
      <section className="relative h-[40vh] min-h-[300px] bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${mediaUrl('image_001.jpg')}")` }}
        />
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl md:text-2xl text-white/90">We&apos;d love to hear from you</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-3xl font-bold mb-6 text-[#867050]">Get in Touch</h2>
                <p className="text-[var(--secondary)] text-lg">
                  Whether you have a question about our rooms, need help with a reservation, or want to provide feedback, our team is here to help.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#867050]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#867050]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Address</h3>
                    <p className="text-[var(--secondary)]">42 Rue de la Victoire<br />62100 Calais, France</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#867050]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#867050]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <p className="text-[var(--secondary)]">+33 3 21 96 00 00<br />+33 6 12 34 56 78 (Mobile)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#867050]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#867050]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-[var(--secondary)]">contact@citadel-hotel.com<br />reservations@citadel-hotel.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#867050]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#867050]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Reception Hours</h3>
                    <p className="text-[var(--secondary)]">24/7 Front Desk<br />Check-in: 4:00 PM - Check-out: 11:30 AM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-[var(--border-light)]">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-[#867050]" />
                <h2 className="font-display text-2xl font-bold">Send us a Message</h2>
              </div>
              
              {status === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-[var(--secondary)] mb-6">Thank you for contacting us. We&apos;ll get back to you shortly.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="bg-[#867050] text-white px-6 py-3 rounded-lg hover:bg-[#867050]/90"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {status === 'error' && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg">{errorMessage}</div>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#867050]/30"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#867050]/30"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#867050]/30"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#867050]/30"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <select 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#867050]/30"
                    >
                      <option value="">Select a subject</option>
                      <option value="Reservation Inquiry">Reservation Inquiry</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Complaint">Complaint</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#867050]/30 resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#867050] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#867050]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-6">Find Us</h2>
          <div className="bg-white rounded-xl overflow-hidden h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2517.537864013924!2d1.9585!3d50.956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47dc96a676676767%3A0x4c3b8a7a7a7a7a7a7!2sCitadel%20Hotel%20Calais!5e0!3m2!1sfr!2sfr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
