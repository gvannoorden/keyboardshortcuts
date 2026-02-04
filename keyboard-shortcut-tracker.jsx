import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Eye, Table, Trash2, Plus, Lock, Unlock } from 'lucide-react';

// Password protection component
const PasswordGate = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple password - you can change this
    if (password === 'shortcuts') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Space Mono', monospace"
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '400px',
        width: '90%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Lock size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
          <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#1a1a1a' }}>Keyboard Shortcuts</h2>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Enter password to access</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '1rem',
              border: error ? '2px solid #ef4444' : '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '1rem',
              fontFamily: "'Space Mono', monospace",
              marginBottom: '1rem',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease'
            }}
          />
          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Incorrect password
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: "'Space Mono', monospace",
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Unlock
          </button>
        </form>
        <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '1.5rem', textAlign: 'center' }}>
          Default password: shortcuts
        </p>
      </div>
    </div>
  );
};

const KeyboardShortcutTracker = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [viewMode, setViewMode] = useState('keyboard'); // 'keyboard' or 'table'
  const [os, setOs] = useState('macos'); // 'macos' or 'windows'
  const [keyboardLayout, setKeyboardLayout] = useState('fullsize'); // 'fullsize', 'tkl'
  const [selectedTag, setSelectedTag] = useState('all');
  const [hoveredKey, setHoveredKey] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newShortcut, setNewShortcut] = useState({
    name: '',
    keys: '',
    tag: 'System',
    description: ''
  });

  // Check if already unlocked in session
  useEffect(() => {
    const unlocked = sessionStorage.getItem('keyboard-shortcuts-unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  // Load shortcuts from persistent storage
  useEffect(() => {
    if (isUnlocked) {
      const loadData = async () => {
        try {
          const stored = await window.storage.get('keyboard-shortcuts');
          if (stored && stored.value) {
            setShortcuts(JSON.parse(stored.value));
          }
        } catch (error) {
          console.log('No stored shortcuts found, starting fresh');
        }
      };
      loadData();
    }
  }, [isUnlocked]);

  // Save shortcuts to persistent storage
  const saveShortcuts = async (updatedShortcuts) => {
    try {
      await window.storage.set('keyboard-shortcuts', JSON.stringify(updatedShortcuts));
      setShortcuts(updatedShortcuts);
    } catch (error) {
      console.error('Failed to save shortcuts:', error);
    }
  };

  const handleUnlock = () => {
    sessionStorage.setItem('keyboard-shortcuts-unlocked', 'true');
    setIsUnlocked(true);
  };

  const addShortcut = () => {
    if (newShortcut.name && newShortcut.keys) {
      const shortcut = {
        id: Date.now(),
        ...newShortcut
      };
      saveShortcuts([...shortcuts, shortcut]);
      setNewShortcut({ name: '', keys: '', tag: 'System', description: '' });
    }
  };

  const deleteShortcut = (id) => {
    saveShortcuts(shortcuts.filter(s => s.id !== id));
  };

  const updateShortcut = (id, field, value) => {
    saveShortcuts(shortcuts.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const exportShortcuts = () => {
    const dataStr = JSON.stringify(shortcuts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'keyboard-shortcuts.json';
    link.click();
  };

  const importShortcuts = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          saveShortcuts(imported);
        } catch (error) {
          alert('Error importing file. Please ensure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const getKeyPosition = (key) => {
    // Simplified key positions for visualization
    const positions = {
      // Number row
      'Esc': { row: 0, col: 0 }, '1': { row: 0, col: 1 }, '2': { row: 0, col: 2 }, '3': { row: 0, col: 3 },
      '4': { row: 0, col: 4 }, '5': { row: 0, col: 5 }, '6': { row: 0, col: 6 }, '7': { row: 0, col: 7 },
      '8': { row: 0, col: 8 }, '9': { row: 0, col: 9 }, '0': { row: 0, col: 10 }, 'Delete': { row: 0, col: 11 },
      
      // Top row
      'Tab': { row: 1, col: 0 }, 'Q': { row: 1, col: 1 }, 'W': { row: 1, col: 2 }, 'E': { row: 1, col: 3 },
      'R': { row: 1, col: 4 }, 'T': { row: 1, col: 5 }, 'Y': { row: 1, col: 6 }, 'U': { row: 1, col: 7 },
      'I': { row: 1, col: 8 }, 'O': { row: 1, col: 9 }, 'P': { row: 1, col: 10 },
      
      // Middle row
      'Caps': { row: 2, col: 0 }, 'A': { row: 2, col: 1 }, 'S': { row: 2, col: 2 }, 'D': { row: 2, col: 3 },
      'F': { row: 2, col: 4 }, 'G': { row: 2, col: 5 }, 'H': { row: 2, col: 6 }, 'J': { row: 2, col: 7 },
      'K': { row: 2, col: 8 }, 'L': { row: 2, col: 9 }, 'Enter': { row: 2, col: 10 },
      
      // Bottom row
      'Shift': { row: 3, col: 0 }, 'Z': { row: 3, col: 1 }, 'X': { row: 3, col: 2 }, 'C': { row: 3, col: 3 },
      'V': { row: 3, col: 4 }, 'B': { row: 3, col: 5 }, 'N': { row: 3, col: 6 }, 'M': { row: 3, col: 7 },
      
      // Modifiers
      'Ctrl': { row: 4, col: 0 }, 'Alt': { row: 4, col: 1 }, 'Cmd': { row: 4, col: 2 }, 
      'Space': { row: 4, col: 3 }, 'Opt': { row: 4, col: 2 },
      
      // Arrow keys
      '↑': { row: 3, col: 12 }, '←': { row: 4, col: 11 }, '↓': { row: 4, col: 12 }, '→': { row: 4, col: 13 }
    };
    return positions[key] || { row: 0, col: 0 };
  };

  const parseShortcutKeys = (keyString) => {
    return keyString.split('+').map(k => k.trim());
  };

  const getShortcutsForKey = (key) => {
    return shortcuts.filter(s => {
      const keys = parseShortcutKeys(s.keys);
      return keys.some(k => k.toUpperCase() === key.toUpperCase());
    }).filter(s => selectedTag === 'all' || s.tag === selectedTag);
  };

  const tags = ['AI', 'Window Management', 'System', 'Browser', 'Editor', 'Custom'];
  const tagColors = {
    'AI': '#8b5cf6',
    'Window Management': '#3b82f6',
    'System': '#10b981',
    'Browser': '#f59e0b',
    'Editor': '#ef4444',
    'Custom': '#6366f1'
  };

  if (!isUnlocked) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  const filteredShortcuts = selectedTag === 'all' 
    ? shortcuts 
    : shortcuts.filter(s => s.tag === selectedTag);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0f0f0f 0%, #1a1a2e 100%)',
      fontFamily: "'JetBrains Mono', monospace",
      color: '#e5e7eb',
      padding: '2rem'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap');
        
        * { box-sizing: border-box; }
        
        .keyboard-key {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .keyboard-key:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }
        
        .shortcut-row {
          transition: all 0.2s ease;
        }
        
        .shortcut-row:hover {
          background: rgba(139, 92, 246, 0.1);
          transform: translateX(4px);
        }

        input, textarea, select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e5e7eb;
          padding: 0.5rem;
          border-radius: 6px;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.3s ease;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
        }

        button {
          transition: all 0.2s ease;
        }

        button:hover {
          transform: translateY(-2px);
        }
      `}</style>

      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              ⌨️ Shortcut Master
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#9ca3af' }}>
              Your keyboard, visualized
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Unlock size={20} color="#8b5cf6" />
            <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              {shortcuts.length} shortcuts
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setViewMode('keyboard')}
              style={{
                padding: '0.5rem 1rem',
                background: viewMode === 'keyboard' ? '#8b5cf6' : 'transparent',
                border: '1px solid #8b5cf6',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Eye size={16} />
              Keyboard
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '0.5rem 1rem',
                background: viewMode === 'table' ? '#8b5cf6' : 'transparent',
                border: '1px solid #8b5cf6',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Table size={16} />
              Table
            </button>
          </div>

          {/* OS Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setOs('macos')}
              style={{
                padding: '0.5rem 1rem',
                background: os === 'macos' ? '#3b82f6' : 'transparent',
                border: '1px solid #3b82f6',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              macOS
            </button>
            <button
              onClick={() => setOs('windows')}
              style={{
                padding: '0.5rem 1rem',
                background: os === 'windows' ? '#3b82f6' : 'transparent',
                border: '1px solid #3b82f6',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Windows
            </button>
          </div>

          {/* Layout Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setKeyboardLayout('fullsize')}
              style={{
                padding: '0.5rem 1rem',
                background: keyboardLayout === 'fullsize' ? '#10b981' : 'transparent',
                border: '1px solid #10b981',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Full Size
            </button>
            <button
              onClick={() => setKeyboardLayout('tkl')}
              style={{
                padding: '0.5rem 1rem',
                background: keyboardLayout === 'tkl' ? '#10b981' : 'transparent',
                border: '1px solid #10b981',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              TKL
            </button>
          </div>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Tags</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

          {/* Import/Export */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <label style={{
              padding: '0.5rem 1rem',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid #8b5cf6',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Upload size={16} />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importShortcuts}
                style={{ display: 'none' }}
              />
            </label>
            <button
              onClick={exportShortcuts}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid #8b5cf6',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {viewMode === 'keyboard' ? (
          /* Keyboard View */
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginTop: 0, color: '#8b5cf6', marginBottom: '1.5rem' }}>
                Keyboard Layout
              </h3>
              
              {/* Simplified keyboard representation */}
              <div style={{ 
                display: 'grid', 
                gap: '0.5rem',
                justifyContent: 'center'
              }}>
                {/* Function keys */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].map(key => {
                    const keyShortcuts = getShortcutsForKey(key);
                    const hasShortcut = keyShortcuts.length > 0;
                    return (
                      <div
                        key={key}
                        className="keyboard-key"
                        onMouseEnter={() => setHoveredKey(key)}
                        onMouseLeave={() => setHoveredKey(null)}
                        style={{
                          width: '50px',
                          height: '50px',
                          background: hasShortcut 
                            ? `linear-gradient(135deg, ${tagColors[keyShortcuts[0].tag]} 0%, ${tagColors[keyShortcuts[0].tag]}dd 100%)`
                            : 'rgba(255, 255, 255, 0.05)',
                          border: hoveredKey === key ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          position: 'relative',
                          cursor: hasShortcut ? 'pointer' : 'default'
                        }}
                      >
                        {key}
                        {hasShortcut && (
                          <div style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            width: '6px',
                            height: '6px',
                            background: '#fff',
                            borderRadius: '50%'
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Number row */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Delete'].map(key => {
                    const keyShortcuts = getShortcutsForKey(key);
                    const hasShortcut = keyShortcuts.length > 0;
                    return (
                      <div
                        key={key}
                        className="keyboard-key"
                        onMouseEnter={() => setHoveredKey(key)}
                        onMouseLeave={() => setHoveredKey(null)}
                        style={{
                          width: key === 'Delete' ? '70px' : '50px',
                          height: '50px',
                          background: hasShortcut 
                            ? `linear-gradient(135deg, ${tagColors[keyShortcuts[0].tag]} 0%, ${tagColors[keyShortcuts[0].tag]}dd 100%)`
                            : 'rgba(255, 255, 255, 0.05)',
                          border: hoveredKey === key ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          position: 'relative',
                          cursor: hasShortcut ? 'pointer' : 'default'
                        }}
                      >
                        {key}
                        {hasShortcut && (
                          <div style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            width: '6px',
                            height: '6px',
                            background: '#fff',
                            borderRadius: '50%'
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* QWERTY row */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'].map(key => {
                    const keyShortcuts = getShortcutsForKey(key);
                    const hasShortcut = keyShortcuts.length > 0;
                    return (
                      <div
                        key={key}
                        className="keyboard-key"
                        onMouseEnter={() => setHoveredKey(key)}
                        onMouseLeave={() => setHoveredKey(null)}
                        style={{
                          width: key === 'Tab' ? '70px' : key === '\\' ? '70px' : '50px',
                          height: '50px',
                          background: hasShortcut 
                            ? `linear-gradient(135deg, ${tagColors[keyShortcuts[0].tag]} 0%, ${tagColors[keyShortcuts[0].tag]}dd 100%)`
                            : 'rgba(255, 255, 255, 0.05)',
                          border: hoveredKey === key ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          position: 'relative',
                          cursor: hasShortcut ? 'pointer' : 'default'
                        }}
                      >
                        {key}
                        {hasShortcut && (
                          <div style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            width: '6px',
                            height: '6px',
                            background: '#fff',
                            borderRadius: '50%'
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ASDF row */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'].map(key => {
                    const keyShortcuts = getShortcutsForKey(key);
                    const hasShortcut = keyShortcuts.length > 0;
                    return (
                      <div
                        key={key}
                        className="keyboard-key"
                        onMouseEnter={() => setHoveredKey(key)}
                        onMouseLeave={() => setHoveredKey(null)}
                        style={{
                          width: key === 'Caps' ? '85px' : key === 'Enter' ? '85px' : '50px',
                          height: '50px',
                          background: hasShortcut 
                            ? `linear-gradient(135deg, ${tagColors[keyShortcuts[0].tag]} 0%, ${tagColors[keyShortcuts[0].tag]}dd 100%)`
                            : 'rgba(255, 255, 255, 0.05)',
                          border: hoveredKey === key ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          position: 'relative',
                          cursor: hasShortcut ? 'pointer' : 'default'
                        }}
                      >
                        {key}
                        {hasShortcut && (
                          <div style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            width: '6px',
                            height: '6px',
                            background: '#fff',
                            borderRadius: '50%'
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ZXCV row */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'].map((key, idx) => {
                    const keyShortcuts = getShortcutsForKey(key);
                    const hasShortcut = keyShortcuts.length > 0;
                    return (
                      <div
                        key={key + idx}
                        className="keyboard-key"
                        onMouseEnter={() => setHoveredKey(key)}
                        onMouseLeave={() => setHoveredKey(null)}
                        style={{
                          width: key === 'Shift' ? '105px' : '50px',
                          height: '50px',
                          background: hasShortcut 
                            ? `linear-gradient(135deg, ${tagColors[keyShortcuts[0].tag]} 0%, ${tagColors[keyShortcuts[0].tag]}dd 100%)`
                            : 'rgba(255, 255, 255, 0.05)',
                          border: hoveredKey === key ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          position: 'relative',
                          cursor: hasShortcut ? 'pointer' : 'default'
                        }}
                      >
                        {key}
                        {hasShortcut && (
                          <div style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            width: '6px',
                            height: '6px',
                            background: '#fff',
                            borderRadius: '50%'
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom row */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[
                    os === 'macos' ? 'Ctrl' : 'Ctrl',
                    os === 'macos' ? 'Opt' : 'Win',
                    os === 'macos' ? 'Cmd' : 'Alt',
                    'Space',
                    os === 'macos' ? 'Cmd' : 'Alt',
                    os === 'macos' ? 'Opt' : 'Win',
                    'Ctrl',
                    '←', '↓', '→'
                  ].map((key, idx) => {
                    const keyShortcuts = getShortcutsForKey(key);
                    const hasShortcut = keyShortcuts.length > 0;
                    return (
                      <div
                        key={key + idx}
                        className="keyboard-key"
                        onMouseEnter={() => setHoveredKey(key)}
                        onMouseLeave={() => setHoveredKey(null)}
                        style={{
                          width: key === 'Space' ? '300px' : '60px',
                          height: '50px',
                          background: hasShortcut 
                            ? `linear-gradient(135deg, ${tagColors[keyShortcuts[0].tag]} 0%, ${tagColors[keyShortcuts[0].tag]}dd 100%)`
                            : 'rgba(255, 255, 255, 0.05)',
                          border: hoveredKey === key ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          position: 'relative',
                          cursor: hasShortcut ? 'pointer' : 'default'
                        }}
                      >
                        {key}
                        {hasShortcut && (
                          <div style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            width: '6px',
                            height: '6px',
                            background: '#fff',
                            borderRadius: '50%'
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hovered key info */}
              {hoveredKey && getShortcutsForKey(hoveredKey).length > 0 && (
                <div style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#8b5cf6' }}>
                    Shortcuts using {hoveredKey}:
                  </h4>
                  {getShortcutsForKey(hoveredKey).map(s => (
                    <div key={s.id} style={{ marginBottom: '0.5rem' }}>
                      <strong>{s.name}</strong>: {s.keys}
                      {s.description && <span style={{ color: '#9ca3af' }}> — {s.description}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legend */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '2rem'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#8b5cf6' }}>Tag Legend</h4>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {tags.map(tag => (
                  <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: tagColors[tag],
                      borderRadius: '4px'
                    }} />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Table View */
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <h3 style={{ marginTop: 0, color: '#8b5cf6', marginBottom: '1.5rem' }}>
              All Shortcuts
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(139, 92, 246, 0.3)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8b5cf6' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8b5cf6' }}>Keys</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8b5cf6' }}>Tag</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8b5cf6' }}>Description</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#8b5cf6' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShortcuts.map(shortcut => (
                    <tr key={shortcut.id} className="shortcut-row" style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <td style={{ padding: '1rem' }}>
                        {editingId === shortcut.id ? (
                          <input
                            value={shortcut.name}
                            onChange={(e) => updateShortcut(shortcut.id, 'name', e.target.value)}
                            style={{ width: '100%' }}
                          />
                        ) : (
                          <strong>{shortcut.name}</strong>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {editingId === shortcut.id ? (
                          <input
                            value={shortcut.keys}
                            onChange={(e) => updateShortcut(shortcut.id, 'keys', e.target.value)}
                            style={{ width: '100%' }}
                          />
                        ) : (
                          <code style={{
                            background: 'rgba(139, 92, 246, 0.2)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                          }}>
                            {shortcut.keys}
                          </code>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {editingId === shortcut.id ? (
                          <select
                            value={shortcut.tag}
                            onChange={(e) => updateShortcut(shortcut.id, 'tag', e.target.value)}
                            style={{ width: '100%' }}
                          >
                            {tags.map(tag => (
                              <option key={tag} value={tag}>{tag}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={{
                            background: tagColors[shortcut.tag],
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}>
                            {shortcut.tag}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', color: '#9ca3af' }}>
                        {editingId === shortcut.id ? (
                          <input
                            value={shortcut.description}
                            onChange={(e) => updateShortcut(shortcut.id, 'description', e.target.value)}
                            style={{ width: '100%' }}
                          />
                        ) : (
                          shortcut.description || '—'
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {editingId === shortcut.id ? (
                            <button
                              onClick={() => setEditingId(null)}
                              style={{
                                padding: '0.5rem',
                                background: '#10b981',
                                border: 'none',
                                borderRadius: '4px',
                                color: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              <Save size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingId(shortcut.id)}
                              style={{
                                padding: '0.5rem',
                                background: 'rgba(59, 130, 246, 0.2)',
                                border: '1px solid #3b82f6',
                                borderRadius: '4px',
                                color: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => deleteShortcut(shortcut.id)}
                            style={{
                              padding: '0.5rem',
                              background: 'rgba(239, 68, 68, 0.2)',
                              border: '1px solid #ef4444',
                              borderRadius: '4px',
                              color: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add New Shortcut */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          marginTop: '2rem'
        }}>
          <h3 style={{ marginTop: 0, color: '#8b5cf6', marginBottom: '1.5rem' }}>
            Add New Shortcut
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr auto', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                Name
              </label>
              <input
                value={newShortcut.name}
                onChange={(e) => setNewShortcut({ ...newShortcut, name: e.target.value })}
                placeholder="Copy"
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                Keys
              </label>
              <input
                value={newShortcut.keys}
                onChange={(e) => setNewShortcut({ ...newShortcut, keys: e.target.value })}
                placeholder="Cmd+C"
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                Tag
              </label>
              <select
                value={newShortcut.tag}
                onChange={(e) => setNewShortcut({ ...newShortcut, tag: e.target.value })}
                style={{ width: '100%' }}
              >
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                Description (optional)
              </label>
              <input
                value={newShortcut.description}
                onChange={(e) => setNewShortcut({ ...newShortcut, description: e.target.value })}
                placeholder="Copy selected text"
                style={{ width: '100%' }}
              />
            </div>
            
            <button
              onClick={addShortcut}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutTracker;
