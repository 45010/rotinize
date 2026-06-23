import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  Text, Card, ProgressBar, Button,
  Portal, Dialog, RadioButton, Snackbar, TextInput, IconButton, Divider
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeader from '../components/AppHeader'; 

const KEY = '@pomodoro/sessoes';
const PREF_META = '@prefs/metaDiariaMin';

const COLORS = {
  primaryLight: '#A0D4F4',
  primary: '#3EA5E5',
  primaryDark: '#2F7CA9',
  secondary: '#FF9901',
  success: '#00C247',
  warning: '#FFBE5A',
  error: '#FF3333',
  disabled: '#B5B3B2',
  bg: '#F8FAFC',
  cardSoft: '#F1F5F9',
  text900: '#0F172A',
  text500: '#64748B',
  text400: '#94A3B8',
  white: '#FFFFFF',
  black: '#111827',
};

const TYPO = {
  t1: { fontSize: 32, fontWeight: '600', color: COLORS.text900 },
  t2: { fontSize: 24, fontWeight: '600', color: COLORS.text900 },
  t3: { fontSize: 20, fontWeight: '500', color: COLORS.text900 },
  body16: { fontSize: 16, color: COLORS.text900 },
  body14: { fontSize: 14, color: COLORS.text900 },
  caption12: { fontSize: 12, color: COLORS.text500, fontWeight: '500' },
};

function duracaoSegundos(s) {
  if (!s?.endedAt || !s?.startedAt) return 0;
  const ini = new Date(s.startedAt).getTime();
  const fim = new Date(s.endedAt).getTime();
  return Math.max(0, Math.floor((fim - ini) / 1000));
}
function formatarHMS(totalSegundos) {
  const h = Math.floor(totalSegundos / 3600);
  const m = Math.floor((totalSegundos % 3600) / 60);
  const s = totalSegundos % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
function mesmoDia(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function inicioDaSemana(d = new Date()) {
  const x = new Date(d);
  const dia = x.getDay();
  const diff = (dia + 6) % 7; // segunda como início
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - diff);
  return x;
}
function mesmaSemana(data, ref = new Date()) {
  const i = inicioDaSemana(ref).getTime();
  const f = i + 7 * 24 * 3600 * 1000;
  const t = data.getTime();
  return t >= i && t < f;
}

export default function IndicadorTempoFoco() {
  const [sessoes, setSessoes] = useState([]);
  const [metaMin, setMetaMin] = useState(null);
  const [dlgLimpar, setDlgLimpar] = useState(false);
  const [escopo, setEscopo] = useState('hoje');
  const [dlgMeta, setDlgMeta] = useState(false);
  const [metaInput, setMetaInput] = useState('60');
  const [snack, setSnack] = useState({ visible: false, msg: '' });

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      setSessoes(Array.isArray(arr) ? arr : []);
      const savedMeta = await AsyncStorage.getItem(PREF_META);
      if (savedMeta != null) setMetaMin(Number(savedMeta));
    })();
  }, []);

  const workDone = useMemo(() => sessoes.filter(s => s?.tipo === 'work' && s?.endedAt), [sessoes]);

  const ag = useMemo(() => {
    const hoje = new Date();
    let tempoHoje = 0, tempoSemana = 0, tempoTotal = 0;
    let countHoje = 0, countSemana = 0, countTotal = 0;

    for (const s of workDone) {
      const t = duracaoSegundos(s);
      tempoTotal += t; countTotal += 1;
      const inicio = new Date(s.startedAt);
      if (mesmoDia(inicio, hoje)) { tempoHoje += t; countHoje += 1; }
      if (mesmaSemana(inicio, hoje)) { tempoSemana += t; countSemana += 1; }
    }
    return { tempoHoje, tempoSemana, tempoTotal, countHoje, countSemana, countTotal };
  }, [workDone]);

  const progressoMeta = metaMin ? Math.min(1, ag.tempoHoje / (metaMin * 60)) : 0;

  //  gráfico semanal  
  const semanaBars = useMemo(() => {
    const base = [0, 0, 0, 0, 0, 0, 0]; // seg..dom em minutos
    const agora = new Date();
    for (const s of workDone) {
      const d = new Date(s.startedAt);
      if (!mesmaSemana(d, agora)) continue;
      const idx = (d.getDay() + 6) % 7; // 0=seg ... 6=dom
      base[idx] += Math.floor(duracaoSegundos(s) / 60);
    }
    const max = Math.max(30, ...base);
    return { vals: base, max };
  }, [workDone]);
  const labels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']; // seg..dom
  // -------------------

  async function atualizarSessoes(novas) {
    await AsyncStorage.setItem(KEY, JSON.stringify(novas));
    setSessoes(novas);
  }
  const ehHoje = (s) => mesmoDia(new Date(s.startedAt), new Date());
  const ehSemana = (s) => mesmaSemana(new Date(s.startedAt), new Date());

  async function confirmarLimpeza() {
    let novas = sessoes;
    if (escopo === 'hoje') novas = sessoes.filter(s => !ehHoje(s));
    else if (escopo === 'semana') novas = sessoes.filter(s => !ehSemana(s));
    else novas = [];
    await atualizarSessoes(novas);
    setDlgLimpar(false);
    setSnack({
      visible: true,
      msg:
        escopo === 'total' ? 'Todos os dados foram zerados.' :
        escopo === 'semana' ? 'Dados da semana zerados.' :
        'Dados de hoje zerados.'
    });
  }

  async function salvarMeta() {
    const val = Math.max(1, Number(metaInput || 0));
    await AsyncStorage.setItem(PREF_META, String(val));
    setMetaMin(val);
    setDlgMeta(false);
    setSnack({ visible: true, msg: `Meta diária definida para ${val} min.` });
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Header */}
      {/*<AppHeader title="Indicador de Foco" />*/}

      <View style={{ flex: 1, padding: 16, gap: 16 }}>
        <Text style={TYPO.t2}>Tempo de Foco (Pomodoro)</Text>

        {/* Card da meta diária */}
        <Card style={{ backgroundColor: COLORS.cardSoft, borderRadius: 16 }}>
          <Card.Content>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[TYPO.caption12, { flex: 1 }]}>Meta diária</Text>
              <IconButton
                icon={metaMin ? 'pencil-outline' : 'plus-circle-outline'}
                onPress={() => { setMetaInput(String(metaMin ?? 60)); setDlgMeta(true); }}
                size={20}
              />
            </View>

            {metaMin ? (
              <>
                <Text style={[TYPO.t1, { marginTop: 4 }]}>
                  {formatarHMS(ag.tempoHoje)}{' '}
                  <Text style={{ ...TYPO.body16, color: COLORS.text500 }}>/ {metaMin} min</Text>
                </Text>
                <ProgressBar
                  progress={progressoMeta}
                  style={{ marginTop: 10, height: 8, borderRadius: 4 }}
                  color={COLORS.primary}
                />
                <Text style={[TYPO.body14, { marginTop: 8, color: COLORS.text500 }]}>
                  {ag.countHoje} pomodoro(s) concluído(s) hoje
                </Text>
              </>
            ) : (
              <>
                <Text style={[TYPO.body16, { marginTop: 6, color: COLORS.text500 }]}>
                  Você ainda não definiu uma meta diária.
                </Text>
                <Button
                  mode="contained-tonal"
                  onPress={() => { setMetaInput('60'); setDlgMeta(true); }}
                  style={{ alignSelf: 'flex-start', marginTop: 10, borderRadius: 10 }}
                >
                  Definir meta
                </Button>
              </>
            )}
          </Card.Content>
        </Card>

        {/* KPIs Hoje / Semana / Total */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[{ label: 'Hoje', tempo: ag.tempoHoje, count: ag.countHoje },
            { label: 'Semana', tempo: ag.tempoSemana, count: ag.countSemana },
            { label: 'Total', tempo: ag.tempoTotal, count: ag.countTotal }].map((kpi) => (
            <Card key={kpi.label} style={styles.kpiCard}>
              <Card.Content>
                <Text style={TYPO.caption12}>{kpi.label}</Text>
                <Text style={[TYPO.t3, { marginTop: 2 }]}>{formatarHMS(kpi.tempo)}</Text>
                <Text style={[TYPO.body14, { color: COLORS.text400 }]}>{kpi.count} pomodoros</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Gráfico semanal */}
        <Card style={{ backgroundColor: COLORS.white, borderRadius: 16 }}>
          <Card.Content>
            <Text style={[TYPO.t3, { marginBottom: 8 }]}>Foco na semana</Text>
            <View style={{ height: 140, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              {semanaBars.vals.map((min, idx) => {
                const h = Math.round((min / semanaBars.max) * 120);
                return (
                  <View key={idx} style={{ alignItems: 'center', width: 28 }}>
                    <View
                      style={{
                        width: 18,
                        height: Math.max(4, h),
                        borderRadius: 9,
                        backgroundColor: COLORS.primary,
                        opacity: min === 0 ? 0.35 : 1,
                      }}
                    />
                    <Text style={[TYPO.caption12, { marginTop: 6, color: COLORS.text500 }]}>{labels[idx]}</Text>
                    <Text style={[TYPO.caption12, { color: COLORS.text400 }]}>{min}m</Text>
                  </View>
                );
              })}
            </View>
            <Text style={[TYPO.caption12, { marginTop: 6, color: COLORS.text500 }]}>
              Escala automática • maior dia = {semanaBars.max} min
            </Text>
          </Card.Content>
        </Card>

        {/* Botão LIMPAR */}
        <Button
          mode="contained"
          onPress={() => setDlgLimpar(true)}
          buttonColor={COLORS.secondary}
          textColor={COLORS.white}
          style={{ borderRadius: 12 }}
          contentStyle={{ paddingVertical: 6 }}
        >
          LIMPAR
        </Button>
      </View>

      {/* Dialogs */}
      <Portal>
        {/* Limpar dados */}
        <Dialog
          visible={dlgLimpar}
          onDismiss={() => setDlgLimpar(false)}
          style={{ backgroundColor: COLORS.white, borderRadius: 16 }}
        >
          <Dialog.Title style={TYPO.t3}>Limpar dados</Dialog.Title>
          <Dialog.Content style={{ paddingTop: 0 }}>
            <Text style={{ ...TYPO.body16, marginBottom: 8 }}>O que deseja zerar?</Text>
            <RadioButton.Group onValueChange={setEscopo} value={escopo}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <RadioButton value="hoje" />
                <Text style={TYPO.body14}>Hoje</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <RadioButton value="semana" />
                <Text style={TYPO.body14}>Semana</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value="total" />
                <Text style={TYPO.body14}>Total</Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Divider />
          <Dialog.Actions>
            <Button onPress={() => setDlgLimpar(false)} textColor={COLORS.text500}>Cancelar</Button>
            <Button onPress={confirmarLimpeza} textColor={COLORS.error}>Confirmar</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Meta diária */}
        <Dialog
          visible={dlgMeta}
          onDismiss={() => setDlgMeta(false)}
          style={{ backgroundColor: COLORS.white, borderRadius: 16 }}
        >
          <Dialog.Title style={TYPO.t3}>Meta diária</Dialog.Title>
          <Dialog.Content style={{ paddingTop: 0 }}>
            <Text style={{ ...TYPO.body16, marginBottom: 8 }}>
              Defina sua meta de foco por dia (em minutos)
            </Text>
            <TextInput
              mode="outlined"
              keyboardType="number-pad"
              value={metaInput}
              onChangeText={setMetaInput}
              right={<TextInput.Affix text=" min" />}
            />
          </Dialog.Content>
          <Divider />
          <Dialog.Actions>
            <Button onPress={() => setDlgMeta(false)} textColor={COLORS.text500}>Cancelar</Button>
            <Button onPress={salvarMeta} textColor={COLORS.primary}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snack.visible}
        onDismiss={() => setSnack({ visible: false, msg: '' })}
        duration={2000}
        style={{ backgroundColor: COLORS.black }}
      >
        {snack.msg}
      </Snackbar>
    </View>
  );
}

const styles = {
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 0,
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
};
