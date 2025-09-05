import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Dna, Upload, FileText, Activity } from 'lucide-react';

const chatResponses = {
  upload: {
    response: "I can help you upload genome files! We support .fasta, .vcf, .gff, and .bed formats. Make sure your files are from institutional sources and have proper consent documentation. Would you like me to guide you through the upload process?",
    suggestions: ["Upload Guidelines", "Supported Formats", "File Size Limits"]
  },
  analysis: {
    response: "Our genome sequence analyzer can calculate GC content, codon usage frequency, and AT/GC ratios using BioPython. After uploading your file, go to the Sequence Analysis page to start. What type of analysis are you interested in?",
    suggestions: ["GC Content Analysis", "Codon Usage", "Sequence Statistics"]
  },
  variants: {
    response: "The variant detection engine identifies SNPs, insertions, deletions, and classifies mutations as homozygous/heterozygous. It also categorizes mutations as missense, nonsense, etc. Upload your VCF file to get started!",
    suggestions: ["SNP Detection", "Mutation Types", "Variant Impact"]
  },
  predictions: {
    response: "Our ML-based risk predictor analyzes SNP data to predict disease likelihood for conditions like BRCA, Thalassemia, and Sickle Cell. The system provides confidence scores and explainability metrics. Would you like to learn more about how it works?",
    suggestions: ["How Predictions Work", "Confidence Scores", "Supported Diseases"]
  },
  reports: {
    response: "The report generator creates comprehensive summaries with charts, risk predictions, and mutation tables. Reports can be exported as PDF or CSV for clinical use. Should I show you how to generate your first report?",
    suggestions: ["Generate Report", "Export Options", "Clinical Format"]
  },
  privacy: {
    response: "We take data privacy seriously! All genomic data is encrypted, hashed during transfer, and follows HIPAA-inspired guidelines. Users can only access their own data, and consent is required before any analysis. What specific privacy concerns do you have?",
    suggestions: ["Data Encryption", "Access Controls", "Consent Process"]
  }
};

export const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your GenomeHub assistant. I can help you with file uploads, analysis guidance, understanding results, and navigating the platform. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Simple keyword-based response system
    const lowerInput = inputValue.toLowerCase();
    let response = "I understand you're asking about genomic analysis. Could you be more specific? I can help with uploads, analysis, variants, predictions, reports, or privacy questions.";
    let suggestions = ["File Upload", "Data Analysis", "Risk Prediction", "Generate Report"];

    if (lowerInput.includes('upload') || lowerInput.includes('file')) {
      response = chatResponses.upload.response;
      suggestions = chatResponses.upload.suggestions;
    } else if (lowerInput.includes('analys') || lowerInput.includes('sequence')) {
      response = chatResponses.analysis.response;
      suggestions = chatResponses.analysis.suggestions;
    } else if (lowerInput.includes('variant') || lowerInput.includes('mutation') || lowerInput.includes('snp')) {
      response = chatResponses.variants.response;
      suggestions = chatResponses.variants.suggestions;
    } else if (lowerInput.includes('predict') || lowerInput.includes('risk') || lowerInput.includes('disease')) {
      response = chatResponses.predictions.response;
      suggestions = chatResponses.predictions.suggestions;
    } else if (lowerInput.includes('report') || lowerInput.includes('export') || lowerInput.includes('pdf')) {
      response = chatResponses.reports.response;
      suggestions = chatResponses.reports.suggestions;
    } else if (lowerInput.includes('privacy') || lowerInput.includes('security') || lowerInput.includes('consent')) {
      response = chatResponses.privacy.response;
      suggestions = chatResponses.privacy.suggestions;
    }

    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: suggestions
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputValue('');
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    handleSend();
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-5">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Dna className="h-5 w-5" />
                <span className="font-medium">GenomeHub Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg transition-all duration-300 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs p-2 bg-blue-50 dark:bg-gray-600 rounded border hover:bg-blue-100 dark:hover:bg-gray-500 transition-colors duration-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about genomic analysis..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};