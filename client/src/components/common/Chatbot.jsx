import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiUser, FiWifi, FiPackage, FiDollarSign, FiMapPin, FiPhone, FiCreditCard, FiTv, FiShield, FiHeadphones, FiArrowRight, FiChevronRight } from 'react-icons/fi';
import { io } from 'socket.io-client';
import API from '../../services/api';

const quickReplies = [
  { label: 'Packages & Pricing', icon: FiPackage, message: 'What packages do you offer?' },
  { label: 'Check Coverage', icon: FiMapPin, message: 'Is service available in my area?' },
  { label: 'How to Apply', icon: FiArrowRight, message: 'How do I apply for a connection?' },
  { label: 'Payment Methods', icon: FiCreditCard, message: 'How can I pay my bill?' },
  { label: 'Business Plans', icon: FiShield, message: 'Tell me about business plans' },
  { label: 'Talk to Agent', icon: FiHeadphones, message: 'I want to talk to a human agent' },
];

const topicButtons = [
  { label: 'Internet Plans', icon: FiWifi, topics: ['packages', 'price', 'speed'] },
  { label: 'NetTV', icon: FiTv, topics: ['tv', 'channel', 'iptv'] },
  { label: 'Payment', icon: FiCreditCard, topics: ['pay', 'bill', 'esewa', 'khalti'] },
  { label: 'Support', icon: FiHeadphones, topics: ['support', 'help', 'complaint'] },
];

const botResponses = {
  'package': {
    text: "We have 8 amazing packages! Here's a quick overview:",
    followUp: [
      { label: '50 Mbps - Rs. 899/mo', action: 'package_50' },
      { label: '100 Mbps - Rs. 1,199/mo', action: 'package_100' },
      { label: '200 Mbps - Rs. 1,599/mo', action: 'package_200' },
      { label: 'View All Packages', action: 'link_packages' },
    ]
  },
  'package_50': { text: "Basic 50 Mbps - Rs. 899/month\n\nPerfect for students and casual browsing.\n\nIncludes:\n- Fiber Connection\n- 99.9% Uptime\n- 24/7 Support\n- Free Router\n- Unlimited Data\n\nWant to apply? Click below!", followUp: [{ label: 'Apply Now', action: 'link_apply' }, { label: 'See Other Plans', action: 'package' }] },
  'package_100': { text: "Standard 100 Mbps - Rs. 1,199/month\n\nMost popular for families!\n\nIncludes:\n- Fiber Connection\n- 99.9% Uptime\n- 24/7 Support\n- Free Router\n- Static IP Available\n- Unlimited Data\n\nIdeal for streaming & gaming.", followUp: [{ label: 'Apply Now', action: 'link_apply' }, { label: 'See Other Plans', action: 'package' }] },
  'package_200': { text: "Premium 200 Mbps - Rs. 1,599/month\n\nFor power users!\n\nIncludes:\n- Fiber Connection\n- Mesh WiFi Included\n- Priority Support\n- Static IP\n- 4K Streaming Ready\n- Unlimited Data", followUp: [{ label: 'Apply Now', action: 'link_apply' }, { label: 'See Other Plans', action: 'package' }] },
  'price': { text: "Our pricing is simple and transparent:\n\n50 Mbps - Rs. 899/mo\n100 Mbps - Rs. 1,199/mo\n200 Mbps - Rs. 1,599/mo\n300 Mbps - Rs. 1,999/mo\n500 Mbps - Rs. 2,499/mo\n1 Gbps - Rs. 9,999/mo\n\nAnnual plans save up to 20%!", followUp: [{ label: 'View All Plans', action: 'link_packages' }, { label: 'Apply Now', action: 'link_apply' }] },
  'speed': { text: "We offer speeds from 50 Mbps to 1 Gbps!\n\nAll plans include:\n- Unlimited Data\n- Free Router\n- 99.9% Uptime SLA\n\nNeed help choosing? What will you use it for?", followUp: [{ label: 'Streaming & Gaming', action: 'recommend_streaming' }, { label: 'Work from Home', action: 'recommend_work' }, { label: 'Family Use', action: 'recommend_family' }] },
  'recommend_streaming': { text: "For streaming & gaming, I recommend:\n\nStandard 100 Mbps (Rs. 1,199/mo) - Great for HD streaming\nPremium 200 Mbps (Rs. 1,599/mo) - Perfect for 4K & gaming\nGaming 500 Mbps (Rs. 2,499/mo) - Ultra low latency\n\nAll come with unlimited data!", followUp: [{ label: 'Apply Now', action: 'link_apply' }, { label: 'Compare Plans', action: 'link_packages' }] },
  'recommend_work': { text: "For work from home, I recommend:\n\nStandard 100 Mbps (Rs. 1,199/mo) - Reliable for video calls\nPremium 200 Mbps (Rs. 1,599/mo) - Best for heavy uploads\n\nBoth include static IP option!", followUp: [{ label: 'Apply Now', action: 'link_apply' }, { label: 'See Business Plans', action: 'business' }] },
  'recommend_family': { text: "For family use, our most popular plan:\n\nStandard 100 Mbps - Rs. 1,199/mo\n\n- Multiple device support\n- HD streaming\n- Free Router\n- 24/7 Support\n\nOr get Combo Home (Internet + TV + Phone) for Rs. 1,599/mo!", followUp: [{ label: 'Apply Now', action: 'link_apply' }, { label: 'See Combo Plans', action: 'combo' }] },
  'install': { text: "Installation is quick and easy!\n\n1. Apply online or visit our office\n2. Our team contacts you within 24 hours\n3. Fiber installation in 1-3 days\n4. Free router included\n5. You're online!\n\nMost installations are completed within 48 hours!", followUp: [{ label: 'Apply Now', action: 'link_apply' }, { label: 'Check Coverage', action: 'coverage' }] },
  'coverage': { text: "We currently cover:\n\nItahari (All areas)\nDharan\nBiratnagar\nInaruwa\nAnd expanding rapidly! Want to check your specific area?", followUp: [{ label: 'Check My Area', action: 'link_coverage' }, { label: 'Apply Now', action: 'link_apply' }] },
  'business': { text: "Business Internet Solutions:\n\nBusiness Starter - Rs. 2,499/mo (100 Mbps)\nBusiness Pro - Rs. 4,999/mo (300 Mbps)\nEnterprise - Rs. 9,999/mo (1 Gbps)\n\nAll include:\n- Dedicated Bandwidth\n- Static IP\n- SLA Guarantee\n- 24/7 Priority Support\n- Managed WiFi", followUp: [{ label: 'Contact Sales', action: 'link_contact' }, { label: 'Apply Now', action: 'link_apply' }] },
  'combo': { text: "Combo Packages (Best Value!):\n\nHome Combo - Rs. 1,599/mo\n- 100 Mbps Internet\n- 200+ TV Channels\n- Telephone\n- Free Netflix Basic\n\nFamily Plus - Rs. 2,299/mo\n- 200 Mbps Internet\n- 250+ TV Channels\n- Netflix Standard + YouTube Premium\n\nUltimate Bundle - Rs. 3,499/mo\n- 300 Mbps Internet\n- 300+ HD Channels\n- Netflix Premium + Prime Video + Disney+", followUp: [{ label: 'Apply Now', action: 'link_apply' }, { label: 'See All Packages', action: 'link_packages' }] },
  'tv': { text: "NetTV - Premium IPTV Service:\n\n200+ channels including HD & 4K\nCatch-up TV feature\nMulti-screen support\n\nGet it standalone or as a combo!\nCombo packages start at Rs. 1,599/mo\nwith internet + TV + phone!", followUp: [{ label: 'See Combo Plans', action: 'combo' }, { label: 'Apply Now', action: 'link_apply' }] },
  'payment': { text: "Easy Payment Options:\n\nDigital Wallets:\n- eSewa\n- Khalti\n\nBank Transfer:\n- All major banks\n\nOther:\n- Cash at our office\n- Online payment 24/7\n\nAnnual plans offer up to 20% discount!", followUp: [{ label: 'Apply Now', action: 'link_apply' }, { label: 'Contact Support', action: 'support' }] },
  'support': { text: "We're here to help!\n\nPhone: 9705390890 (24/7)\nOffice: 9709110186\nTechnical: 970910187\nEmail: sajhanet2025@gmail.com\nLive Chat: Right here!\n\nYou can also create a support ticket from your customer portal.", followUp: [{ label: 'Create Ticket', action: 'link_support' }, { label: 'Call Now', action: 'link_call' }] },
  'hello': { text: "Hello! Welcome to Sajha Net! 👋\n\nI'm here to help you with:\n- Package information & pricing\n- Coverage areas\n- Installation process\n- Payment methods\n- Business solutions\n\nWhat would you like to know?", followUp: quickReplies.slice(0, 4).map(q => ({ label: q.label, action: 'quick_' + q.label.toLowerCase().replace(/\s/g, '_') })) },
  'hi': { text: "Hi there! 👋 How can I assist you today?\n\nI can help with packages, pricing, coverage, installation, and more!", followUp: quickReplies.slice(0, 4).map(q => ({ label: q.label, action: 'quick_' + q.label.toLowerCase().replace(/\s/g, '_') })) },
  'thanks': { text: "You're welcome! 😊\n\nIs there anything else I can help you with?\n\nFeel free to ask anytime!", followUp: [{ label: 'Browse Packages', action: 'package' }, { label: 'Check Coverage', action: 'coverage' }] },
  'help': { text: "I can help you with:\n\n📦 Packages & Pricing\n🔌 Installation Process\n📍 Coverage Areas\n💳 Payment Methods\n🏢 Business Plans\n📺 NetTV Services\n🛠️ Technical Support\n\nJust click a topic or type your question!", followUp: quickReplies.slice(0, 4).map(q => ({ label: q.label, action: 'quick_' + q.label.toLowerCase().replace(/\s/g, '_') })) },
  'agent': { text: "I'll connect you with our support team right away!\n\nYou can also reach us at:\n📞 9705390890 (24/7)\n📞 Office: 9709110186\n📞 Technical: 970910187\n📧 sajhanet2025@gmail.com\n\nOr create a ticket from your customer portal.", followUp: [{ label: 'Create Ticket', action: 'link_support' }, { label: 'Call Now', action: 'link_call' }] },
  'apply': { text: "Ready to get connected? 🎉\n\nApplying is easy:\n1. Click 'Apply Now'\n2. Fill in your details\n3. Select your package\n4. Submit!\n\nOur team will contact you within 24 hours!", followUp: [{ label: 'Apply Now', action: 'link_apply' }, { label: 'View Packages First', action: 'link_packages' }] },
};

const getQuickAction = (action) => {
  if (action.startsWith('link_')) {
    const links = { link_packages: '/packages', link_apply: '/apply', link_coverage: '/coverage', link_contact: '/contact', link_support: '/support', link_call: 'tel:9705390890' };
    return { type: 'link', url: links[action.replace('link_', 'link_')] || '/packages' };
  }
  return null;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', content: "Hello! Welcome to Sajha Net! 👋\n\nI'm your virtual assistant. How can I help you today?", timestamp: new Date(), showQuickReplies: true }
  ]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => 'chat-' + Date.now());
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplyPanel, setShowQuickReplyPanel] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    try {
      socketRef.current = io('/', { transports: ['websocket', 'polling'] });
      socketRef.current.on('message-received', (data) => {
        if (data.sessionId === sessionId) {
          setMessages(prev => [...prev, data.message]);
          setIsTyping(false);
        }
      });
    } catch (e) {}
    return () => socketRef.current?.disconnect();
  }, [sessionId]);

  const getBotResponse = (msg) => {
    const lower = msg.toLowerCase();

    if (lower.includes('package') || lower.includes('plan') || lower.includes('offer')) return botResponses.package;
    if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('charge')) return botResponses.price;
    if (lower.includes('speed') || lower.includes('mbps') || lower.includes('gbps') || lower.includes('fast')) return botResponses.speed;
    if (lower.includes('stream') || lower.includes('game') || lower.includes('gaming')) return botResponses.recommend_streaming;
    if (lower.includes('work') || lower.includes('office') || lower.includes('remote')) return botResponses.recommend_work;
    if (lower.includes('family') || lower.includes('home') || lower.includes('basic')) return botResponses.recommend_family;
    if (lower.includes('install') || lower.includes('setup') || lower.includes('connection')) return botResponses.install;
    if (lower.includes('cover') || lower.includes('area') || lower.includes('available') || lower.includes('location')) return botResponses.coverage;
    if (lower.includes('business') || lower.includes('enterprise') || lower.includes('corporate')) return botResponses.business;
    if (lower.includes('combo') || lower.includes('bundle') || lower.includes('all in one')) return botResponses.combo;
    if (lower.includes('tv') || lower.includes('channel') || lower.includes('iptv') || lower.includes('nettv')) return botResponses.tv;
    if (lower.includes('pay') || lower.includes('bill') || lower.includes('esewa') || lower.includes('khalti') || lower.includes('payment')) return botResponses.payment;
    if (lower.includes('support') || lower.includes('help') || lower.includes('issue') || lower.includes('problem') || lower.includes('complaint')) return botResponses.support;
    if (lower.includes('agent') || lower.includes('human') || lower.includes('person') || lower.includes('talk')) return botResponses.agent;
    if (lower.includes('apply') || lower.includes('register') || lower.includes('signup') || lower.includes('new connection')) return botResponses.apply;
    if (lower.includes('hello') || lower.includes('hey') || lower.includes('namaste')) return botResponses.hello;
    if (lower.includes('hi') && lower.length < 5) return botResponses.hi;
    if (lower.includes('thank')) return botResponses.thanks;
    if (lower.includes('help') || lower.includes('what can')) return botResponses.help;

    return { text: "I'd be happy to help! Let me understand your question better.\n\nYou can ask me about:\n- Internet packages & pricing\n- Coverage in your area\n- How to apply\n- Payment methods\n- Business plans\n- Technical support\n\nOr click a quick reply below!", followUp: quickReplies.slice(0, 4).map(q => ({ label: q.label, action: 'quick_' + q.label.toLowerCase().replace(/\s/g, '_') })) };
  };

  const handleQuickReply = (message) => {
    const userMsg = { sender: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try { API.post('/chat/send', { sessionId, content: message, sender: 'user' }); } catch {}

    setTimeout(() => {
      const response = getBotResponse(message);
      const botMsg = { sender: 'bot', content: response.text, timestamp: new Date(), followUp: response.followUp || [] };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      try { API.post('/chat/send', { sessionId, content: response.text, sender: 'bot' }); } catch {}
    }, 800);
  };

  const handleFollowUp = (action) => {
    if (action.startsWith('link_')) {
      const url = { link_packages: '/packages', link_apply: '/apply', link_coverage: '/coverage', link_contact: '/contact', link_support: '/support' }[action] || '/packages';
      window.open(url, '_blank');
      return;
    }
    handleQuickReply(action);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try { await API.post('/chat/send', { sessionId, content: input, sender: 'user' }); } catch {}

    setTimeout(() => {
      const response = getBotResponse(input);
      const botMsg = { sender: 'bot', content: response.text, timestamp: new Date(), followUp: response.followUp || [] };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      try { API.post('/chat/send', { sessionId, content: response.text, sender: 'bot' }); } catch {}
    }, 1000);
  };

  const MessageBubble = ({ msg }) => (
    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
      {msg.sender === 'bot' && (
        <div className="w-7 h-7 gradient-bg rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <FiWifi className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className="max-w-[85%]">
        <div className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
          msg.sender === 'user'
            ? 'gradient-bg text-white rounded-br-md'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
        }`}>
          {msg.content}
        </div>
        {msg.followUp && msg.followUp.length > 0 && msg.sender === 'bot' && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {msg.followUp.map((fu, i) => (
              <button
                key={i}
                onClick={() => handleFollowUp(fu.action)}
                className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors flex items-center space-x-1"
              >
                <span>{fu.label}</span>
                <FiChevronRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 gradient-bg rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <FiX className="w-6 h-6 text-white" /> : <FiMessageCircle className="w-6 h-6 text-white" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[580px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            <div className="gradient-bg p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiWifi className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Sajha Net Support</p>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <p className="text-xs text-white/80">Online • Replies instantly</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
              {isTyping && (
                <div className="flex justify-start mb-3">
                  <div className="w-7 h-7 gradient-bg rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <FiWifi className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2.5 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 pb-2">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(qr.message)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-full text-xs font-medium transition-colors"
                  >
                    <qr.icon className="w-3 h-3" />
                    <span>{qr.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button onClick={handleSend} className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity">
                  <FiSend className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
