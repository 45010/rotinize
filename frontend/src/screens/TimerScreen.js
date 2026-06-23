import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Vibration } from 'react-native';
import {
  Text,
  Button,
  Card,
  useTheme,
  IconButton,
  Snackbar,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import AppHeader from '../components/AppHeader';
import { pomodoroService } from '../services/pomodoroService';

const FLOW_CONFIG = {
  1: {
    name: 'Fluxo Clássico',
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    description: '25min foco • 5min pausa'
  },
  2: {
    name: 'Fluxo Intenso',
    focus: 50,
    shortBreak: 10,
    longBreak: 15,
    description: '50min foco • 10min pausa'
  }
};

const PHASE_CONFIG = {
  0: { 
    name: 'Foco',
    icon: 'brain',
    color: '#E53E3E',
    backgroundColor: '#FED7D7',
  },
  1: { 
    name: 'Pausa Curta',
    icon: 'coffee',
    color: '#38A169',
    backgroundColor: '#C6F6D5',
  },
  2: { 
    name: 'Pausa Longa',
    icon: 'sleep',
    color: '#3182CE',
    backgroundColor: '#BEE3F8',
  }
};

export default function TimerScreen() {
  const theme = useTheme();
  const timerRef = useRef(null);


  const [selectedFlow, setSelectedFlow] = useState(1);
  const [currentSession, setCurrentSession] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60); // 1500
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  console.log('TIMER_SCREEN: Initial render - remainingSeconds:', remainingSeconds);

  const getPhaseDuration = (flow, phase) => {
    if (phase === 0) { 
      return flow === 1 ? 25 * 60 : 50 * 60;
    } else if (phase === 1) { 
      return flow === 1 ? 5 * 60 : 10 * 60;
    } else if (phase === 2) {
      return 15 * 60;
    }
    return 0;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!currentSession) {
      const defaultTime = getPhaseDuration(selectedFlow, 0);
      setRemainingSeconds(defaultTime);
    }
  }, [selectedFlow, currentSession]);

  useEffect(() => {
    console.log('TIMER: remainingSeconds updated:', remainingSeconds, 'isRunning:', isRunning);
  }, [remainingSeconds]);

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  const formatTime = (seconds) => {
    try {
      const numSeconds = parseInt(seconds, 10);
      if (isNaN(numSeconds) || numSeconds < 0) {
        return '00:00';
      }
      const mins = Math.floor(numSeconds / 60);
      const secs = numSeconds % 60;
      const formattedMins = mins.toString().padStart(2, '0');
      const formattedSecs = secs.toString().padStart(2, '0');
      const result = `${formattedMins}:${formattedSecs}`;
      console.log('formatTime:', seconds, '→', result);
      return result;
    } catch (error) {
      console.error('formatTime error:', error, 'seconds:', seconds);
      return '00:00';
    }
  };

  const startTimer = () => {
    console.log('TIMER: Starting timer, current remainingSeconds:', remainingSeconds);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        const newValue = prev - 1;
        console.log('TIMER: Tick - remainingSeconds:', newValue);
        
        if (newValue <= 0) {
          pauseTimer();
          showSuccessMessage('Fase concluída!');
          return 0;
        }
        return newValue;
      });
    }, 1000);
    
    setIsRunning(true);
    console.log('TIMER: Timer started');
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  };

  const handleStartSession = async () => {
    console.log('TIMER: handleStartSession called, selectedFlow:', selectedFlow);
    setIsLoading(true);
    try {
      const result = await pomodoroService.startSession(selectedFlow);
      if (result.success) {
        console.log('TIMER: Session started successfully:', result.data);
        const session = result.data;
        const phaseDuration = getPhaseDuration(selectedFlow, session.currentPhase);
        
        console.log('TIMER: Setting session and duration:', phaseDuration);
        setCurrentSession(session);
        setRemainingSeconds(phaseDuration);
        
        setTimeout(() => {
          console.log('TIMER: Starting timer after state update');
          startTimer();
        }, 100);
        
        showSuccessMessage('Sessão iniciada! Foque no seu objetivo.');
      } else {
        console.log('TIMER: Session failed, creating local session');
        createLocalSession();
      }
    } catch (error) {
      console.error('TIMER: Error starting session:', error);
      createLocalSession();
    } finally {
      setIsLoading(false);
    }
  };

  const createLocalSession = () => {
    console.log('TIMER: Creating local session, selectedFlow:', selectedFlow);
    const phaseDuration = getPhaseDuration(selectedFlow, 0);
    const localSession = {
      id: 'local-session',
      flow: selectedFlow,
      currentPhase: 0, 
      focusCount: 0,
    };
    
    console.log('TIMER: Local session created with duration:', phaseDuration);
    setCurrentSession(localSession);
    setRemainingSeconds(phaseDuration);
    showSuccessMessage('Sessão iniciada! Foque no seu objetivo.');
    
    setTimeout(() => {
      console.log('TIMER: Starting local timer after state update');
      startTimer();
    }, 100);
  };

  const handlePauseResume = async () => {
    if (!currentSession) return;

    if (currentSession.id === 'local-session' || !currentSession.id || typeof currentSession.id === 'string') {
      if (isRunning) {
        pauseTimer();
        showSuccessMessage('Timer pausado');
      } else {
        startTimer();
        showSuccessMessage('Timer retomado');
      }
      return;
    }

    setIsLoading(true);
    try {
      if (isRunning) {
        const result = await pomodoroService.pauseSession(currentSession.id);
        if (result.success) {
          pauseTimer();
          showSuccessMessage('Timer pausado');
        } else {
          pauseTimer();
          showSuccessMessage('Timer pausado (offline)');
        }
      } else {
        const result = await pomodoroService.resumeSession(currentSession.id);
        if (result.success) {
          startTimer();
          showSuccessMessage('Timer retomado');
        } else {
          startTimer();
          showSuccessMessage('Timer retomado (offline)');
        }
      }
    } catch (error) {
      if (isRunning) {
        pauseTimer();
        showSuccessMessage('Timer pausado (offline)');
      } else {
        startTimer();
        showSuccessMessage('Timer retomado (offline)');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhaseComplete = async () => {
    if (!currentSession) return;

    pauseTimer();
    Vibration.vibrate([500, 200, 500]);

    if (currentSession.id === 'local-session' || !currentSession.id || typeof currentSession.id === 'string') {
      const nextPhase = getNextPhase(currentSession.currentPhase, currentSession.focusCount);
      const updatedSession = {
        ...currentSession,
        currentPhase: nextPhase.phase,
        focusCount: nextPhase.focusCount
      };
      
      setCurrentSession(updatedSession);
      const newPhaseDuration = getPhaseDuration(updatedSession.flow, updatedSession.currentPhase);
      setRemainingSeconds(newPhaseDuration);
      
      const phaseConfig = PHASE_CONFIG[updatedSession.currentPhase];
      showSuccessMessage(`Fase concluída! Próxima: ${phaseConfig.name}`);
      
      setTimeout(() => {
        startTimer();
      }, 3000);
      return;
    }

    try {
      const result = await pomodoroService.completePhase(currentSession.id);
      if (result.success) {
        const newSession = result.data;
        setCurrentSession(newSession);
        
        const newPhaseDuration = getPhaseDuration(newSession.flow, newSession.currentPhase);
        setRemainingSeconds(newPhaseDuration);
        
        const phaseConfig = PHASE_CONFIG[newSession.currentPhase];
        showSuccessMessage(`Fase concluída! Próxima: ${phaseConfig.name}`);
        
        setTimeout(() => {
          startTimer();
        }, 3000);
      } else {
        handleLocalPhaseComplete();
      }
    } catch (error) {
      handleLocalPhaseComplete();
    }
  };

  const getNextPhase = (currentPhase, focusCount) => {
    if (currentPhase === 0) { 
      if ((focusCount + 1) % 4 === 0) {
        return { phase: 2, focusCount: focusCount + 1 }; 
      } else {
        return { phase: 1, focusCount: focusCount + 1 }; 
      }
    } else { 
      return { phase: 0, focusCount };
    }
  };

  const handleLocalPhaseComplete = () => {
    const nextPhase = getNextPhase(currentSession.currentPhase, currentSession.focusCount);
    const updatedSession = {
      ...currentSession,
      currentPhase: nextPhase.phase,
      focusCount: nextPhase.focusCount
    };
    
    setCurrentSession(updatedSession);
    const newPhaseDuration = getPhaseDuration(updatedSession.flow, updatedSession.currentPhase);
    setRemainingSeconds(newPhaseDuration);
    
    const phaseConfig = PHASE_CONFIG[updatedSession.currentPhase];
    showSuccessMessage(`Fase concluída! Próxima: ${phaseConfig.name} (offline)`);
    
    setTimeout(() => {
      startTimer();
    }, 3000);
  };

  const handleStopSession = async () => {
    console.log('=== STOP SESSION: Starting ===');
    console.log('Current session:', currentSession);
    
    if (!currentSession) {
      console.log('STOP SESSION: No current session');
      return;
    }

    Alert.alert(
      'Finalizar Sessão',
      'Tem certeza que deseja finalizar a sessão atual?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          style: 'destructive',
          onPress: async () => {
            console.log('STOP SESSION: User confirmed, processing...');
            
            if (currentSession.id === 'local-session' || !currentSession.id || typeof currentSession.id === 'string') {
              console.log('STOP SESSION: Local session, stopping locally');
              pauseTimer();
              setCurrentSession(null);
              const defaultTime = getPhaseDuration(selectedFlow, 0);
              setRemainingSeconds(defaultTime);
              showSuccessMessage('Sessão finalizada');
              return;
            }

            console.log('STOP SESSION: Backend session, calling API...');
            setIsLoading(true);
            try {
              console.log('STOP SESSION: Making API call to stop session ID:', currentSession.id);
              const result = await pomodoroService.stopSession(currentSession.id);
              console.log('STOP SESSION: API result:', result);
              
              if (result.success) {
                console.log('STOP SESSION: API success, cleaning up...');
                pauseTimer();
                setCurrentSession(null);
                const defaultTime = getPhaseDuration(selectedFlow, 0);
                setRemainingSeconds(defaultTime);
                showSuccessMessage('Sessão finalizada');
              } else {
                console.log('STOP SESSION: API failed, using fallback:', result.error);
                pauseTimer();
                setCurrentSession(null);
                const defaultTime = getPhaseDuration(selectedFlow, 0);
                setRemainingSeconds(defaultTime);
                showSuccessMessage('Sessão finalizada (offline)');
              }
            } catch (error) {
              console.error('STOP SESSION: Exception:', error);
              pauseTimer();
              setCurrentSession(null);
              const defaultTime = getPhaseDuration(selectedFlow, 0);
              setRemainingSeconds(defaultTime);
              showSuccessMessage('Sessão finalizada (offline)');
            } finally {
              setIsLoading(false);
              console.log('STOP SESSION: Completed');
            }
          }
        }
      ]
    );
  };

  const currentPhase = currentSession ? PHASE_CONFIG[currentSession.currentPhase] : null;
  const currentFlowConfig = FLOW_CONFIG[selectedFlow];

  return (
    <View style={styles.container}>
      <AppHeader title="Timer Pomodoro" />
      
      <View style={styles.content}>
        {}
        {!currentSession && (
          <Card style={styles.flowCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Escolha seu fluxo
              </Text>
              
              <View style={styles.flowOptions}>
                {Object.entries(FLOW_CONFIG).map(([flowId, config]) => (
                  <Chip
                    key={flowId}
                    mode={selectedFlow === parseInt(flowId) ? 'elevated' : 'outlined'}
                    selected={selectedFlow === parseInt(flowId)}
                    onPress={() => setSelectedFlow(parseInt(flowId))}
                    style={styles.flowChip}
                  >
                    {config.name}
                  </Chip>
                ))}
              </View>
              
              <Text variant="bodyMedium" style={styles.flowDescription}>
                {currentFlowConfig.description}
              </Text>
            </Card.Content>
          </Card>
        )}

        {}
        <Card style={[
          styles.timerCard,
          currentPhase && { backgroundColor: currentPhase.backgroundColor }
        ]}>
          <View style={styles.timerCardContent}>
            <View style={styles.timerInnerContainer}>
              {currentSession && currentPhase && (
                <View style={styles.headerSection}>
                  <View style={styles.phaseHeader}>
                    <IconButton
                      icon={currentPhase.icon}
                      size={24}
                      iconColor={currentPhase.color}
                      style={{ margin: 0 }}
                    />
                    <Text 
                      variant="titleMedium" 
                      style={[
                        styles.phaseTitle,
                        { color: currentPhase.color }
                      ]}
                      numberOfLines={1}
                    >
                      {currentPhase.name}
                    </Text>
                  </View>
                  
                  <View style={styles.statsRow}>
                    <Text variant="bodySmall" numberOfLines={1} style={{ textAlign: 'center' }}>Ciclo {currentSession.focusCount + 1}</Text>
                    <Text variant="bodySmall" numberOfLines={1} style={{ textAlign: 'center' }}>{currentFlowConfig.name}</Text>
                  </View>
                </View>
              )}
              
              <View style={styles.timerDisplay}>
                <View style={styles.timerNumberContainer}>
                  <Text 
                    style={[
                      styles.timeText,
                      currentPhase && { color: currentPhase.color }
                    ]}
                    allowFontScaling={false}
                    numberOfLines={1}
                  >
                    {remainingSeconds !== undefined ? formatTime(remainingSeconds) : '25:00'}
                  </Text>
                </View>
                {!currentSession && (
                  <Text style={styles.timerSubtitle} numberOfLines={1}>
                    Pronto para começar
                  </Text>
                )}
              </View>
              
              {currentSession && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        {
                          width: `${(() => {
                            const totalDuration = getPhaseDuration(currentSession.flow, currentSession.currentPhase);
                            const elapsed = totalDuration - remainingSeconds;
                            return totalDuration > 0 ? (elapsed / totalDuration) * 100 : 0;
                          })()}%`,
                          backgroundColor: currentPhase?.color || theme.colors.primary
                        }
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </Card>

        {}
        <View style={styles.controls}>
          {!currentSession ? (
            <Button
              mode="contained"
              onPress={handleStartSession}
              loading={isLoading}
              disabled={isLoading}
              style={styles.primaryButton}
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Sessão'}
            </Button>
          ) : (
            <View style={styles.sessionControls}>
              <Button
                mode="contained"
                onPress={handlePauseResume}
                loading={isLoading}
                disabled={isLoading}
                style={styles.controlButton}
                icon={isRunning ? 'pause' : 'play'}
              >
                {isRunning ? 'Pausar' : 'Retomar'}
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => {
                  console.log('=== FINALIZAR BUTTON CLICKED ===');
                  console.log('Current session:', currentSession);
                  console.log('Is loading:', isLoading);
                  
                  try {
                    console.log('FORCE STOP: Starting...');
                    
                    if (timerRef.current) {
                      clearInterval(timerRef.current);
                      timerRef.current = null;
                      console.log('FORCE STOP: Timer cleared');
                    }
                    
                    setIsRunning(false);
                    setCurrentSession(null);
                    setIsLoading(false);
                    
                    const defaultTime = getPhaseDuration(selectedFlow, 0);
                    setRemainingSeconds(defaultTime);
                    
                    console.log('FORCE STOP: States reset');
                    showSuccessMessage('Sessão finalizada com sucesso!');
                    console.log('FORCE STOP: Success message shown');
                    
                  } catch (error) {
                    console.error('FORCE STOP: Error:', error);
                    showErrorMessage('Erro ao finalizar sessão');
                  }
                }}
                disabled={false} 
                style={[styles.controlButton, { opacity: isLoading ? 0.7 : 1 }]}
                textColor={theme.colors.error}
              >
                {isLoading ? 'Finalizando...' : 'Finalizar'}
              </Button>
            </View>
          )}
        </View>
      </View>

      {}
      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={4000}
        style={{ backgroundColor: theme.colors.errorContainer }}
      >
        <Text style={{ color: theme.colors.onErrorContainer }}>{errorMessage}</Text>
      </Snackbar>

      <Snackbar
        visible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.primaryContainer }}
      >
        <Text style={{ color: theme.colors.onPrimaryContainer }}>{successMessage}</Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  flowCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  flowOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  flowChip: {
    flex: 1,
  },
  flowDescription: {
    textAlign: 'center',
    opacity: 0.7,
  },
  timerCard: {
    flex: 1,
    marginBottom: 16,
    justifyContent: 'center',
  },
  timerCardContent: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 350,
  },
  timerInnerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    minHeight: 300,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 4,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 0,
  },
  phaseTitle: {
    marginLeft: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 24,
    marginTop: 2,
  },
  timerDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: 150,
  },
  timerNumberContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: 80,
  },
  timeText: {
    fontSize: 72,
    fontWeight: '300',
    letterSpacing: 4,
    textAlign: 'center',
    color: '#2C3E50',
    lineHeight: 90,
  },
  timerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.8,
  },
  progressContainer: {
    marginTop: 12,
    width: '100%',
    paddingHorizontal: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  controls: {
    paddingBottom: 16,
  },
  primaryButton: {
    paddingVertical: 6,
  },
  sessionControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 6,
  },
});
