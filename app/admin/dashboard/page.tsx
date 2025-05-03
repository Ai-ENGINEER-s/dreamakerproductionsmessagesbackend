"use client";

import { useState, useEffect } from 'react';
import {
  Search, Download, Moon, Sun, Bell, User, Menu, X, Film,
  Mail, Users, Phone, Calendar, ChevronRight, ArrowRight,
  PieChart, Activity, Star, Filter, Globe, Trash, Send,
  AlertTriangle, Clock
} from 'lucide-react';

// Type definitions
type ContactMessage = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
};

type NewsletterSubscriber = {
  id: number;
  email: string;
  subscribedAt: string;
};

type AnalyticsData = {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: string;
  avgSessionDuration: string;
  topPages: Array<{ page: string, views: number }>;
};

export default function AdminDashboard() {
  // States
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [activeTab, setActiveTab] = useState('contacts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });

  // Fetch data
// Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data from API...');
        
        // Real API calls to fetch contacts and subscribers
        const [contactsRes, subscribersRes] = await Promise.all([
          fetch('/api/contact'),
          fetch('/api/newsletter')
        ]);
        
        // Check if responses were successful
        if (!contactsRes.ok) {
          throw new Error(`Failed to fetch contacts: ${contactsRes.status}`);
        }
        
        if (!subscribersRes.ok) {
          throw new Error(`Failed to fetch subscribers: ${subscribersRes.status}`);
        }
        
        // Parse response data
        const contactsData = await contactsRes.json();
        const subscribersData = await subscribersRes.json();
        
        // Update state with fetched data
        setContacts(contactsData);
        setSubscribers(subscribersData);
        
        // Add analytics data (still using mock data for analytics)
        setAnalyticsData({
          pageViews: 12845,
          uniqueVisitors: 5732,
          bounceRate: "42.3%",
          avgSessionDuration: "3m 24s",
          topPages: [
            { page: "/home", views: 4532 },
            { page: "/films", views: 3211 },
            { page: "/about", views: 1876 },
            { page: "/contact", views: 1226 }
          ]
        });
        
        setLoading(false);
      } catch (err:any) {
        console.error('Error fetching data:', err);
        setError(`Unable to load data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // Add test data
  const addTestData = () => {
    setContacts([
      {
        id: 1,
        fullName: "Thomas Wright",
        email: "thomas@dreammaker.com",
        phone: "555-123-4567",
        message: "Hello, I'd like to discuss a documentary film project about modern architecture. Could you contact me to discuss this further?",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        fullName: "Marie Johnson",
        email: "marie@cineprod.com",
        phone: "555-987-6543",
        message: "I'm looking for a partnership for my next short film. I've greatly appreciated your previous productions and think our collaboration could be fruitful.",
        createdAt: "2023-12-15T14:30:00.000Z"
      },
      {
        id: 3,
        fullName: "John Smith",
        email: "john@example.com",
        phone: "555-555-1234",
        message: "Hello, I'm a film student and I'd like to know if it would be possible to do an internship at your company? I've admired your work for a long time.",
        createdAt: "2024-01-03T09:15:00.000Z"
      }
    ]);
    
    setSubscribers([
      {
        id: 1,
        email: "newsletter@example.com",
        subscribedAt: new Date().toISOString()
      },
      {
        id: 2,
        email: "julie@cinema-lovers.com",
        subscribedAt: "2023-11-20T10:25:00.000Z"
      },
      {
        id: 3,
        email: "marc@producer.com",
        subscribedAt: "2024-01-05T16:42:00.000Z"
      },
      {
        id: 4,
        email: "sophie@director.com",
        subscribedAt: "2023-12-12T08:30:00.000Z"
      }
    ]);

    setAnalyticsData({
      pageViews: 12845,
      uniqueVisitors: 5732,
      bounceRate: "42.3%",
      avgSessionDuration: "3m 24s",
      topPages: [
        { page: "/home", views: 4532 },
        { page: "/films", views: 3211 },
        { page: "/about", views: 1876 },
        { page: "/contact", views: 1226 }
      ]
    });
  };

  // Filter data based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.phone && contact.phone.includes(searchTerm)) ||
    contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export subscribers to CSV
  const exportSubscribers = async () => {
    try {
      console.log('Attempting to export subscribers...');
      // Create CSV content
      const header = ['Email', 'Subscription Date'];
      const csvRows = [
        header.join(','),
        ...subscribers.map(s => `${s.email},${formatDate(s.subscribedAt)}`)
      ];
      const csvContent = csvRows.join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setShowSuccessMessage('Subscribers exported successfully!');
      setTimeout(() => setShowSuccessMessage(''), 3000);
    } catch (err:any) {
      console.error('Error exporting:', err);
      alert('Error during export: ' + err.message);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Invalid date';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (err) {
      console.error('Date formatting error:', err, dateString);
      return 'Invalid date';
    }
  };

  // Handle contact archiving
  const archiveContact = () => {
    if (selectedContact) {
      setContacts(prevContacts => prevContacts.filter(c => c.id !== selectedContact.id));
      setSelectedContact(null);
      setConfirmArchive(false);
      setShowSuccessMessage('Message archived successfully!');
      setTimeout(() => setShowSuccessMessage(''), 3000);
    }
  };
  
  // Handle subscriber deletion
  const deleteSubscriber = (id: number) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
    setConfirmDelete(null);
    setShowSuccessMessage('Subscriber deleted successfully!');
    setTimeout(() => setShowSuccessMessage(''), 3000);
  };

  // Handle email sending
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending email:', emailData);
    
    // Simulating email sending
    setShowSuccessMessage('Email sent successfully!');
    setTimeout(() => setShowSuccessMessage(''), 3000);
    setShowEmailModal(false);
  };

  // Open email composer
  const openEmailComposer = (email: string) => {
    setEmailData({
      to: email,
      subject: '',
      message: ''
    });
    setShowEmailModal(true);
  };

  // Navigate website
  const handleNavigateToWebsite = () => {
    window.open('https://inquisitive-kelpie-492636.netlify.app/', '_blank');
  };

  // Conditional classes based on dark mode
  const pageClasses = darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-800'; 
  const cardClasses = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const headerClasses = darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-100';
  const inputClasses = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
  const buttonClasses = darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200';
  const highlightColor = "from-indigo-600 to-purple-500"; // Consistent brand color

  return (
    <div className={`min-h-screen ${pageClasses} font-sans`}>
      {/* Success message toast */}
      {showSuccessMessage && (
        <div className="fixed top-6 right-6 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg z-50 animate-fadeIn">
          {showSuccessMessage}
        </div>
      )}
      
      {/* Header */}
      <header className={`${headerClasses} border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md bg-opacity-90 transition-all duration-300`}>
        <div className="flex items-center">
          <button 
            className="lg:hidden mr-4"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 text-white flex items-center justify-center mr-3 shadow-lg">
              <Film size={20} />
            </div>
            <span className="font-light">Dreamaker Proudions</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className={`pl-10 pr-4 py-2 w-64 rounded-full border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${inputClasses}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors relative`}
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </button>
            
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 ${cardClasses} border rounded-xl shadow-lg p-4 z-50`}>
                <h4 className="font-semibold mb-2">Notifications</h4>
                <div className={`p-3 mb-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">New subscriber: sophie@director.com</span>
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 block`}>Just now</span>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                    <span className="text-sm">New message from Thomas Wright</span>
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 block`}>5 minutes ago</span>
                </div>
              </div>
            )}
          </div>

          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 shadow-md flex items-center justify-center text-white cursor-pointer hover:shadow-lg transition-all">
            <User size={16} />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`
            ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} 
            w-64 border-r border-opacity-50 transition-all duration-300
            ${mobileMenuOpen ? 'fixed inset-y-0 z-50 pt-16 transform translate-x-0' : 'transform -translate-x-full'} 
            lg:transform-none lg:block lg:relative lg:pt-0
          `}
        >
          <nav className="py-6 px-3 h-full">
            <div className="mb-8 space-y-1">
              <h3 className={`px-3 mb-2 text-xs uppercase font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Main Menu</h3>
              
              <button
                className={`flex items-center w-full px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'contacts' 
                    ? `bg-gradient-to-r ${highlightColor} text-white shadow-md` 
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`
                }`}
                onClick={() => setActiveTab('contacts')}
              >
                <Mail className="mr-3" size={18} />
                <span>Messages</span>
                <span className={`ml-auto py-0.5 px-2 rounded-full text-xs font-medium ${
                  activeTab === 'contacts' 
                    ? 'bg-white bg-opacity-30 text-white' 
                    : `${darkMode ? 'bg-gray-800 text-indigo-400' : 'bg-indigo-100 text-indigo-800'}`
                }`}>
                  {contacts.length}
                </span>
              </button>
              
              <button
                className={`flex items-center w-full px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'subscribers' 
                    ? `bg-gradient-to-r ${highlightColor} text-white shadow-md` 
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`
                }`}
                onClick={() => setActiveTab('subscribers')}
              >
                <Users className="mr-3" size={18} />
                <span>Subscribers</span>
                <span className={`ml-auto py-0.5 px-2 rounded-full text-xs font-medium ${
                  activeTab === 'subscribers' 
                    ? 'bg-white bg-opacity-30 text-white' 
                    : `${darkMode ? 'bg-gray-800 text-indigo-400' : 'bg-indigo-100 text-indigo-800'}`
                }`}>
                  {subscribers.length}
                </span>
              </button>
              
              <button
                className={`flex items-center w-full px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'analytics' 
                    ? `bg-gradient-to-r ${highlightColor} text-white shadow-md` 
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`
                }`}
                onClick={() => setActiveTab('analytics')}
              >
                <PieChart className="mr-3" size={18} />
                <span>Analytics</span>
              </button>
              
              <button
                className={`flex items-center w-full px-4 py-3 rounded-xl transition-all ${
                  `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`
                }`}
                onClick={handleNavigateToWebsite}
              >
                <Globe className="mr-3" size={18} />
                <span>Website</span>
              </button>
            </div>

            <div className="mt-8 px-3">
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-indigo-50'} mb-6`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Stats Overview</h4>
                  <Activity size={16} className="text-indigo-500" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Messages</span>
                      <span className="font-medium">{contacts.length}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="h-1.5 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full w-1/3"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subscribers</span>
                      <span className="font-medium">{subscribers.length}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="h-1.5 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-x-hidden transition-all duration-300">
          {/* Page header */}
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                {activeTab === 'contacts' ? 'Messages' : 
                 activeTab === 'subscribers' ? 'Newsletter Subscribers' : 'Website Analytics'}
              </h2>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {activeTab === 'contacts' 
                  ? 'Manage contact messages from your clients and partners' 
                  : activeTab === 'subscribers'
                  ? 'View and export your newsletter subscribers'
                  : 'Monitor your website performance and visitor statistics'}
              </p>
            </div>
            
            {activeTab === 'subscribers' && (
              <button
                onClick={exportSubscribers}
                className="flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <Download size={18} className="mr-2" />
                Export to CSV
              </button>
            )}
          </div>
          
          {/* Search on mobile */}
          <div className="mb-6 block md:hidden">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className={`pl-10 pr-4 py-3 w-full rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${inputClasses}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Confirmation Dialog for Archiving */}
          {confirmArchive && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className={`${cardClasses} rounded-xl p-6 shadow-xl max-w-md mx-auto`}>
                <h3 className="text-xl font-bold mb-4">Confirm Archive</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                  Are you sure you want to archive this message? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    className={`px-4 py-2 rounded-lg ${buttonClasses}`}
                    onClick={() => setConfirmArchive(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    onClick={archiveContact}
                  >
                    Archive
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Dialog for Deleting Subscriber */}
          {confirmDelete !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className={`${cardClasses} rounded-xl p-6 shadow-xl max-w-md mx-auto`}>
                <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                  Are you sure you want to delete this subscriber? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    className={`px-4 py-2 rounded-lg ${buttonClasses}`}
                    onClick={() => setConfirmDelete(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    onClick={() => deleteSubscriber(confirmDelete)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Email Composition Modal */}
          {showEmailModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className={`${cardClasses} rounded-xl p-6 shadow-xl max-w-lg w-full mx-auto`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Compose Email</h3>
                <button 
  onClick={() => setShowEmailModal(false)}
  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
  aria-label="Close modal"
>
  <X size={20} />
</button>

                </div>
              <form onSubmit={handleSendEmail}>
  <div className="space-y-4">
    <div>
      <label
        htmlFor="email-to"
        className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
      >
        To:
      </label>
      <input
        id="email-to"
        type="email"
        placeholder="ex: user@example.com"
        value={emailData.to}
        onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputClasses}`}
        required
      />
    </div>

    <div>
      <label
        htmlFor="email-subject"
        className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
      >
        Subject:
      </label>
      <input
        id="email-subject"
        type="text"
        placeholder="Email subject"
        value={emailData.subject}
        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputClasses}`}
        required
      />
    </div>

    <div>
      <label
        htmlFor="email-message"
        className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
      >
        Message:
      </label>
      <textarea
        id="email-message"
        placeholder="Write your message here..."
        value={emailData.message}
        onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputClasses} min-h-32`}
        rows={6}
        required
      />
    </div>
  </div>

  <div className="flex justify-end mt-6 gap-3">
    <button
      type="button"
       onClick={() => setShowEmailModal(false)}
      className={`px-4 py-2 rounded-lg ${buttonClasses}`}
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center"
    >
      <Send size={16} className="mr-2" />
      Send Email
    </button>
  </div>
</form>

              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className={`${cardClasses} rounded-2xl p-12 flex justify-center items-center shadow-sm border transition-all duration-300`}>
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900"></div>
                  <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-500">Loading data...</p>
              </div>
            </div>
          ) : error ? (
           <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-6 rounded-2xl flex items-center border border-red-200 dark:border-red-900">
              <AlertTriangle size={24} className="mr-4 text-red-500" />
              <div>
                <h3 className="font-bold mb-1">Error Loading Data</h3>
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Contacts/Messages Tab */}
              {activeTab === 'contacts' && (
                <div>
                  {filteredContacts.length === 0 ? (
                    <div className={`${cardClasses} rounded-xl p-8 text-center border`}>
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto flex items-center justify-center mb-4">
                        <Mail size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No messages found</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                        {searchTerm ? 'Try adjusting your search criteria' : 'You don\'t have any messages yet'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Message list */}
                      <div className={`${cardClasses} rounded-2xl p-6 border transition-all duration-300`}>
                        <h3 className="font-semibold mb-4">Recent Messages</h3>
                        <div className="space-y-2 max-h-[680px] overflow-y-auto">
                          {filteredContacts.map(contact => (
                            <div 
                              key={contact.id}
                              className={`p-4 rounded-xl cursor-pointer transition-all ${
                                selectedContact?.id === contact.id 
                                  ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-md'
                                  : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                              }`}
                              onClick={() => setSelectedContact(contact)}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium">{contact.fullName}</h4>
                                <span className={`text-xs ${
                                  selectedContact?.id === contact.id 
                                    ? 'text-white/70' 
                                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {formatDate(contact.createdAt)}
                                </span>
                              </div>
                              <p className={`text-sm truncate mb-1 ${
                                selectedContact?.id === contact.id 
                                  ? 'text-white/90' 
                                  : darkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {contact.email}
                              </p>
                              <p className={`text-sm truncate ${
                                selectedContact?.id === contact.id 
                                  ? 'text-white/80' 
                                  : darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {contact.message.length > 100
                                  ? `${contact.message.substring(0, 100)}...`
                                  : contact.message
                                }
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Message details */}
                      <div className={`${cardClasses} rounded-2xl border transition-all duration-300`}>
                        {selectedContact ? (
                          <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-xl font-bold">{selectedContact.fullName}</h3>
                                  <div className="flex items-center mt-1">
                                    <Mail size={14} className="mr-1 text-gray-400" />
                                    <a 
                                      href={`mailto:${selectedContact.email}`} 
                                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                      {selectedContact.email}
                                    </a>
                                  </div>
                                  {selectedContact.phone && (
                                    <div className="flex items-center mt-1">
                                      <Phone size={14} className="mr-1 text-gray-400" />
                                      <a 
                                        href={`tel:${selectedContact.phone}`}
                                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                      >
                                        {selectedContact.phone}
                                      </a>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <span className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <Clock size={12} className="inline mr-1" />
                                    {formatDate(selectedContact.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="p-6 flex-grow overflow-y-auto">
                              <h4 className="font-medium mb-3">Message:</h4>
                              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <p className="whitespace-pre-wrap">
                                  {selectedContact.message}
                                </p>
                              </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                              <button
                                onClick={() => setConfirmArchive(true)}
                                className={`px-4 py-2 rounded-lg flex items-center ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-red-400' : 'bg-gray-100 hover:bg-gray-200 text-red-600'}`}
                              >
                                <Trash size={16} className="mr-2" />
                                Archive
                              </button>
                              <button
                                onClick={() => openEmailComposer(selectedContact.email)}
                                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center"
                              >
                                <Send size={16} className="mr-2" />
                                Reply
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full p-10">
                            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                              <Mail size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">No message selected</h3>
                            <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Select a message from the list to view its details
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Subscribers Tab */}
              {activeTab === 'subscribers' && (
                <div className={`${cardClasses} rounded-2xl p-6 border transition-all duration-300`}>
                  {filteredSubscribers.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto flex items-center justify-center mb-4">
                        <Users size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No subscribers found</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                        {searchTerm ? 'Try adjusting your search criteria' : 'You don\'t have any subscribers yet'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className={`grid grid-cols-12 gap-4 px-4 py-3 mb-2 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="col-span-1">#</div>
                        <div className="col-span-7">Email</div>
                        <div className="col-span-3">Date Subscribed</div>
                        <div className="col-span-1"></div>
                      </div>

                      <div className="space-y-2">
                        {filteredSubscribers.map((subscriber, index) => (
                          <div 
                            key={subscriber.id} 
                            className={`grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}
                          >
                            <div className="col-span-1 font-medium">
                              {(index + 1).toString().padStart(2, '0')}
                            </div>
                            <div className="col-span-7 font-medium">
                              {subscriber.email}
                            </div>
                            <div className={`col-span-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatDate(subscriber.subscribedAt)}
                            </div>
                            <div className="col-span-1 flex justify-end">
                             <button
  onClick={() => setConfirmDelete(subscriber.id)}
  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-500'}`}
  aria-label="Delete subscriber"
>
  <Trash size={16} />
</button>

                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <>
                  {/* Analytics Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className={`${cardClasses} rounded-2xl p-6 border transition-all duration-300`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
                          <Activity size={20} className="text-indigo-600" />
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                          +12.5%
                        </span>
                      </div>
                      <h3 className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Page Views</h3>
                      <p className="text-2xl font-bold">
                        {analyticsData?.pageViews.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className={`${cardClasses} rounded-2xl p-6 border transition-all duration-300`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                          <Users size={20} className="text-purple-600" />
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                          +8.3%
                        </span>
                      </div>
                      <h3 className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unique Visitors</h3>
                      <p className="text-2xl font-bold">
                        {analyticsData?.uniqueVisitors.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className={`${cardClasses} rounded-2xl p-6 border transition-all duration-300`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                          <Filter size={20} className="text-red-600" />
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>
                          +2.1%
                        </span>
                      </div>
                      <h3 className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bounce Rate</h3>
                      <p className="text-2xl font-bold">
                        {analyticsData?.bounceRate}
                      </p>
                    </div>
                    
                    <div className={`${cardClasses} rounded-2xl p-6 border transition-all duration-300`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                          <Clock size={20} className="text-blue-600" />
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                          +0.5%
                        </span>
                      </div>
                      <h3 className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Session</h3>
                      <p className="text-2xl font-bold">
                        {analyticsData?.avgSessionDuration}
                      </p>
                    </div>
                  </div>
                  
                  {/* Top Pages Table */}
                  <div className={`${cardClasses} rounded-2xl p-6 border transition-all duration-300`}>
                    <h3 className="font-semibold mb-6">Top Pages</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <th className="pb-3 text-left font-medium">Page</th>
                            <th className="pb-3 text-right font-medium">Views</th>
                            <th className="pb-3 text-right font-medium">Conversion</th>
                            <th className="pb-3 text-right font-medium">Bounce Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {analyticsData?.topPages.map((page, i) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <td className="py-4 font-medium">
                                {page.page}
                                {i === 0 && (
                                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                    Popular
                                  </span>
                                )}
                              </td>
                              <td className="py-4 text-right font-medium">
                                {page.views.toLocaleString()}
                              </td>
                              <td className="py-4 text-right">
                                <span className={`${i === 0 ? 'text-green-500' : i === 1 ? 'text-blue-500' : 'text-gray-500'}`}>
                                  {(45 - i * 7).toFixed(1)}%
                                </span>
                              </td>
                              <td className="py-4 text-right">
                                <div className="flex items-center justify-end">
                                  <span className={`mr-2 ${i === 0 ? 'text-green-500' : i === 3 ? 'text-red-500' : 'text-yellow-500'}`}>
                                    {(30 + i * 5).toFixed(1)}%
                                  </span>
                                  <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                                    <div 
                                      className={`h-full rounded-full ${
                                        i === 0 ? 'bg-green-500' : i === 3 ? 'bg-red-500' : 'bg-yellow-500'
                                      }`}
                                      style={{ width: `${30 + i * 5}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}                                                                                                                                                                                                                                                                                       
            </>
          )}
          
          {/* Footer */}
          <footer className="mt-8 text-center text-sm text-gray-500 py-6">
            <p>DreamMaker Admin Dashboard &copy; {new Date().getFullYear()}. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}