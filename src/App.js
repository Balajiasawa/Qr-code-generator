import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Link, MessageSquare, User, Download, Copy, Check, Eye, EyeOff, LogOut, UserPlus, LogIn } from 'lucide-react';
import './App.css'; // Make sure this is correctly configured for Tailwind CSS

// --- TRANSLATIONS (Keep this as is) ---
const TRANSLATIONS = {
  "en-US": {
    "appTitle": "QR Code Generator",
    "appDescription": "Generate QR codes for URLs, text, and contact information",
    "loginTitle": "Welcome Back",
    "loginDescription": "Sign in to access the QR Code Generator",
    "signupTitle": "Create Account",
    "signupDescription": "Join us to start generating QR codes",
    "email": "Email Address",
    "emailPlaceholder": "Enter your email",
    "password": "Password",
    "passwordPlaceholder": "Enter your password",
    "confirmPassword": "Confirm Password",
    "confirmPasswordPlaceholder": "Confirm your password",
    "fullName": "Full Name",
    "fullNamePlaceholder": "Enter your full name",
    "loginButton": "Sign In",
    "signupButton": "Create Account",
    "switchToSignup": "Don't have an account? Sign up",
    "switchToLogin": "Already have an account? Sign in",
    "logout": "Logout",
    "welcome": "Welcome",
    "urlTab": "URL",
    "textTab": "Text",
    "contactTab": "Contact",
    "enterUrl": "Enter URL",
    "enterText": "Enter Text",
    "contactInformation": "Contact Information",
    "websiteUrl": "Website URL",
    "urlPlaceholder": "example.com or https://example.com",
    "urlHelp": "Enter a website URL. If you don't include http://, we'll add https:// automatically.",
    "textContent": "Text Content",
    "textPlaceholder": "Enter any text to generate QR code...",
    "firstName": "First Name",
    "firstNamePlaceholder": "John",
    "lastName": "Last Name",
    "lastNamePlaceholder": "Doe",
    "phoneNumber": "Phone Number",
    "phonePlaceholder": "+1 (555) 123-4567",
    "emailAddress": "Email Address",
    "emailPlaceholder": "john.doe@example.com",
    "organization": "Organization",
    "organizationPlaceholder": "Company Name",
    "website": "Website",
    "websitePlaceholder": "https://example.com",
    "clearAllFields": "Clear All Fields",
    "generatedQrCode": "Generated QR Code",
    "scanQrCode": "Scan this QR code with your device",
    "fillFormPrompt": "Fill in the form to generate your QR code",
    "download": "Download",
    "copyData": "Copy Data",
    "copied": "Copied!",
    "qrCodeData": "QR Code Data:",
    "footerText": "Generate QR codes instantly • No data stored • Free to use",
    "qrCodeAlt": "Generated QR Code",
    "emailRequired": "Email is required",
    "passwordRequired": "Password is required",
    "passwordMismatch": "Passwords don't match",
    "nameRequired": "Full name is required",
    "invalidEmail": "Please enter a valid email address",
    "passwordTooShort": "Password must be at least 6 characters",
    "loginFailed": "Invalid email or password",
    "signupFailed": "Failed to create account. Email might already exist.",
    "signupSuccess": "Account created successfully! Please sign in."
  }
};

const appLocale = '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

// Mock authentication functions (replace with real API calls)
const mockUsers = []; // This will store your registered users for this session

const authenticateUser = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    return { success: true, user: { email: user.email, name: user.name } };
  }
  return { success: false, error: t('loginFailed') };
};

const registerUser = (name, email, password) => {
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return { success: false, error: t('signupFailed') };
  }
  
  const newUser = { name, email, password };
  mockUsers.push(newUser);
  return { success: true, message: t('signupSuccess') };
};

// --- AuthForm Component (Keep this as is) ---
const AuthForm = ({ isLogin, onToggle, onAuthenticate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordTooShort');
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = t('nameRequired');
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('passwordMismatch');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const result = authenticateUser(formData.email, formData.password);
        if (result.success) {
          onAuthenticate(result.user);
        } else {
          setErrors({ submit: result.error });
        }
      } else {
        const result = registerUser(formData.name, formData.email, formData.password);
        if (result.success) {
          setMessage(result.message);
          setTimeout(() => {
            onToggle();
            setMessage('');
          }, 2000);
        } else {
          setErrors({ submit: result.error });
        }
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    }

    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-700 to-black rounded-2xl mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? t('loginTitle') : t('signupTitle')}
            </h2>
            <p className="text-gray-400">
              {isLogin ? t('loginDescription') : t('signupDescription')}
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-xl">
              <p className="text-green-300 text-sm text-center">{message}</p>
            </div>
          )}

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-xl">
              <p className="text-red-300 text-sm text-center">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('fullName')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('fullNamePlaceholder')}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={t('emailPlaceholder')}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={t('passwordPlaceholder')}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 ${
                    errors.password ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('confirmPassword')}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder={t('confirmPasswordPlaceholder')}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-black text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {isLogin ? t('loginButton') : t('signupButton')}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              {isLogin ? t('switchToSignup') : t('switchToLogin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- QRCodeGenerator Component (Ends here, removed the footer and closing divs which are now in App) ---
const QRCodeGenerator = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('url');
  const [qrData, setQrData] = useState('');
  const [copied, setCopied] = useState(false);
  const qrContainerRef = useRef(null);
  
  // Form states for different types
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    organization: '',
    url: ''
  });

  // QR Code generation using QRious library via CDN
  const generateQRCode = async (text) => {
    if (!text.trim()) {
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = '';
      }
      return;
    }

    try {
      // Load QRious library dynamically
      if (!window.QRious) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
        script.onload = () => {
          createQR(text);
        };
        document.head.appendChild(script);
      } else {
        createQR(text);
      }
    } catch (error) {
      console.error('Error loading QR library:', error);
      // Fallback to Google Charts API
      generateFallbackQR(text);
    }
  };

  const createQR = (text) => {
    if (!qrContainerRef.current) return;
    
    try {
      // Clear previous QR code
      qrContainerRef.current.innerHTML = '';
      
      // Create canvas element
      const canvas = document.createElement('canvas');
      qrContainerRef.current.appendChild(canvas);
      
      // Generate QR code
      const qr = new window.QRious({
        element: canvas,
        value: text,
        size: 300,
        background: 'white',
        foreground: 'black',
        level: 'M'
      });
      
      // Style the canvas
      canvas.className = 'w-full h-auto rounded-xl shadow-lg bg-white';
      canvas.style.maxWidth = '300px';
      canvas.style.height = 'auto';
      
    } catch (error) {
      console.error('Error creating QR code:', error);
      generateFallbackQR(text);
    }
  };

  const generateFallbackQR = (text) => {
    if (!qrContainerRef.current) return;
    
    // Clear previous content
    qrContainerRef.current.innerHTML = '';
    
    // Create img element for fallback
    const img = document.createElement('img');
    const encodedData = encodeURIComponent(text);
    img.src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodedData}&choe=UTF-8`;
    img.alt = t('qrCodeAlt');
    img.className = 'w-full h-auto rounded-xl shadow-lg bg-white p-4';
    img.style.maxWidth = '300px';
    img.style.height = 'auto';
    
    // Add error handling for the fallback image
    img.onerror = () => {
      // If Google Charts also fails, try QR Server API
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&format=png&margin=10`;
    };
    
    qrContainerRef.current.appendChild(img);
  };

  const formatUrl = (url) => {
    if (!url.trim()) return '';
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  };

  const generateVCard = (contact) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
ORG:${contact.organization}
TEL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.url}
END:VCARD`;
    return vcard;
  };

  useEffect(() => {
    let data = '';
    
    switch (activeTab) {
      case 'url':
        data = formatUrl(urlInput);
        break;
      case 'text':
        data = textInput;
        break;
      case 'contact':
        if (contactInfo.firstName || contactInfo.lastName || contactInfo.phone || contactInfo.email) {
          data = generateVCard(contactInfo);
        }
        break;
      default:
        data = '';
    }
    
    setQrData(data);
    generateQRCode(data);
  }, [activeTab, urlInput, textInput, contactInfo]);

  const downloadQRCode = () => {
    if (!qrData) return;
    
    const canvas = qrContainerRef.current?.querySelector('canvas');
    const img = qrContainerRef.current?.querySelector('img');
    
    if (canvas) {
      // Download from canvas
      const link = document.createElement('a');
      link.download = `qr-code-${activeTab}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } else if (img) {
      // Download from image
      const link = document.createElement('a');
      link.download = `qr-code-${activeTab}.png`;
      link.href = img.src;
      link.click();
    }
  };

  const copyToClipboard = async () => {
    if (qrData) {
      try {
        await navigator.clipboard.writeText(qrData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const resetForm = () => {
    setUrlInput('');
    setTextInput('');
    setContactInfo({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      organization: '',
      url: ''
    });
    setQrData('');
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
    }
  };

  const tabs = [
    { id: 'url', label: t('urlTab'), icon: Link },
    { id: 'text', label: t('textTab'), icon: MessageSquare },
    { id: 'contact', label: t('contactTab'), icon: User }
  ];

  return (
    // Moved the main div wrapping to the App component for conditional rendering
    <div className="max-w-4xl mx-auto">
        {/* Header with user info and logout */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-700 to-black rounded-2xl mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent mb-2">
              {t('appTitle')}
            </h1>
            <p className="text-gray-300 text-lg">{t('appDescription')}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-gray-400 text-sm">{t('welcome')}</p>
              <p className="text-white font-medium">{user.name}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-all duration-200 border border-gray-600"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Tab Navigation */}
          <div className="border-b border-gray-700">
            <nav className="flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-white border-b-2 border-gray-400 bg-gray-800'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {activeTab === 'url' && t('enterUrl')}
                  {activeTab === 'text' && t('enterText')}
                  {activeTab === 'contact' && t('contactInformation')}
                </h2>

                {/* URL Input */}
                {activeTab === 'url' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('websiteUrl')}
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder={t('urlPlaceholder')}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {t('urlHelp')}
                    </p>
                  </div>
                )}

                {/* Text Input */}
                {activeTab === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('textContent')}
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={t('textPlaceholder')}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 resize-none bg-gray-800 text-white placeholder-gray-400"
                    />
                  </div>
                )}

                {/* Contact Input */}
                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {t('firstName')}
                        </label>
                        <input
                          type="text"
                          value={contactInfo.firstName}
                          onChange={(e) => setContactInfo({...contactInfo, firstName: e.target.value})}
                          placeholder={t('firstNamePlaceholder')}
                          className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {t('lastName')}
                        </label>
                        <input
                          type="text"
                          value={contactInfo.lastName}
                          onChange={(e) => setContactInfo({...contactInfo, lastName: e.target.value})}
                          placeholder={t('lastNamePlaceholder')}
                          className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('phoneNumber')}
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        placeholder={t('phonePlaceholder')}
                        className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('emailAddress')}
                      </label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        placeholder={t('emailPlaceholder')}
                        className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('organization')}
                      </label>
                      <input
                        type="text"
                        value={contactInfo.organization}
                        onChange={(e) => setContactInfo({...contactInfo, organization: e.target.value})}
                        placeholder={t('organizationPlaceholder')}
                        className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('website')}
                      </label>
                      <input
                        type="url"
                        value={contactInfo.url}
                        onChange={(e) => setContactInfo({...contactInfo, url: e.target.value})}
                        placeholder={t('websitePlaceholder')}
                        className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={resetForm} 
                  className="w-full px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-all duration-200 font-medium border border-gray-600"
                >
                  {t('clearAllFields')}
                </button>
              </div>

              {/* QR Code Display Section */}
              <div className="flex flex-col items-center space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">{t('generatedQrCode')}</h2>
                <div className="bg-gray-50 rounded-2xl p-8 w-full max-w-sm">
                  {qrData ? (
                    <div className="text-center">
                      <div ref={qrContainerRef} className="flex justify-center">
                        {/* QR code will be dynamically inserted here */}
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        {t('scanQrCode')}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {t('fillFormPrompt')}
                      </p>
                    </div>
                  )}
                </div>

                {qrData && (
                  <div className="flex gap-4 w-full max-w-sm">
                    <button
                      onClick={downloadQRCode}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      {t('download')}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          {t('copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {t('copyData')}
                        </>
                      )}
                    </button>
                  </div>
                )}

                {qrData && (
                  <div className="w-full max-w-sm">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">{t('qrCodeData')}</h3>
                    <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 max-h-32 overflow-y-auto">
                      <pre className="whitespace-pre-wrap break-words">{qrData}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>{t('footerText')}</p>
        </div>
      </div>
  );
};

// --- New App Component (This is the main entry point now) ---
function App() {
  const [user, setUser] = useState(null); // State to hold logged-in user info
  const [isLoginView, setIsLoginView] = useState(true); // State to toggle between login/signup

  // Check for stored user on initial load (e.g., from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('qr_gen_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        localStorage.removeItem('qr_gen_user');
      }
    }
  }, []);

  // Persist user data to localStorage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('qr_gen_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('qr_gen_user');
    }
  }, [user]);

  const handleAuthenticate = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoginView(true); // Go back to login form after logout
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {user ? (
        // If user is logged in, show the QR Code Generator
        <QRCodeGenerator user={user} onLogout={handleLogout} />
      ) : (
        // If no user, show the authentication form (login or signup)
        <AuthForm
          isLogin={isLoginView}
          onToggle={() => setIsLoginView(!isLoginView)}
          onAuthenticate={handleAuthenticate}
        />
      )}
    </div>
  );
}

export default App;