import { useState } from 'react';
import { ChevronDown, Building2, Users, Zap } from 'lucide-react';
import { mockService } from '../services/mockService';
import type { Persona } from '../services/mockService';
import toast from 'react-hot-toast';

const personas = [
  {
    id: 'startup' as Persona,
    name: 'Startup',
    description: '45 employees, $5M revenue',
    icon: Zap,
    color: 'text-green-600'
  },
  {
    id: 'midmarket' as Persona,
    name: 'Midmarket',
    description: '180 employees, $25M revenue',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    id: 'enterprise' as Persona,
    name: 'Enterprise',
    description: '2,500 employees, $500M revenue',
    icon: Building2,
    color: 'text-purple-600'
  }
];

export default function PersonaSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const currentPersona = mockService.getPersona();
  const currentPersonaData = personas.find(p => p.id === currentPersona);

  const handlePersonaChange = (personaId: Persona) => {
    mockService.setPersona(personaId);
    setIsOpen(false);
    toast.success(`Switched to ${personas.find(p => p.id === personaId)?.name} dataset`);
    // Trigger a page refresh to reload data
    window.location.reload();
  };

  if (!currentPersonaData) return null;

  const IconComponent = currentPersonaData.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <IconComponent className={`w-4 h-4 mr-2 ${currentPersonaData.color}`} />
        {currentPersonaData.name}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200">
            <div className="p-3">
              <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                Demo Personas
              </div>
              {personas.map((persona) => {
                const IconComponent = persona.icon;
                const isSelected = persona.id === currentPersona;
                
                return (
                  <button
                    key={persona.id}
                    onClick={() => handlePersonaChange(persona.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                      isSelected
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mr-3 ${persona.color}`} />
                    <div className="text-left">
                      <div className="font-medium">{persona.name}</div>
                      <div className="text-xs text-neutral-500">{persona.description}</div>
                    </div>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="px-3 py-2 border-t border-neutral-200 bg-neutral-50">
              <div className="text-xs text-neutral-500">
                Switch personas to see different datasets and configurations
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
