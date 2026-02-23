import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { User, ServiceContract } from './types';
import { SERVICES } from './mockData';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [servicesList, setServicesList] = useState<ServiceContract[]>(SERVICES);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddService = (newService: ServiceContract) => {
    setServicesList([...servicesList, newService]);
  };

  const handleRemoveService = (id: string) => {
    setServicesList(servicesList.filter(s => s.id !== id));
  };

  const handleUpdateService = (updatedService: ServiceContract) => {
    setServicesList(servicesList.map(s => s.id === updatedService.id ? updatedService : s));
  };

  return (
    <>
      {!currentUser ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <Dashboard 
          user={currentUser} 
          onLogout={handleLogout}
          servicesList={servicesList}
          onAddService={handleAddService}
          onRemoveService={handleRemoveService}
          onUpdateService={handleUpdateService}
        />
      )}
    </>
  );
};

export default App;