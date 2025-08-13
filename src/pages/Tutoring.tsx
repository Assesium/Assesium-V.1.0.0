import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  DollarSign, 
  Clock, 
  Star, 
  Search, 
  Filter,
  Plus,
  MapPin,
  Video,
  MessageCircle,
  CreditCard,
  User,
  GraduationCap,
  Award,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import PaymentMethodModal from '../components/modals/PaymentMethodModal';
import BookingModal from '../components/modals/BookingModal';
import PaymentDetailsModal from '../components/modals/PaymentDetailsModal';
import AddTutorModal from '../components/modals/AddTutorModal';

const Tutoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showTutorForm, setShowTutorForm] = useState(false);
  const [showAddTutorModal, setShowAddTutorModal] = useState(false);
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  const [editPaymentMethod, setEditPaymentMethod] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [bookingForm, setBookingForm] = useState({
    studentName: '',
    date: '',
    time: '9:00 AM - 10:00 AM',
    sessionType: 'Online',
    notes: ''
  });
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      name: 'Visa ending in 4242',
      details: '**** **** **** 4242',
      isPrimary: true,
      cardNumber: '**** **** **** 4242',
      cardholderName: 'John Doe',
      expiryDate: '12/25',
      cvv: '***',
      billingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        postalCode: '10001'
      },
      saveForFuture: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      type: 'paypal',
      name: 'PayPal Account',
      details: 'user@example.com',
      isPrimary: false,
      cardNumber: 'N/A',
      cardholderName: 'John Doe',
      expiryDate: 'N/A',
      cvv: 'N/A',
      billingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        postalCode: '10001'
      },
      saveForFuture: true,
      createdAt: '2024-01-10T15:20:00Z',
      updatedAt: '2024-01-10T15:20:00Z'
    }
  ]);

  const [tutors, setTutors] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      subject: 'Mathematics',
      experience: '8 years',
      rating: 4.9,
      rate: '$45/hour',
      availability: 'Available',
      location: 'Online & In-Person',
      qualifications: 'PhD in Mathematics, MIT',
      specialties: ['Calculus', 'Algebra', 'Statistics'],
      profileImage: '/images/profiles/EFYWjRWffGXN.jpg'
    },
    {
      id: 2,
      name: 'Prof. James Rodriguez',
      subject: 'Physics',
      experience: '12 years',
      rating: 4.8,
      rate: '$60/hour',
      availability: 'Busy',
      location: 'In-Person Only',
      qualifications: 'PhD in Physics, Stanford',
      specialties: ['Quantum Physics', 'Mechanics', 'Thermodynamics'],
      profileImage: '/images/profiles/ZWLWcRggpYva.jpg'
    },
    {
      id: 3,
      name: 'Ms. Emily Thompson',
      subject: 'English Literature',
      experience: '6 years',
      rating: 5.0,
      rate: '$40/hour',
      availability: 'Available',
      location: 'Online Only',
      qualifications: 'MA in English Literature, Harvard',
      specialties: ['Creative Writing', 'Poetry', 'Essay Writing'],
      profileImage: '/images/profiles/ZWLWcRggpYva.jpg'
    }
  ]);

  const handleAddPaymentMethod = () => {
    setEditPaymentMethod(null);
    setShowPaymentMethodModal(true);
  };

  const handleAddTutor = () => {
    setShowAddTutorModal(true);
  };

  const handleSaveTutor = (tutorData: any) => {
    const newTutor = {
      id: Date.now(),
      ...tutorData,
      rating: tutorData.rating || 0 // New tutors start with the provided rating or 0
    };
    setTutors([...tutors, newTutor]);
    setNotifications([...notifications, {
      id: Date.now(),
      type: 'success',
      message: `Tutor ${tutorData.name} has been added successfully!`,
      timestamp: new Date().toLocaleTimeString()
    }]);
    setShowAddTutorModal(false);
  };

  const handleViewPaymentMethod = (method: any) => {
    setSelectedPaymentMethod(method);
    setShowPaymentDetailsModal(true);
  };

  const handleDeletePaymentMethod = (methodId: number) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== methodId));
    setNotifications([...notifications, {
      id: Date.now(),
      type: 'success',
      message: 'Payment method has been deleted successfully!',
      timestamp: new Date().toLocaleTimeString()
    }]);
    setShowPaymentDetailsModal(false);
  };

  const handleEditPaymentMethod = (method: any) => {
    setEditPaymentMethod(method);
    setShowPaymentMethodModal(true);
  };

  const handleSavePaymentMethod = (paymentMethod: any) => {
    if (editPaymentMethod) {
      // Update existing payment method
      const updatedPaymentMethods = paymentMethods.map(method => 
        method.id === editPaymentMethod.id 
          ? { ...method, ...paymentMethod, updatedAt: new Date().toISOString() }
          : method
      );
      setPaymentMethods(updatedPaymentMethods);
      setNotifications([...notifications, {
        id: Date.now(),
        type: 'success',
        message: `Payment method ${paymentMethod.name} has been updated successfully!`,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setEditPaymentMethod(null);
    } else {
      // Add new payment method
      const newPaymentMethod = {
        id: Date.now(),
        ...paymentMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPaymentMethods([...paymentMethods, newPaymentMethod]);
      setNotifications([...notifications, {
        id: Date.now(),
        type: 'success',
        message: `Payment method ${paymentMethod.name} has been added successfully!`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
    setShowPaymentMethodModal(false);
  };

  const handleScheduleSession = () => {
    setSelectedTutor(null);
    setBookingForm({
      studentName: '',
      date: '',
      time: '9:00 AM - 10:00 AM',
      sessionType: 'Online',
      notes: ''
    });
    setShowBookingModal(true);
  };

  const handleBookSession = (tutor: any) => {
    setSelectedTutor(tutor);
    setBookingForm({
      studentName: '',
      date: '',
      time: '9:00 AM - 10:00 AM',
      sessionType: 'Online',
      notes: `Session with ${tutor.name} for ${tutor.subject}`
    });
    setShowBookingModal(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingForm.studentName && bookingForm.date) {
      const newSession = {
        id: Date.now(),
        student: bookingForm.studentName,
        teacher: selectedTutor ? selectedTutor.name : 'TBD',
        subject: selectedTutor ? selectedTutor.subject : 'General',
        date: bookingForm.date,
        time: bookingForm.time,
        status: 'Scheduled',
        type: bookingForm.sessionType,
        rate: selectedTutor ? selectedTutor.rate : '$45/hour',
        rating: selectedTutor ? selectedTutor.rating : 0
      };
      
      setNotifications([...notifications, {
        id: Date.now(),
        type: 'success',
        message: `Session booked successfully for ${bookingForm.studentName}!`,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
      setShowBookingModal(false);
      setBookingForm({
        studentName: '',
        date: '',
        time: '9:00 AM - 10:00 AM',
        sessionType: 'Online',
        notes: ''
      });
      setSelectedTutor(null);
    }
  };

  const handleMessageTutor = (tutor: any) => {
    setNotifications([...notifications, {
      id: Date.now(),
      type: 'success',
      message: `Message sent to ${tutor.name}!`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };
  
  const tutoringSessions = [
    {
      id: 1,
      student: 'Emma Johnson',
      teacher: 'Dr. Sarah Wilson',
      subject: 'Mathematics',
      date: '2024-12-16',
      time: '2:00 PM - 3:00 PM',
      status: 'Scheduled',
      type: 'Online',
      rate: '$45/hour',
      rating: 4.9
    },
    {
      id: 2,
      student: 'Michael Chen',
      teacher: 'Prof. James Rodriguez',
      subject: 'Physics',
      date: '2024-12-16',
      time: '4:00 PM - 5:30 PM',
      status: 'In Progress',
      type: 'In-Person',
      rate: '$60/hour',
      rating: 4.8
    },
    {
      id: 3,
      student: 'Sophia Davis',
      teacher: 'Ms. Emily Thompson',
      subject: 'English Literature',
      date: '2024-12-17',
      time: '10:00 AM - 11:00 AM',
      status: 'Completed',
      type: 'Online',
      rate: '$40/hour',
      rating: 5.0
    }
  ];

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Tutors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 8% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$12,450</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 15% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 0.2 from last month</p>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tutoring Sessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tutoringSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src="/images/profiles/n91lAu9LXutZ.jpg" alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{session.student}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={tutors.find(t => t.name === session.teacher)?.profileImage || 
                          (session.teacher === 'Dr. Sarah Wilson' ? '/images/profiles/EFYWjRWffGXN.jpg' : 
                          session.teacher === 'Prof. James Rodriguez' ? '/images/profiles/VDztaTdpSgnw.jpg' : 
                          session.teacher === 'Ms. Emily Thompson' ? '/images/profiles/ZWLWcRggpYva.jpg' : 
                          '/images/profiles/uTFAIJG9jQbS.jpg')}
                          alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{session.teacher}</div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{session.rating}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{session.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>{session.date}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{session.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      session.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      session.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      {session.type === 'Online' ? (
                        <Video className="h-4 w-4 text-blue-500 mr-1" />
                      ) : (
                        <MapPin className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      {session.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{session.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTutors = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tutors by name, subject, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={handleAddTutor}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tutor
            </button>
          </div>
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <div key={tutor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img 
                      src={tutor.profileImage} 
                      alt={tutor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tutor.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tutor.subject}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  tutor.availability === 'Available' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {tutor.availability}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Experience</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{tutor.experience}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">{tutor.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Rate</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{tutor.rate}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{tutor.location}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Qualifications</p>
                <p className="text-sm text-gray-900 dark:text-white">{tutor.qualifications}</p>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Specialties</p>
                <div className="flex flex-wrap gap-1">
                  {tutor.specialties.map((specialty, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button 
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm"
                  onClick={() => handleBookSession(tutor)}
                >
                  Book Session
                </button>
                <button 
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handleMessageTutor(tutor)}
                  title="Send message to tutor"
                >
                  <MessageCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$12,450</p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 15% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$2,340</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">5 pending transactions</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$3,890</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 8% from last month</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Methods</h3>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              onClick={handleAddPaymentMethod}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    {method.type === 'paypal' ? (
                      <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.79A.859.859 0 0 1 5.79 2h8.263c.734 0 1.434.155 2.029.428 1.295.595 2.016 1.787 1.816 3.401-.47 3.79-2.906 5.748-6.778 5.748H8.27l-.94 6.02c-.049.312-.312.74-.623.74z"/>
                        <path d="M19.891 7.788c-.346 2.692-1.996 4.507-4.891 4.507h-3.429l-.94 6.02c-.049.312-.312.74-.623.74H7.076a.641.641 0 0 1-.633-.74l.94-6.02h2.85c3.872 0 6.308-1.958 6.778-5.748.2-1.614-.521-2.806-1.816-3.401-.595-.273-1.295-.428-2.029-.428H5.79a.859.859 0 0 0-.846.79L1.837 20.597a.641.641 0 0 0 .633.74h4.606c.311 0 .574-.428.623-.74l.94-6.02h3.429c2.895 0 4.545-1.815 4.891-4.507z" opacity="0.7"/>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{method.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{method.details}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isPrimary && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs rounded-full">
                      Primary
                    </span>
                  )}
                  <button
                    onClick={() => handleViewPaymentMethod(method)}
                    className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditPaymentMethod(method)}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Dec 15, 2024</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Mathematics Tutoring Session</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Emma Johnson</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">$45.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Dec 14, 2024</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Physics Tutoring Session</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Michael Chen</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">$90.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow-lg flex items-center justify-between min-w-80 ${
                notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              <div className="flex items-center">
                {notification.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-xs opacity-75">{notification.timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tutoring Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage tutoring sessions, assign teachers, and handle payments
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            onClick={handleScheduleSession}
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Session
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tutors')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tutors'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Available Tutors
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payments'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Payments
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'tutors' && renderTutors()}
      {activeTab === 'payments' && renderPayments()}

      {/* Payment Method Modal */}
      {showPaymentMethodModal && (
        <PaymentMethodModal
          isOpen={showPaymentMethodModal}
          onClose={() => {
            setShowPaymentMethodModal(false);
            setEditPaymentMethod(null);
          }}
          onSave={handleSavePaymentMethod}
          initialData={editPaymentMethod}
          title={editPaymentMethod ? 'Edit Payment Method' : 'Add Payment Method'}
        />
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          show={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          handleSubmitBooking={handleSubmitBooking}
        />
      )}

      {/* Tutor Form Modal */}
      {showAddTutorModal && (
      <AddTutorModal
        show={showAddTutorModal}
        onClose={() => setShowAddTutorModal(false)}
        onSave={handleSaveTutor}
      />
      )}

      {/* Payment Details Modal */}
      {showPaymentDetailsModal && selectedPaymentMethod && (
        <PaymentDetailsModal
          isOpen={showPaymentDetailsModal}
          onClose={() => setShowPaymentDetailsModal(false)}
          payment={selectedPaymentMethod}
        />
      )}
    </div>
  );
};

export default Tutoring;

