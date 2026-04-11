import React, { useState } from 'react';
import { 
  MessageSquare, Send, X, Users, MessageCircle, 
  Sparkles, Check, ChevronRight, Copy 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './Dialog';

const AI_TEMPLATES = [
  {
    id: 'promo',
    name: 'Sales Promotion',
    description: 'Perfect for announcing new products or seasonal sales',
    content: "Hi! 🌟 We have some exciting new offers at [Company Name]! Check out our latest premium collection and get exclusive deals. Reply 'YES' to see our catalog! 🛍️"
  },
  {
    id: 'invoice',
    name: 'Invoice Reminder',
    description: 'A polite nudge for outstanding payments',
    content: "Hello [Customer Name], this is a friendly reminder from [Company Name] regarding your outstanding invoice #[Invoice Number]. 📄 You can securely view and complete your payment online. Thank you! 🙏"
  },
  {
    id: 'order',
    name: 'Order Confirmation',
    description: 'Keep customers informed about their purchases',
    content: "Great news! 🎉 Your order #[Order Number] has been successfully confirmed at [Company Name] and is now being processed. We'll notify you once it's on its way! 🚚"
  },
  {
    id: 'greeting',
    name: 'Welcome Message',
    description: 'Greet new customers and build rapport',
    content: "Hi there! Welcome to [Company Name]. 🤝 We're thrilled to have you with us. If you have any questions about our services, feel free to ask anytime. We're here to help! ✨"
  }
];

interface WhatsAppMarketingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName: string;
}

const WhatsAppMarketingModal: React.FC<WhatsAppMarketingModalProps> = ({ 
  open, 
  onOpenChange,
  companyName
}) => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [sendToGroup, setSendToGroup] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleApplyTemplate = (template: typeof AI_TEMPLATES[0]) => {
    let content = template.content.replace(/\[Company Name\]/g, companyName || 'Prime ERP');
    setMessage(content);
    setSelectedTemplate(template.id);
  };

  const handleSend = () => {
    if (!message.trim()) return;

    let url = '';
    if (sendToGroup) {
      // For groups/anyone, we use the text-only API which opens the "select contact/group" screen
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    } else {
      const cleanPhone = recipient.replace(/[^0-9]/g, '');
      if (!cleanPhone) {
        alert('Please enter a valid phone number for direct messaging.');
        return;
      }
      url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden bg-slate-50">
        <DialogHeader className="bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <MessageSquare className="text-green-600" size={24} />
              </div>
              <DialogTitle className="text-2xl">WhatsApp Marketing</DialogTitle>
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left Side: Templates */}
          <div className="p-8 border-r border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={18} className="text-indigo-500" />
              <h4 className="font-semibold text-slate-800">AI-Generated Templates</h4>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
              {AI_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleApplyTemplate(template)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
                    selectedTemplate === template.id 
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-semibold ${selectedTemplate === template.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {template.name}
                    </span>
                    {selectedTemplate === template.id && (
                      <Check size={16} className="text-indigo-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-600">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
               <p className="text-[11px] text-indigo-600/70 uppercase font-bold tracking-widest flex items-center gap-2">
                 <Sparkles size={10} /> Pro Tip
               </p>
               <p className="text-xs text-slate-600 mt-1">
                 Use placeholders like [Customer Name] to personalize your messages before sending.
               </p>
            </div>
          </div>

          {/* Right Side: Message Editor */}
          <div className="p-8 bg-white">
            <h4 className="font-semibold text-slate-800 mb-6">Message Configuration</h4>

            <div className="space-y-6">
              {/* Recipient Type */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setSendToGroup(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    !sendToGroup ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <MessageCircle size={16} /> Direct
                </button>
                <button
                  onClick={() => setSendToGroup(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    sendToGroup ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Users size={16} /> Group/Anyone
                </button>
              </div>

              {!sendToGroup && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +265 888 123 456"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  />
                </div>
              )}

              {sendToGroup && (
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <p className="text-xs text-orange-700 font-medium">
                    Choosing "Group/Anyone" will open WhatsApp and let you select from your contacts or groups to send the message.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Message Content
                </label>
                <textarea
                  rows={8}
                  placeholder="e.g. Hi there! We have an exciting new collection..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none text-slate-700 leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-white gap-4">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim() || (!sendToGroup && !recipient.trim())}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Launch WhatsApp <Send size={16} />
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppMarketingModal;
