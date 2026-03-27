import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState('ocean'); // Default to ocean
  const [manualTheme, setManualTheme] = useState(localStorage.getItem('manualTheme') || '');

  useEffect(() => {
    if (manualTheme) {
        localStorage.setItem('manualTheme', manualTheme);
    } else {
        localStorage.removeItem('manualTheme');
    }
  }, [manualTheme]);

  useEffect(() => {
    // Clear old theme classes, keeping default classes
    document.body.className = '';
    
    // Apply the specific color theme
    const activeTheme = manualTheme || theme;
    
    // Always apply the base light theme overrides for colorful themes,
    // UNLESS the active theme is explicitly 'dark'
    if (activeTheme !== 'dark') {
      document.body.classList.add('theme-base');
    }

    if (activeTheme) {
      document.body.classList.add(`theme-${activeTheme}`);
    }
  }, [theme, manualTheme]);

  return (
    <SettingsContext.Provider value={{
      theme, setTheme,
      manualTheme, setManualTheme,
      openSettings: () => setIsSettingsOpen(true),
      closeSettings: () => setIsSettingsOpen(false)
    }}>
      {children}
      {isSettingsOpen && <SettingsModal close={() => setIsSettingsOpen(false)} />}
    </SettingsContext.Provider>
  );
};

function SettingsModal({ close }) {
  const { manualTheme, setManualTheme } = useSettings();

  const themes = ['ocean', 'emerald', 'sunset', 'amethyst', 'rose', 'amber', 'neutral', 'dark'];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }} onClick={close}>
      <div style={{
        background: 'var(--c-card, #131825)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px', width: '100%', maxWidth: '460px', overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#fff', fontWeight: '700' }}>Global Settings</h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>Manage preferences across all dashboards</p>
          </div>
          <button onClick={close} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#6b7280', margin: '0 0 16px', fontWeight: '700' }}>Theme Preference</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.5', margin: '0 0 16px' }}>
              Select a preferred color theme across all pages. Choosing "Auto" lets pages change colors dynamically.
            </p>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                gap: '12px' 
            }}>
                <button 
                  onClick={() => setManualTheme('')}
                  style={{
                      padding: '12px', borderRadius: '12px',
                      border: `2px solid ${!manualTheme ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
                      background: 'rgba(255,255,255,0.03)', color: !manualTheme ? '#fff' : '#9ca3af',
                      cursor: 'pointer', fontWeight: !manualTheme ? '600' : '400',
                      transition: 'all 0.2s', width: '100%'
                  }}
                >
                    Auto
                </button>
                {themes.map(t => (
                    <button 
                        key={t}
                        onClick={() => setManualTheme(t)}
                        style={{
                            padding: '12px', borderRadius: '12px', textTransform: 'capitalize',
                            border: `2px solid ${t === manualTheme ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
                            background: 'rgba(255,255,255,0.03)', color: t === manualTheme ? '#fff' : '#9ca3af',
                            cursor: 'pointer', fontWeight: t === manualTheme ? '600' : '400',
                            transition: 'all 0.2s', width: '100%'
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

