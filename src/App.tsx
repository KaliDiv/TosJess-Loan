import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShieldCheck, Users, CheckCircle2, MessageCircle, Settings, Menu, X, Star, FileText, Clock, Banknote } from 'lucide-react';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminDashboard } from './components/AdminDashboard';
import { LoanCalculator } from './components/LoanCalculator';
import { trackWhatsAppClick } from './lib/tracking';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [config, setConfig] = useState({
    phoneNumber: "+2348103612710",
    message: "Hello TOSJESS Investment Limited, I want to apply for a loan.",
    floatingEnabled: true
  });

  useEffect(() => {
    fetch('/api/admin/whatsapp/stats')
      .then(res => res.json())
      .then(data => {
        if (data.config) setConfig(data.config);
      })
      .catch(err => console.error("Failed to load config", err));
  }, []);

  if (isAdminView) {
    return <AdminDashboard onClose={() => setIsAdminView(false)} />;
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-navy selection:bg-gold/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-navy/5">
        <div className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
          <div className="text-2xl font-display font-black tracking-tight text-navy">TOSJESS</div>
          <div className="hidden md:flex gap-10 items-center">
            <a className="text-gold font-bold border-b-2 border-gold pb-1 text-sm tracking-wide" href="#home">Home</a>
            <a className="text-navy/60 hover:text-navy transition-colors font-bold text-sm tracking-wide" href="#loans">Loans</a>
            <a className="text-navy/60 hover:text-navy transition-colors font-bold text-sm tracking-wide" href="#how-it-works">How It Works</a>
            <a className="text-navy/60 hover:text-navy transition-colors font-bold text-sm tracking-wide" href="#faq">FAQ</a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button className="bg-navy text-white px-7 py-2.5 rounded-full font-bold text-sm tracking-wide hover:bg-navy/90 transition-all shadow-lg shadow-navy/10">
              Apply Now
            </button>
          </div>
          <button 
            className="md:hidden text-navy p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-navy/5 overflow-hidden"
            >
              <div className="flex flex-col px-8 py-6 gap-6">
                <a className="text-gold font-bold text-lg tracking-wide" href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
                <a className="text-navy/80 hover:text-navy font-bold text-lg tracking-wide" href="#loans" onClick={() => setIsMobileMenuOpen(false)}>Loans</a>
                <a className="text-navy/80 hover:text-navy font-bold text-lg tracking-wide" href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
                <a className="text-navy/80 hover:text-navy font-bold text-lg tracking-wide" href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
                <button className="bg-navy text-white px-7 py-4 rounded-full font-bold text-lg tracking-wide hover:bg-navy/90 transition-all shadow-lg shadow-navy/10 mt-2 w-full">
                  Apply Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-40 pb-24 overflow-hidden min-h-screen flex items-center">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-gold/10 px-4 py-1.5 rounded-full mb-8 border border-gold/20"
            >
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span className="text-gold text-xs font-bold tracking-widest uppercase">Licensed Financial Institution</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-editorial-lg font-display font-black text-navy mb-8"
            >
              Fast, Reliable Loans for <span className="text-gold">Nigerian Businesses</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-navy/70 max-w-xl mb-12 leading-relaxed"
            >
              Fuel your growth with capital designed for the modern entrepreneur. Speed, trust, and simplicity at the core of every disbursement.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-5 mb-14"
            >
              <button className="bg-navy text-white px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 hover:shadow-xl hover:shadow-navy/20 transition-all active:scale-95">
                Apply for Loan
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => trackWhatsAppClick('hero_button', config)}
                className="bg-white text-navy border border-navy/10 px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-surface-low transition-all active:scale-95 shadow-sm"
              >
                <MessageCircle className="w-5 h-5 text-whatsapp" />
                Chat on WhatsApp
              </button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-10 border-t border-navy/10 pt-10"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <span className="text-xs font-bold text-navy/60 tracking-widest uppercase">Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gold" />
                <span className="text-xs font-bold text-navy/60 tracking-widest uppercase">Trusted by 500+ Clients</span>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white"
            >
              <img 
                alt="Business professional" 
                className="w-full aspect-[4/5] object-cover" 
                src="https://i.pinimg.com/736x/20/96/f1/2096f1d9739f0ca9aba199bcf50c3b0b.jpg"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8 glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">Recent Approval</span>
                  <span className="text-xl font-display font-black text-gold">₦2,500,000</span>
                </div>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="h-full bg-gold w-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="loans" className="py-32 bg-surface-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-display font-black text-navy mb-6 tracking-tight">Tailored Solutions</h2>
              <p className="text-navy/70 text-xl leading-relaxed">Whether it's scaling operations or handling emergencies, we have a loan product built for your specific needs.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Personal Loans", desc: "Achieve your personal goals with flexible repayment plans.", icon: "👤" },
              { title: "Business Loans", desc: "Scale your business, purchase inventory, or expand your workspace.", icon: "🏢", highlight: true },
              { title: "Emergency Loans", desc: "Swift financial relief when you need it most. Get approval in record time.", icon: "⚡" }
            ].map((service, i) => (
              <div key={i} className={`p-10 rounded-[2rem] transition-all duration-500 hover:-translate-y-2 border ${service.highlight ? 'bg-navy text-white border-navy shadow-2xl' : 'bg-white text-navy border-navy/5 shadow-sm'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-8 ${service.highlight ? 'bg-white/10' : 'bg-surface-low'}`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-display font-black mb-4 tracking-tight">{service.title}</h3>
                <p className={`mb-8 leading-relaxed ${service.highlight ? 'text-white/70' : 'text-navy/70'}`}>{service.desc}</p>
                <a className={`font-bold text-sm tracking-wide flex items-center gap-2 group ${service.highlight ? 'text-gold' : 'text-navy'}`} href="#">
                  Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-black text-navy mb-6 tracking-tight">How It Works</h2>
            <p className="text-navy/70 text-xl leading-relaxed">Get funded in three simple steps. We've removed the red tape so you can focus on your business.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-navy/5 -z-10"></div>
            
            {[
              { step: "01", title: "Apply in Minutes", desc: "Fill out our quick online form or chat with us directly on WhatsApp to start your application.", icon: <FileText className="w-6 h-6 text-gold" /> },
              { step: "02", title: "Fast Approval", desc: "Our team reviews your application instantly. No long queues, no unnecessary paperwork.", icon: <Clock className="w-6 h-6 text-gold" /> },
              { step: "03", title: "Get Funded", desc: "Once approved, the funds are disbursed directly to your bank account within 24 hours.", icon: <Banknote className="w-6 h-6 text-gold" /> }
            ].map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.2 }}
                key={i} 
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto bg-surface-low rounded-full flex items-center justify-center border-8 border-white shadow-xl mb-8 relative z-10">
                  {item.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-display font-black mb-4 tracking-tight text-navy">{item.title}</h3>
                <p className="text-navy/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Calculator Section */}
      <LoanCalculator config={config} />

      {/* Testimonials Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -z-10 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-black text-navy mb-6 tracking-tight">Trusted by Entrepreneurs</h2>
            <p className="text-navy/70 text-xl leading-relaxed">Don't just take our word for it. Hear from the businesses we've helped grow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "TOSJESS gave my retail business the lifeline it needed during the festive season. The WhatsApp application was incredibly smooth.", author: "Amina Y.", role: "Boutique Owner" },
              { quote: "I was surprised by how fast the approval process was. No hidden fees, just straightforward lending. Highly recommended.", author: "Chukwudi O.", role: "Logistics Director" },
              { quote: "The best financial partner for small businesses in Nigeria. Their customer service via WhatsApp is top-notch and always responsive.", author: "Folake A.", role: "Restaurant Manager" }
            ].map((testimonial, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.2 }}
                key={i} 
                className="bg-surface-low p-10 rounded-[2rem] shadow-sm border border-navy/5 relative"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-gold text-gold" />)}
                </div>
                <p className="text-navy/80 text-lg leading-relaxed mb-8 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy font-bold font-display shadow-sm">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy">{testimonial.author}</h4>
                    <p className="text-sm text-navy/60">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Help Section with WhatsApp Integration */}
      <section id="faq" className="py-32 bg-surface-low">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-display font-black text-navy mb-6 tracking-tight">Need Help Applying?</h2>
          <p className="text-xl text-navy/70 mb-12">Our loan specialists are available right now to guide you through the process.</p>
          
          <div className="bg-surface-low p-12 rounded-[2.5rem] border border-navy/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-whatsapp/10 rounded-full blur-[80px] -z-10"></div>
            
            <h3 className="text-2xl font-display font-bold text-navy mb-4">Fastest way to get help</h3>
            <p className="text-navy/60 mb-8 max-w-md mx-auto">Skip the forms. Chat with us directly on WhatsApp to get approved faster.</p>
            
            <button 
              onClick={() => trackWhatsAppClick('faq_section', config)}
              className="bg-[#25D366] text-white px-10 py-5 rounded-full font-bold text-lg inline-flex items-center gap-3 hover:bg-[#20bd5a] transition-all shadow-xl shadow-[#25D366]/20 hover:-translate-y-1"
            >
              <MessageCircle className="w-6 h-6" />
              Chat Instantly on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-navy rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden border border-gold/20 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold blur-[150px] opacity-20 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald blur-[150px] opacity-20 -z-10"></div>
            
            <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-8 tracking-tight">Get Funded Today with <span className="text-gold">TOSJESS</span></h2>
            <p className="text-xl text-white/70 mb-16 max-w-2xl mx-auto">Apply in minutes. Get funds in 24–48 hours. Let's build your future together.</p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <button className="bg-gold text-navy px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-gold/20">
                Apply Now
              </button>
              <button 
                onClick={() => trackWhatsAppClick('cta_section', config)}
                className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-12 py-5 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-white/20 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-whatsapp" />
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy w-full py-20 px-8 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 max-w-7xl mx-auto">
          <div>
            <div className="text-2xl font-display font-black text-white mb-6 tracking-tight">TOSJESS</div>
            <p className="text-white/50 text-sm leading-relaxed mb-8">Providing innovative financial solutions to empower Nigerian entrepreneurs since 2024.</p>
            <button 
              onClick={() => setIsAdminView(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/40 hover:text-white -ml-2"
              title="Admin Dashboard"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase text-gold mb-8">Navigation</h5>
            <ul className="space-y-4">
              <li><a className="text-white/60 hover:text-white transition-colors text-sm" href="#">Home</a></li>
              <li><a className="text-white/60 hover:text-white transition-colors text-sm" href="#">Loans</a></li>
              <li><a className="text-white/60 hover:text-white transition-colors text-sm" href="#">About Us</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase text-gold mb-8">Contact</h5>
            <ul className="space-y-4 text-sm text-white/60">
              <li>hello@tosjess.com</li>
              <li>+234 810 361 2710</li>
              <li>Lagos, Nigeria</li>
              <li>
                <button 
                  onClick={() => trackWhatsAppClick('footer', config)}
                  className="text-whatsapp hover:text-white transition-colors flex items-center gap-2 mt-2"
                >
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase text-gold mb-8">Compliance</h5>
            <ul className="space-y-4">
              <li><a className="text-white/60 hover:text-white transition-colors text-sm" href="#">Privacy Policy</a></li>
              <li><a className="text-white/60 hover:text-white transition-colors text-sm" href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp config={config} />
    </div>
  );
}
