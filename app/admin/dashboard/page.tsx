"use client";

import { useState, useEffect } from 'react';
import { Search, Download, Moon, Sun, Bell, User, Menu, X, Film, Mail, Users, Phone, Calendar, ChevronRight, ArrowRight } from 'lucide-react';

// Définition des types
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

export default function AdminDashboard() {
  // États pour stocker les données
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [activeTab, setActiveTab] = useState('contacts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);

  // Récupération des données de contact
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        console.log('Tentative de récupération des contacts...');
        const response = await fetch('/api/contact');
        
        if (!response.ok) {
          console.error('Réponse API non valide:', response.status, await response.text());
          throw new Error(`Erreur lors de la récupération des contacts: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Données de contacts reçues:', data);
        setContacts(Array.isArray(data) ? data : []);
      } catch (err:any) {
        console.error('Erreur de récupération des contacts:', err);
        setError(`Impossible de charger les contacts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const fetchSubscribers = async () => {
      try {
        console.log('Tentative de récupération des abonnés...');
        const response = await fetch('/api/newsletter');
        
        if (!response.ok) {
          console.error('Réponse API non valide:', response.status, await response.text());
          throw new Error(`Erreur lors de la récupération des abonnés: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Données des abonnés reçues:', data);
        setSubscribers(Array.isArray(data) ? data : []);
      } catch (err:any) {
        console.error('Erreur de récupération des abonnés:', err);
        setError(`Impossible de charger les abonnés à la newsletter: ${err.message}`);
      }
    };

    fetchContacts();
    fetchSubscribers();
  }, []);

  // Debug - afficher les données dans la console
  useEffect(() => {
    console.log('État actuel - Contacts:', contacts);
    console.log('État actuel - Abonnés:', subscribers);
  }, [contacts, subscribers]);

  // Filtre des données basé sur le terme de recherche
  const filteredContacts = contacts.filter(contact => 
    contact.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.phone && contact.phone.includes(searchTerm)) ||
    contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Exportation des abonnés en CSV
  const exportSubscribers = async () => {
    try {
      console.log('Tentative d\'exportation des abonnés...');
      window.location.href = '/api/export-newsletter';
    } catch (err:any) {
      console.error('Erreur lors de l\'exportation:', err);
      alert('Erreur lors de l\'exportation: ' + err.message);
    }
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Date invalide';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (err) {
      console.error('Erreur de formatage de date:', err, dateString);
      return 'Date invalide';
    }
  };

  // Ajouter des données de test pour voir si le problème vient de l'API
  const addTestData = () => {
    setContacts([
      {
        id: 1,
        fullName: "Thomas Durand",
        email: "thomas@dreammaker.fr",
        phone: "01 23 45 67 89",
        message: "Bonjour, je souhaiterais discuter d'un projet de film documentaire sur l'architecture moderne. Pourriez-vous me contacter pour en discuter?",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        fullName: "Marie Lefèvre",
        email: "marie@cineprod.com",
        phone: "06 12 34 56 78",
        message: "Je recherche un partenariat pour mon prochain court-métrage. J'ai beaucoup apprécié vos productions précédentes et je pense que notre collaboration pourrait être fructueuse.",
        createdAt: "2023-12-15T14:30:00.000Z"
      },
      {
        id: 3,
        fullName: "Jean Dupont",
        email: "jean@example.com",
        phone: "07 98 76 54 32",
        message: "Bonjour, je suis étudiant en cinéma et je souhaiterais savoir s'il serait possible d'effectuer un stage au sein de votre société? J'admire votre travail depuis longtemps.",
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
        email: "julie@cinema-lovers.fr",
        subscribedAt: "2023-11-20T10:25:00.000Z"
      },
      {
        id: 3,
        email: "marc@producteur.com",
        subscribedAt: "2024-01-05T16:42:00.000Z"
      },
      {
        id: 4,
        email: "sophie@realisatrice.fr",
        subscribedAt: "2023-12-12T08:30:00.000Z"
      }
    ]);
    
    setLoading(false);
    setError('');
  };

  // Ajout automatique des données de test au chargement
  useEffect(() => {
    if (contacts.length === 0 && subscribers.length === 0 && !loading) {
      addTestData();
    }
  }, [loading, contacts.length, subscribers.length]);

  // Classes conditionnelles basées sur le mode sombre
  const pageClasses = darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-800'; 
  const cardClasses = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const highlightColor = darkMode ? 'from-purple-600 to-blue-600' : 'from-blue-600 to-purple-600';

  return (
    <div className={`min-h-screen ${pageClasses} font-sans`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md bg-opacity-90`}>
        <div className="flex items-center">
          {/* Menu mobile button */}
          <button 
            className="lg:hidden mr-4"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center mr-3 shadow-lg">
              <Film size={20} />
            </div>
            <span className="font-light">Dream<span className="font-bold">Maker</span></span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className={`pl-10 pr-4 py-2 w-64 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
         <button
  type="button"
  aria-label="Notifications"
  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} relative`}
>
  <Bell size={20} />
  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
</button>

          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-md flex items-center justify-center text-white cursor-pointer hover:shadow-lg transition-all">
            <User size={16} />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`
            ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} 
            w-64 border-r border-opacity-50
            ${mobileMenuOpen ? 'block fixed inset-y-0 z-50 pt-16' : 'hidden'} 
            lg:block lg:relative lg:pt-0
          `}
        >
          <nav className="py-6 px-3 h-full">
            <div className="mb-8 space-y-1">
              <h3 className={`px-3 mb-2 text-xs uppercase font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Menu principal</h3>
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
                    : `${darkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-100 text-blue-800'}`
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
                <span>Abonnés</span>
                <span className={`ml-auto py-0.5 px-2 rounded-full text-xs font-medium ${
                  activeTab === 'subscribers' 
                    ? 'bg-white bg-opacity-30 text-white' 
                    : `${darkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-100 text-blue-800'}`
                }`}>
                  {subscribers.length}
                </span>
              </button>
            </div>

            <div className="mt-8 px-3">
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-blue-50'} mb-6`}>
                <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Statistiques</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Messages</span>
                    <span className="font-medium">{contacts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Abonnés</span>
                    <span className="font-medium">{subscribers.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          {/* Page header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {activeTab === 'contacts' ? 'Messages' : 'Abonnés Newsletter'}
              </h2>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {activeTab === 'contacts' 
                  ? 'Gérez les messages de contact de vos clients et partenaires' 
                  : 'Consultez et exportez vos abonnés à la newsletter'}
              </p>
            </div>
            
            {activeTab === 'subscribers' && (
              <button
                onClick={exportSubscribers}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                <Download size={18} className="mr-2" />
                Exporter en CSV
              </button>
            )}
          </div>
          
          {/* Search on mobile */}
          <div className="mb-6 block md:hidden">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className={`pl-10 pr-4 py-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Content */}
          {loading ? (
            <div className={`${cardClasses} rounded-2xl p-12 flex justify-center items-center shadow-sm`}>
              <div className="flex flex-col items-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-500">Chargement des données...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-800 p-6 rounded-2xl mb-6 shadow-sm border border-red-200">
              <h3 className="font-bold mb-2">Erreur</h3>
              <p>{error}</p>
            </div>
          ) : activeTab === 'contacts' ? (
            <div>
              {filteredContacts.length === 0 ? (
                <div className={`${cardClasses} border rounded-2xl p-12 text-center shadow-sm`}>
                  <div className="flex flex-col items-center">
                    <Mail size={48} className={`${darkMode ? 'text-gray-700' : 'text-gray-300'} mb-4`} />
                    <h3 className="text-xl font-medium mb-2">Aucun message trouvé</h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Aucun message ne correspond à votre recherche
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {selectedContact ? (
                    <div className={`${cardClasses} border rounded-2xl p-6 shadow-sm overflow-hidden animate-fadeIn`}>
                      <div className="flex justify-between items-center mb-6">
                        <button 
                          onClick={() => setSelectedContact(null)}
                          className={`flex items-center text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'} transition-colors`}
                        >
                          <ArrowRight size={16} className="mr-1 transform rotate-180" />
                          Retour aux messages
                        </button>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(selectedContact.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center">
                          <span className="text-lg font-medium">{selectedContact.fullName.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="font-bold text-xl">{selectedContact.fullName}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                            <a 
                              href={`mailto:${selectedContact.email}`} 
                              className="flex items-center text-sm text-blue-500 hover:underline"
                            >
                              <Mail size={14} className="mr-1" />
                              {selectedContact.email}
                            </a>
                            {selectedContact.phone && (
                              <a 
                                href={`tel:${selectedContact.phone.replace(/\s/g, '')}`} 
                                className="flex items-center text-sm text-blue-500 hover:underline"
                              >
                                <Phone size={14} className="mr-1" />
                                {selectedContact.phone}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-6 rounded-xl mb-6`}>
                        <h4 className="font-medium mb-3">Message</h4>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} whitespace-pre-line leading-relaxed`}>
                          {selectedContact.message}
                        </p>
                      </div>
                      
                      <div className="flex gap-3">
                        <a 
                          href={`mailto:${selectedContact.email}`}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                        >
                          Répondre
                        </a>
                        <button 
                          className={`px-4 py-2 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-lg`}
                        >
                          Archiver
                        </button>
                      </div>
                    </div>
                  ) : (
                    filteredContacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className={`${cardClasses} border rounded-2xl p-6 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow`}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center">
                              <span className="font-medium">{contact.fullName.charAt(0)}</span>
                            </div>
                            <div className="ml-3">
                              <h3 className="font-semibold text-lg">{contact.fullName}</h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                <a 
                                  href={`mailto:${contact.email}`} 
                                  className="flex items-center text-sm text-blue-500 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Mail size={14} className="mr-1" />
                                  {contact.email}
                                </a>
                                {contact.phone && (
                                  <a 
                                    href={`tel:${contact.phone.replace(/\s/g, '')}`} 
                                    className="flex items-center text-sm text-blue-500 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Phone size={14} className="mr-1" />
                                    {contact.phone}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} whitespace-nowrap`}>
                            {formatDate(contact.createdAt)}
                          </span>
                        </div>
                        <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
                          {contact.message}
                        </div>
                        <div className="flex justify-end mt-4">
                          <button className="flex items-center text-sm text-blue-500 hover:underline">
                            Voir détails
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              {filteredSubscribers.length === 0 ? (
                <div className={`${cardClasses} border rounded-2xl p-12 text-center shadow-sm`}>
                  <div className="flex flex-col items-center">
                    <Users size={48} className={`${darkMode ? 'text-gray-700' : 'text-gray-300'} mb-4`} />
                    <h3 className="text-xl font-medium mb-2">Aucun abonné trouvé</h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Aucun abonné ne correspond à votre recherche
                    </p>
                  </div>
                </div>
              ) : (
                <div className={`${cardClasses} border rounded-2xl overflow-hidden shadow-sm`}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                      <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                            Date d'abonnement
                          </th>
                          <th scope="col" className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {filteredSubscribers.map((subscriber) => (
                          <tr key={subscriber.id} className={`${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <a 
                                href={`mailto:${subscriber.email}`} 
                                className="flex items-center text-blue-500 hover:underline"
                              >
                                <Mail size={16} className="mr-2" />
                                {subscriber.email}
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Calendar size={16} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                {formatDate(subscriber.subscribedAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <a 
                                href={`mailto:${subscriber.email}`} 
                                className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-md transition-shadow"
                              >
                                <Mail size={14} className="mr-1" />
                                Contacter
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}