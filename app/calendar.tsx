import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, ActivityIndicator, Dimensions, Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Animated, {
  FadeIn, FadeInDown, SlideInUp,
  useSharedValue, useAnimatedStyle, withTiming, withSpring,
  withRepeat, withSequence, Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft, ChevronRight, Plus, X, Check,
  BrainCircuit, Droplets, Leaf, Target, BarChart3, Microscope,
  Send, Trash2, Sparkles, AlertCircle, Clock,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/Theme';
import { useKilimoStore } from '../store/useKilimoStore';
import { useTasks, Task, TaskPriority, TaskCategory } from '../hooks/useTasks';
import { chat, aiConfigured } from '../lib/ai';

const { width: SW, height: SH } = Dimensions.get('window');
const CELL_W = Math.floor((SW - 32) / 7);
const CELL_H = Math.floor(CELL_W * 0.92);

// ── Locale ─────────────────────────────────────────────────────────────────────
const MONTHS_SW = ['Januari','Februari','Machi','Aprili','Mei','Juni',
                   'Julai','Agosti','Septemba','Oktoba','Novemba','Desemba'];
const MONTHS_EN = ['January','February','March','April','May','June',
                   'July','August','September','October','November','December'];
const DAYS_SW3 = ['Jpi','Jtu','Jne','Jno','Alh','Iju','Jmo'];
const DAYS_EN3 = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const PC: Record<string, string> = {
  critical: '#ef4444', high: '#f59e0b', medium: '#22d15a', low: '#64748b',
};
const PL_SW: Record<string, string> = { critical:'DHARURA', high:'JUU', medium:'KATI', low:'CHINI' };
const PL_EN: Record<string, string> = { critical:'CRITICAL', high:'HIGH', medium:'MEDIUM', low:'LOW' };
const CATS: { id: TaskCategory; sw: string; en: string }[] = [
  { id:'irrigation', sw:'Mwagiliaji', en:'Irrigation' },
  { id:'planting',   sw:'Upandaji',   en:'Planting'   },
  { id:'harvest',    sw:'Mavuno',     en:'Harvest'     },
  { id:'scouting',   sw:'Ukaguzi',    en:'Scouting'    },
  { id:'finance',    sw:'Fedha',      en:'Finance'     },
  { id:'general',    sw:'Mengineyo',  en:'General'     },
];

// ── Utils ──────────────────────────────────────────────────────────────────────
const dim  = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const fday = (y: number, m: number) => new Date(y, m, 1).getDay();
const key  = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const same = (a: Date, b: Date) =>
  a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

const grid = (y: number, m: number): (number|null)[] => {
  const g: (number|null)[] = Array(fday(y,m)).fill(null);
  for (let d=1; d<=dim(y,m); d++) g.push(d);
  while (g.length % 7 !== 0) g.push(null);
  return g;
};

// ── NLP parser ─────────────────────────────────────────────────────────────────
const DAY_MAP: Record<string,number> = {
  sunday:0,jumapili:0, monday:1,jumatatu:1, tuesday:2,jumanne:2,
  wednesday:3,jumatano:3, thursday:4,alhamisi:4, friday:5,ijumaa:5, saturday:6,jumamosi:6,
};
const PRI_WORDS: Record<string,TaskPriority> = {
  dharura:'critical',urgent:'critical',critical:'critical',
  haraka:'high',high:'high', medium:'medium',kawaida:'medium', low:'low',chini:'low',
};
interface Parsed { title:string; date:Date; priority:TaskPriority; category:TaskCategory }
function parseNL(input:string): Parsed|null {
  const l=input.toLowerCase(); const now=new Date(); let date=new Date();
  let priority:TaskPriority='medium'; let category:TaskCategory='general';
  for(const[w,p] of Object.entries(PRI_WORDS)) if(l.includes(w)){priority=p;break;}
  if(l.includes('leo')||l.includes('today')) date=new Date();
  else if(l.includes('kesho')||l.includes('tomorrow')) date=new Date(now.getTime()+86400000);
  else if(l.includes('wiki ijayo')||l.includes('next week')) date=new Date(now.getTime()+7*86400000);
  else { for(const[n,num] of Object.entries(DAY_MAP)) if(l.includes(n)){ const diff=((num-now.getDay())+7)%7||7; date=new Date(now.getTime()+diff*86400000); break; } }
  if(/mwagili|irrigat|water/i.test(l)) category='irrigation';
  else if(/pand|plant|mbegu/i.test(l)) category='planting';
  else if(/vun|harvest/i.test(l)) category='harvest';
  else if(/kagua|scout|wadudu/i.test(l)) category='scouting';
  else if(/lipa|fedha|financ/i.test(l)) category='finance';
  let title=input
    .replace(/^(add|ongeza|schedule|weka|remind me to)\s*/i,'')
    .replace(/\b(today|leo|tomorrow|kesho|next week|wiki ijayo)\b/gi,'')
    .replace(new RegExp(Object.keys(DAY_MAP).join('|'),'gi'),'')
    .replace(new RegExp(Object.keys(PRI_WORDS).join('|'),'gi'),'')
    .replace(/\s{2,}/g,' ').trim();
  return title ? {title,date,priority,category} : null;
}

// ── Category icon ──────────────────────────────────────────────────────────────
const CI = ({cat,sz,c}:{cat:string;sz:number;c:string}) => {
  switch(cat){
    case'irrigation': return <Droplets  size={sz} color={c}/>;
    case'planting':   return <Leaf      size={sz} color={c}/>;
    case'harvest':    return <Sparkles  size={sz} color={c}/>;
    case'scouting':   return <Microscope size={sz} color={c}/>;
    case'finance':    return <BarChart3  size={sz} color={c}/>;
    default:          return <Target    size={sz} color={c}/>;
  }
};

// ── Today pulse ring ───────────────────────────────────────────────────────────
function TodayRing({size}:{size:number}) {
  const sc=useSharedValue(0.6); const op=useSharedValue(0.8);
  useEffect(()=>{
    sc.value=withRepeat(withTiming(1.35,{duration:1400,easing:Easing.out(Easing.ease)}),-1,false);
    op.value=withRepeat(withTiming(0,{duration:1400,easing:Easing.out(Easing.ease)}),-1,false);
  },[]);
  const s=useAnimatedStyle(()=>({transform:[{scale:sc.value}],opacity:op.value}));
  return <Animated.View style={[s,{position:'absolute',width:size,height:size,borderRadius:size/2,borderWidth:1.5,borderColor:'#22d15a'}]}/>;
}

// ── AI orb ─────────────────────────────────────────────────────────────────────
function AIOrb({onPress}:{onPress:()=>void}) {
  const sc=useSharedValue(1); const op=useSharedValue(0.5);
  useEffect(()=>{
    sc.value=withRepeat(withTiming(1.7,{duration:2200,easing:Easing.inOut(Easing.ease)}),-1,true);
    op.value=withRepeat(withTiming(0,{duration:2200,easing:Easing.inOut(Easing.ease)}),-1,true);
  },[]);
  const gs=useAnimatedStyle(()=>({transform:[{scale:sc.value}],opacity:op.value}));
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={S.aiOrb}>
      <Animated.View style={[S.aiOrbGlow,gs]}/>
      <LinearGradient colors={['#1a7a3a','#0a4d22']} style={S.aiOrbInner}>
        <BrainCircuit size={20} color="#22d15a"/>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ── Completion flash ───────────────────────────────────────────────────────────
function DoneFlash({onDone}:{onDone:()=>void}) {
  const sc=useSharedValue(0); const op=useSharedValue(1);
  useEffect(()=>{
    sc.value=withSequence(withSpring(1.3,{damping:7}),withTiming(1,{duration:120}));
    op.value=withSequence(withTiming(1,{duration:200}),withTiming(0,{duration:500}));
    const t=setTimeout(onDone,700); return ()=>clearTimeout(t);
  },[]);
  const s=useAnimatedStyle(()=>({transform:[{scale:sc.value}],opacity:op.value}));
  return (
    <Animated.View style={[StyleSheet.absoluteFill,{alignItems:'center',justifyContent:'center',zIndex:99},s]}>
      <View style={{backgroundColor:'#22d15a',borderRadius:24,padding:12}}>
        <Check size={22} color="#000" strokeWidth={3}/>
      </View>
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function CalendarScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore(s => s.language);
  const addNotification = useKilimoStore(s => s.addNotification);
  const { tasks, createTask, completeTask, cancelTask } = useTasks();

  const today = useMemo(()=>new Date(),[]);
  const [yr,  setYr]  = useState(today.getFullYear());
  const [mo,  setMo]  = useState(today.getMonth());
  const [sel, setSel] = useState<Date>(today);

  // add modal
  const [showAdd,  setShowAdd]  = useState(false);
  const [nTitle,   setNTitle]   = useState('');
  const [nPri,     setNPri]     = useState<TaskPriority>('medium');
  const [nCat,     setNCat]     = useState<TaskCategory>('general');
  const [nDate,    setNDate]    = useState<Date>(today);
  const [saving,   setSaving]   = useState(false);

  // AI panel
  const [showAI,   setShowAI]   = useState(false);
  const [aiIn,     setAIIn]     = useState('');
  const [aiLoad,   setAILoad]   = useState(false);
  const [aiHist,   setAIHist]   = useState<{role:string;text:string}[]>([{
    role:'ai', text: language==='sw'
      ? 'Habari! Mimi ni Sankofa. Niambie "Ongeza [kazi] [tarehe]" au niulize chochote kuhusu ratiba yako.'
      : 'Hi! I\'m Sankofa. Tell me "Add [task] [date]" or ask anything about your schedule.',
  }]);
  const aiRef = useRef<ScrollView>(null);
  const [doneId, setDoneId] = useState<string|null>(null);

  // ── Computed ───────────────────────────────────────────────────────────────
  const calGrid = useMemo(()=>grid(yr,mo),[yr,mo]);
  const monthKey = `${yr}-${mo}`;

  const byKey = useMemo(()=>{
    const m: Record<string,Task[]>={};
    tasks.forEach(t=>{ if(!t.dueDate) return; const k=key(new Date(t.dueDate)); if(!m[k]) m[k]=[]; m[k].push(t); });
    return m;
  },[tasks]);

  const heatmap = useMemo(()=>{
    const h: Record<string,number>={};
    tasks.forEach(t=>{ if(!t.dueDate||t.status==='done') return; const k=key(new Date(t.dueDate)); h[k]=(h[k]||0)+1; });
    return h;
  },[tasks]);

  const dayTasks = useMemo(()=>(byKey[key(sel)]||[]),[byKey,sel]);

  const pending  = useMemo(()=>tasks.filter(t=>t.status==='pending'||t.status==='in_progress'),[tasks]);
  const doneToday= useMemo(()=>tasks.filter(t=>t.status==='done'&&t.completedAt&&same(new Date(t.completedAt),today)),[tasks,today]);
  const overdue  = useMemo(()=>tasks.filter(t=>(t.status==='pending'||t.status==='in_progress')&&t.dueDate&&new Date(t.dueDate)<today),[tasks,today]);

  // ── Nav ────────────────────────────────────────────────────────────────────
  const prevMo=()=>{ Haptics.selectionAsync(); if(mo===0){setYr(y=>y-1);setMo(11);}else setMo(m=>m-1); };
  const nextMo=()=>{ Haptics.selectionAsync(); if(mo===11){setYr(y=>y+1);setMo(0);}else setMo(m=>m+1); };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const onDay=(d:number)=>{ Haptics.selectionAsync(); setSel(new Date(yr,mo,d)); };
  const openAdd=(dt?:Date)=>{ setNDate(dt||sel); setNTitle(''); setNPri('medium'); setNCat('general'); setShowAdd(true); };

  const saveTask=useCallback(async()=>{
    if(!nTitle.trim()) return;
    setSaving(true); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await createTask({ title:nTitle.trim(), category:nCat, priority:nPri, status:'pending', dueDate:nDate.toISOString(), xpReward:nPri==='critical'?40:nPri==='high'?25:15, syncedOffline:false });
    addNotification({ id:`cal-${Date.now()}`, type:'info', title: language==='sw'?'Kazi Mpya':'Task Added', body:nTitle.trim(), read:false, createdAt:new Date().toISOString() });
    setSaving(false); setNTitle(''); setShowAdd(false);
  },[nTitle,nPri,nCat,nDate,createTask,addNotification,language]);

  const doComplete=useCallback((t:Task)=>{
    if(t.status==='done') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDoneId(t.id);
    setTimeout(()=>{ completeTask(t.id); setDoneId(null);
      addNotification({ id:`done-${Date.now()}`, type:'success', title: language==='sw'?'✓ Kazi Imekamilika!':'✓ Task Done!', body: language==='sw'&&t.titleSw?t.titleSw:t.title, read:false, createdAt:new Date().toISOString() });
    },700);
  },[completeTask,addNotification,language]);

  const doAI=useCallback(async(q?:string)=>{
    const query=(q||aiIn).trim(); if(!query) return;
    setAILoad(true); setAIIn('');
    setAIHist(h=>[...h,{role:'user',text:query}]);
    setTimeout(()=>aiRef.current?.scrollToEnd({animated:true}),80);
    try {
      const isCreate=/ongeza|add|weka|schedule/i.test(query);
      const isBulk  =/songa.*zote|move.*all|hamisha.*kazi/i.test(query);
      const isGuide =/jinsi|how|saidia.*kutumia|nifundishe/i.test(query);
      let reply='';
      if(isBulk){
        const todayKey=key(today);
        const tp=tasks.filter(t=>t.dueDate&&key(new Date(t.dueDate))===todayKey&&(t.status==='pending'||t.status==='in_progress'));
        for(const t of tp){ await cancelTask(t.id); await createTask({...t,status:'pending',dueDate:new Date(today.getTime()+86400000).toISOString()}); }
        reply=language==='sw'?`Nimesonga kazi ${tp.length} hadi kesho. ✓`:`Moved ${tp.length} task(s) to tomorrow. ✓`;
      } else if(isCreate){
        const p=parseNL(query);
        if(p){ await createTask({title:p.title,category:p.category,priority:p.priority,status:'pending',dueDate:p.date.toISOString(),xpReward:20,syncedOffline:false});
          setSel(p.date); setYr(p.date.getFullYear()); setMo(p.date.getMonth());
          const ms=language==='sw'?MONTHS_SW:MONTHS_EN;
          reply=language==='sw'?`Nimeweka "${p.title}" tarehe ${p.date.getDate()} ${ms[p.date.getMonth()]}. ✓`:`Added "${p.title}" for ${ms[p.date.getMonth()]} ${p.date.getDate()}. ✓`;
        } else reply=language==='sw'?'Samahani, sijapata kichwa cha kazi. Jaribu: "Ongeza kumwagilia Ijumaa"':'Could not parse task. Try: "Add irrigate Block B on Friday"';
      } else if(isGuide){
        reply=language==='sw'?'Ili kuongeza kazi:\n• Bonyeza tarehe kwenye kalenda\n• Bonyeza kitufe cha "+" chini\n• Au niambie hapa kwa lugha ya kawaida\n\nKukamilisha kazi: Bonyeza ✓ kwenye kazi yoyote.':'To add a task:\n• Tap any date on the calendar\n• Tap the "+" button below\n• Or tell me here in plain language\n\nTo complete: Tap ✓ on any task in the list.';
      } else if(aiConfigured()){
        const mn=(language==='sw'?MONTHS_SW:MONTHS_EN)[mo];
        reply=await chat([{role:'user',content:`You are Sankofa AI, a farm calendar assistant. ${mn} ${yr}, ${dayTasks.filter(t=>t.status!=='done').length} tasks on selected date, ${pending.length} total pending. Respond concisely in ${language==='sw'?'Kiswahili':'English'}. User: "${query}"`}]);
      } else {
        const over=Object.values(heatmap).filter(v=>v>2).length;
        reply=language==='sw'
          ?(over>0?`Una siku ${over} zenye kazi nyingi. Niambie "Songa kazi zote leo kesho" kukusaidia.`:`Ratiba yako inaonekana vizuri! Kazi ${pending.length} zingooja. Bonyeza tarehe au niambie "Ongeza [kazi] [tarehe]".`)
          :(over>0?`You have ${over} overloaded days. Tell me "Move all today's tasks to tomorrow" to reschedule.`:`Schedule looks good! ${pending.length} tasks pending. Tap a date or say "Add [task] [date]".`);
      }
      setAIHist(h=>[...h,{role:'ai',text:reply}]);
    } catch { setAIHist(h=>[...h,{role:'ai',text:language==='sw'?'Kuna tatizo. Jaribu tena.':'Something went wrong. Try again.'}]); }
    finally { setAILoad(false); setTimeout(()=>aiRef.current?.scrollToEnd({animated:true}),120); }
  },[aiIn,tasks,dayTasks,pending,heatmap,mo,yr,sel,today,language,createTask,cancelTask]);

  // ── Calendar grid ──────────────────────────────────────────────────────────
  const months = language==='sw'?MONTHS_SW:MONTHS_EN;
  const days3  = language==='sw'?DAYS_SW3:DAYS_EN3;

  const renderGrid=()=>(
    <View style={S.gridWrap}>
      {/* Editorial giant watermark */}
      <Text style={S.watermark} numberOfLines={1} adjustsFontSizeToFit={false}>
        {months[mo].slice(0,3).toUpperCase()}
      </Text>

      {/* Month navigation */}
      <View style={S.monthRow}>
        <TouchableOpacity onPress={prevMo} hitSlop={{top:12,bottom:12,left:14,right:14}}>
          <ChevronLeft size={22} color="rgba(255,255,255,0.5)"/>
        </TouchableOpacity>
        <View style={{alignItems:'center',gap:2}}>
          <Text style={S.monthName}>{months[mo]}</Text>
          <Text style={S.yearChip}>{yr}</Text>
        </View>
        <TouchableOpacity onPress={nextMo} hitSlop={{top:12,bottom:12,left:14,right:14}}>
          <ChevronRight size={22} color="rgba(255,255,255,0.5)"/>
        </TouchableOpacity>
      </View>

      {/* Stat pills */}
      <View style={S.statsRow}>
        <View style={[S.statPill,{borderColor:'rgba(34,209,90,0.3)',backgroundColor:'rgba(34,209,90,0.07)'}]}>
          <View style={[S.statDot,{backgroundColor:'#22d15a'}]}/>
          <Text style={[S.statTxt,{color:'#22d15a'}]}>{pending.length} {language==='sw'?'Zingooja':'Pending'}</Text>
        </View>
        <View style={[S.statPill,{borderColor:'rgba(148,163,184,0.25)',backgroundColor:'rgba(148,163,184,0.07)'}]}>
          <View style={[S.statDot,{backgroundColor:'#94a3b8'}]}/>
          <Text style={[S.statTxt,{color:'#94a3b8'}]}>{doneToday.length} {language==='sw'?'Leo':'Done today'}</Text>
        </View>
        {overdue.length>0&&(
          <View style={[S.statPill,{borderColor:'rgba(239,68,68,0.3)',backgroundColor:'rgba(239,68,68,0.07)'}]}>
            <View style={[S.statDot,{backgroundColor:'#ef4444'}]}/>
            <Text style={[S.statTxt,{color:'#ef4444'}]}>{overdue.length} {language==='sw'?'Imepita':'Overdue'}</Text>
          </View>
        )}
      </View>

      {/* Day headers */}
      <View style={S.dayHdrRow}>
        {days3.map((d,i)=>(
          <View key={i} style={{width:CELL_W,alignItems:'center'}}>
            <Text style={S.dayHdr}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Grid */}
      <Animated.View key={monthKey} entering={FadeIn.duration(280)} style={S.cellsWrap}>
        {calGrid.map((day,i)=>{
          if(!day) return <View key={i} style={{width:CELL_W,height:CELL_H}}/>;
          const cd    = new Date(yr,mo,day);
          const isT   = same(cd,today);
          const isSel = same(cd,sel);
          const isPast= cd<today&&!isT;
          const heat  = Math.min((heatmap[key(cd)]||0)*0.12,0.28);
          const tasks4= (byKey[key(cd)]||[]).filter(t=>t.status!=='done').slice(0,3);

          return (
            <TouchableOpacity
              key={i}
              onPress={()=>onDay(day)}
              activeOpacity={0.72}
              style={[S.cell,{width:CELL_W,height:CELL_H,backgroundColor:heat>0?`rgba(34,209,90,${heat})`:'transparent'}]}
            >
              {isT&&!isSel&&<TodayRing size={CELL_W*0.78}/>}
              {isSel&&(
                <LinearGradient
                  colors={['#22d15a','#12903a']}
                  style={[StyleSheet.absoluteFill,{borderRadius:CELL_W*0.38}]}
                />
              )}
              <Text style={[
                S.cellNum,
                {color: isSel?'#000': isT?'#22d15a': isPast?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.85)'},
                isSel&&{fontFamily:'Inter_700Bold'},
              ]}>
                {day}
              </Text>
              {tasks4.length>0&&(
                <View style={S.cellStrips}>
                  {tasks4.map((t,di)=>(
                    <View key={di} style={[S.strip,{backgroundColor:PC[t.priority]||'#22d15a'}]}/>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );

  // ── Day panel ──────────────────────────────────────────────────────────────
  const renderDayPanel=()=>{
    const pending4 = dayTasks.filter(t=>t.status!=='done');
    const done4    = dayTasks.filter(t=>t.status==='done');
    const isT      = same(sel,today);
    const dateStr  = `${sel.getDate()} ${months[sel.getMonth()]}`;

    return (
      <View style={[S.dayPanel,{backgroundColor:'rgba(6,15,8,0.98)'}]}>
        <LinearGradient colors={['rgba(34,209,90,0.05)','transparent']} style={StyleSheet.absoluteFill} pointerEvents="none"/>

        {/* Pull handle */}
        <View style={S.pullHandle}/>

        {/* Panel header */}
        <View style={S.panelHdr}>
          <View>
            <Text style={S.panelDate}>
              {dateStr}{isT?(language==='sw'?' · Leo':' · Today'):''}
            </Text>
            <Text style={S.panelSub}>
              {pending4.length} {language==='sw'?'kazi zinasubiri':'tasks pending'} · {done4.length} {language==='sw'?'zilizokamilika':'done'}
            </Text>
          </View>
          <TouchableOpacity onPress={()=>openAdd()} style={[S.addChip,{backgroundColor:'rgba(34,209,90,0.12)',borderColor:'rgba(34,209,90,0.3)'}]}>
            <Plus size={13} color="#22d15a"/>
            <Text style={[S.addChipTxt,{color:'#22d15a'}]}>{language==='sw'?'Ongeza':'Add'}</Text>
          </TouchableOpacity>
        </View>

        {/* Task timeline */}
        {dayTasks.length===0 ? (
          <View style={S.emptyState}>
            <Text style={S.emptyEmoji}>🌱</Text>
            <Text style={S.emptyTxt}>{language==='sw'?'Hakuna kazi kwa siku hii':'No tasks for this day'}</Text>
            <TouchableOpacity onPress={()=>openAdd()} style={[S.emptyBtn,{backgroundColor:'#22d15a'}]}>
              <Plus size={13} color="#000"/>
              <Text style={S.emptyBtnTxt}>{language==='sw'?'Ongeza Kazi':'Add a Task'}</Text>
            </TouchableOpacity>
          </View>
        ):(
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:120}}>
            {/* Timeline line */}
            <View style={S.timelineWrap}>
              <View style={S.timelineLine}/>
              <View style={{flex:1,gap:10}}>
                {dayTasks.map((t,idx)=>{
                  const pc   = PC[t.priority]||'#22d15a';
                  const done = t.status==='done';
                  const isF  = doneId===t.id;
                  return (
                    <Animated.View key={t.id} entering={FadeInDown.delay(idx*45).springify()}>
                      <View style={[S.taskCard,{
                        backgroundColor: done?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.05)',
                        borderLeftColor: done?'rgba(255,255,255,0.06)':pc,
                        opacity: done?0.5:1,
                      }]}>
                        {isF&&<DoneFlash onDone={()=>{}}/>}

                        {/* Timeline dot */}
                        <View style={[S.tlDot,{backgroundColor:done?'rgba(255,255,255,0.15)':pc}]}/>

                        {/* Cat icon */}
                        <View style={[S.catBadge,{backgroundColor:pc+'20'}]}>
                          <CI cat={t.category} sz={14} c={pc}/>
                        </View>

                        {/* Content */}
                        <View style={{flex:1}}>
                          <Text style={[S.taskTtl,{color:done?'rgba(255,255,255,0.35)':'rgba(255,255,255,0.92)',textDecorationLine:done?'line-through':'none'}]} numberOfLines={2}>
                            {language==='sw'&&t.titleSw?t.titleSw:t.title}
                          </Text>
                          <View style={{flexDirection:'row',gap:6,marginTop:4,flexWrap:'wrap'}}>
                            <View style={[S.priTag,{backgroundColor:pc+'15',borderColor:pc+'30'}]}>
                              <Text style={[S.priTagTxt,{color:pc}]}>
                                {language==='sw'?PL_SW[t.priority]:PL_EN[t.priority]}
                              </Text>
                            </View>
                            {t.farmBlock&&<Text style={S.blockTxt}>{t.farmBlock}</Text>}
                          </View>
                        </View>

                        {/* Actions */}
                        {!done&&(
                          <TouchableOpacity onPress={()=>doComplete(t)} style={[S.checkBtn,{backgroundColor:'rgba(34,209,90,0.1)',borderColor:'rgba(34,209,90,0.3)'}]}>
                            <Check size={13} color="#22d15a" strokeWidth={2.5}/>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={()=>{Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);cancelTask(t.id);}}
                          style={[S.delBtn,{backgroundColor:'rgba(239,68,68,0.07)',borderColor:'rgba(239,68,68,0.2)'}]}
                        >
                          <Trash2 size={11} color="#ef4444"/>
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    );
  };

  // ── Add modal ──────────────────────────────────────────────────────────────
  const renderAddModal=()=>(
    <Modal visible={showAdd} transparent animationType="slide" onRequestClose={()=>setShowAdd(false)}>
      <View style={S.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={()=>setShowAdd(false)}/>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined}>
          <Animated.View entering={SlideInUp.springify()} style={S.sheet}>
            <LinearGradient colors={['rgba(34,209,90,0.1)','transparent']} style={StyleSheet.absoluteFill} pointerEvents="none"/>

            <View style={S.sheetHdr}>
              <View>
                <Text style={S.sheetTitle}>{language==='sw'?'Ongeza Kazi':'Add Task'}</Text>
                <Text style={S.sheetSub}>{nDate.getDate()} {months[nDate.getMonth()]} {nDate.getFullYear()}</Text>
              </View>
              <TouchableOpacity onPress={()=>setShowAdd(false)} style={S.xBtn}>
                <X size={18} color="rgba(255,255,255,0.6)"/>
              </TouchableOpacity>
            </View>

            <View style={S.inputBox}>
              <TextInput
                style={S.titleIn}
                placeholder={language==='sw'?'Jina la kazi...':'Task title...'}
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={nTitle} onChangeText={setNTitle} autoFocus
              />
            </View>

            <Text style={S.fieldLbl}>{language==='sw'?'KIPAUMBELE':'PRIORITY'}</Text>
            <View style={S.priRow}>
              {(['low','medium','high','critical'] as TaskPriority[]).map(p=>(
                <TouchableOpacity key={p} onPress={()=>{Haptics.selectionAsync();setNPri(p);}} style={[S.priBtn,{borderColor:PC[p],backgroundColor:nPri===p?PC[p]:'transparent'}]}>
                  <Text style={[S.priBtnTxt,{color:nPri===p?'#000':PC[p]}]}>
                    {language==='sw'?PL_SW[p]:PL_EN[p]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={S.fieldLbl}>{language==='sw'?'AINA':'CATEGORY'}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
              <View style={{flexDirection:'row',gap:8}}>
                {CATS.map(c=>(
                  <TouchableOpacity key={c.id} onPress={()=>{Haptics.selectionAsync();setNCat(c.id);}} style={[S.catBtn,{backgroundColor:nCat===c.id?'rgba(34,209,90,0.15)':'transparent',borderColor:nCat===c.id?'#22d15a':'rgba(255,255,255,0.1)'}]}>
                    <CI cat={c.id} sz={13} c={nCat===c.id?'#22d15a':'rgba(255,255,255,0.4)'}/>
                    <Text style={[S.catBtnTxt,{color:nCat===c.id?'#22d15a':'rgba(255,255,255,0.45)'}]}>
                      {language==='sw'?c.sw:c.en}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity onPress={()=>{setShowAdd(false);setShowAI(true);}} style={S.aiHintBtn}>
              <BrainCircuit size={13} color="#22d15a"/>
              <Text style={S.aiHintTxt}>{language==='sw'?'Au tumia Sankofa AI — "Ongeza [kazi] Ijumaa" →':'Or use Sankofa AI — "Add [task] on Friday" →'}</Text>
            </TouchableOpacity>

            <View style={S.sheetActions}>
              <TouchableOpacity onPress={()=>setShowAdd(false)} style={S.cancelBtn}>
                <Text style={S.cancelTxt}>{language==='sw'?'Futa':'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveTask} disabled={!nTitle.trim()||saving} style={[S.saveBtn,{backgroundColor:nTitle.trim()?'#22d15a':'rgba(255,255,255,0.1)'}]}>
                {saving?<ActivityIndicator size="small" color="#000"/>:<>
                  <Check size={14} color="#000" strokeWidth={3}/>
                  <Text style={S.saveTxt}>{language==='sw'?'Hifadhi':'Save'}</Text>
                </>}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  // ── AI panel ───────────────────────────────────────────────────────────────
  const QP = language==='sw'
    ? ['Ongeza kazi leo','Songa kazi zote leo kesho','Siku zipi zina kazi nyingi?','Jinsi ya kutumia kalenda?']
    : ['Add task for today','Move all today\'s tasks to tomorrow','Which days are overloaded?','How do I use the calendar?'];

  const renderAIPanel=()=>(
    <Modal visible={showAI} transparent animationType="slide" onRequestClose={()=>setShowAI(false)}>
      <View style={S.overlay}>
        <TouchableOpacity style={{flex:1}} onPress={()=>setShowAI(false)}/>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined}>
          <Animated.View entering={SlideInUp.springify()} style={[S.aiSheet]}>
            <LinearGradient colors={['rgba(34,209,90,0.12)','rgba(34,209,90,0.03)','transparent']} style={StyleSheet.absoluteFill} pointerEvents="none"/>

            <View style={S.aiHdr}>
              <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
                <View style={S.aiAvatarWrap}>
                  <BrainCircuit size={18} color="#22d15a"/>
                </View>
                <View>
                  <Text style={S.aiTitle}>Sankofa AI</Text>
                  <Text style={S.aiSub}>{language==='sw'?'Msaidizi wa Kalenda':'Calendar Assistant'}</Text>
                </View>
                <View style={S.livePill}>
                  <View style={S.liveDot}/>
                  <Text style={S.liveTxt}>LIVE</Text>
                </View>
              </View>
              <TouchableOpacity onPress={()=>setShowAI(false)} style={S.xBtn}>
                <X size={18} color="rgba(255,255,255,0.6)"/>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.qpRow}>
              {QP.map((p,i)=>(
                <TouchableOpacity key={i} onPress={()=>doAI(p)} style={S.qpPill}>
                  <Text style={S.qpTxt}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView ref={aiRef} style={S.chatArea} showsVerticalScrollIndicator={false} contentContainerStyle={{gap:10,paddingBottom:8}}>
              {aiHist.map((m,i)=>(
                <Animated.View key={i} entering={FadeIn}>
                  <View style={[S.bubble, m.role==='user'?S.bubbleUser:S.bubbleAI]}>
                    <Text style={[S.bubbleTxt,{color:m.role==='user'?'#000':'rgba(255,255,255,0.88)'}]}>{m.text}</Text>
                  </View>
                </Animated.View>
              ))}
              {aiLoad&&(
                <View style={[S.bubble,S.bubbleAI]}>
                  <ActivityIndicator size="small" color="#22d15a"/>
                </View>
              )}
            </ScrollView>

            <View style={S.aiInputRow}>
              <TextInput
                style={S.aiInput}
                placeholder={language==='sw'?'Uliza au ongeza kazi...':'Ask or add a task...'}
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={aiIn} onChangeText={setAIIn}
                onSubmitEditing={()=>doAI()} returnKeyType="send"
              />
              <TouchableOpacity onPress={()=>doAI()} disabled={!aiIn.trim()||aiLoad} style={[S.sendBtn,{backgroundColor:aiIn.trim()?'#22d15a':'transparent'}]}>
                {aiLoad?<ActivityIndicator size="small" color="#22d15a"/>:<Send size={15} color={aiIn.trim()?'#000':'rgba(255,255,255,0.25)'}/>}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <View style={[S.root]}>
      {/* Deep gradient bg */}
      <LinearGradient colors={['#040e06','#030b05','#020804']} style={StyleSheet.absoluteFill}/>

      <SafeAreaView style={{flex:1}}>
        {/* Header */}
        <View style={S.hdr}>
          <TouchableOpacity onPress={()=>router.back()} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <ChevronLeft size={22} color="rgba(255,255,255,0.7)"/>
          </TouchableOpacity>
          <View style={{flex:1,paddingLeft:8}}>
            <Text style={S.hdrTitle}>{language==='sw'?'Kalenda ya Shamba':'Farm Calendar'}</Text>
          </View>
          <TouchableOpacity onPress={()=>setShowAI(true)} style={S.hdrAI}>
            <BrainCircuit size={14} color="#22d15a"/>
            <Text style={S.hdrAITxt}>AI</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>openAdd()} style={S.hdrAdd}>
            <Plus size={16} color="#000" strokeWidth={2.5}/>
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={{paddingHorizontal:16}}>
          {renderGrid()}
        </View>

        {/* Day panel */}
        <View style={{flex:1}}>
          {renderDayPanel()}
        </View>
      </SafeAreaView>

      {/* Floating orbs */}
      <AIOrb onPress={()=>setShowAI(true)}/>
      <TouchableOpacity onPress={()=>openAdd()} style={S.fab} activeOpacity={0.85}>
        <Plus size={22} color="#000" strokeWidth={2.5}/>
      </TouchableOpacity>

      {renderAddModal()}
      {renderAIPanel()}
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  root:       { flex:1 },
  hdr:        { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingTop: Platform.OS==='android'?16:4, paddingBottom:10, gap:6 },
  hdrTitle:   { fontSize:17, fontFamily:'InstrumentSerif_400Regular', color:'rgba(255,255,255,0.9)' },
  hdrAI:      { flexDirection:'row', alignItems:'center', gap:5, paddingHorizontal:10, paddingVertical:6, borderRadius:12, backgroundColor:'rgba(34,209,90,0.1)', borderWidth:1, borderColor:'rgba(34,209,90,0.25)' },
  hdrAITxt:   { fontSize:11, fontFamily:'Inter_700Bold', color:'#22d15a' },
  hdrAdd:     { width:32, height:32, borderRadius:16, backgroundColor:'#22d15a', alignItems:'center', justifyContent:'center' },

  // Grid
  gridWrap:   { paddingBottom:8, position:'relative', overflow:'hidden' },
  watermark:  { position:'absolute', fontSize:140, fontFamily:'InstrumentSerif_400Regular', color:'#22d15a', opacity:0.04, top:-10, left:-8, letterSpacing:8, zIndex:0 },
  monthRow:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10, zIndex:1 },
  monthName:  { fontSize:26, fontFamily:'InstrumentSerif_400Regular', color:'rgba(255,255,255,0.92)', textAlign:'center' },
  yearChip:   { fontSize:11, fontFamily:'Inter_500Medium', color:'rgba(255,255,255,0.35)', textAlign:'center' },
  statsRow:   { flexDirection:'row', gap:8, marginBottom:12, flexWrap:'wrap' },
  statPill:   { flexDirection:'row', alignItems:'center', gap:5, paddingHorizontal:10, paddingVertical:5, borderRadius:20, borderWidth:1 },
  statDot:    { width:5, height:5, borderRadius:3 },
  statTxt:    { fontSize:10, fontFamily:'Inter_600SemiBold' },
  dayHdrRow:  { flexDirection:'row', marginBottom:6 },
  dayHdr:     { fontSize:9, fontFamily:'Inter_700Bold', color:'rgba(255,255,255,0.28)', letterSpacing:0.5 },
  cellsWrap:  { flexDirection:'row', flexWrap:'wrap' },
  cell:       { alignItems:'center', justifyContent:'center', borderRadius:12, position:'relative', overflow:'visible' },
  cellNum:    { fontSize:14, fontFamily:'InstrumentSerif_400Regular', zIndex:1 },
  cellStrips: { position:'absolute', bottom:3, flexDirection:'row', gap:2 },
  strip:      { width:5, height:3, borderRadius:2 },

  // Day panel
  dayPanel:   { flex:1, borderTopLeftRadius:28, borderTopRightRadius:28, borderTopWidth:1, borderLeftWidth:1, borderRightWidth:1, borderColor:'rgba(255,255,255,0.07)', overflow:'hidden', paddingHorizontal:16, paddingTop:8 },
  pullHandle: { width:32, height:3, borderRadius:2, backgroundColor:'rgba(255,255,255,0.15)', alignSelf:'center', marginBottom:14 },
  panelHdr:   { flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 },
  panelDate:  { fontSize:20, fontFamily:'InstrumentSerif_400Regular', color:'rgba(255,255,255,0.9)' },
  panelSub:   { fontSize:10, fontFamily:'Inter_500Medium', color:'rgba(255,255,255,0.35)', marginTop:2 },
  addChip:    { flexDirection:'row', alignItems:'center', gap:5, paddingHorizontal:12, paddingVertical:7, borderRadius:14, borderWidth:1 },
  addChipTxt: { fontSize:11, fontFamily:'Inter_700Bold' },

  // Timeline
  timelineWrap: { flexDirection:'row', gap:14 },
  timelineLine: { width:1.5, backgroundColor:'rgba(34,209,90,0.15)', marginTop:20, marginBottom:20, marginLeft:6 },
  taskCard: { flexDirection:'row', alignItems:'center', gap:10, padding:12, borderRadius:14, borderLeftWidth:3, position:'relative', overflow:'hidden', borderTopWidth:0, borderRightWidth:0, borderBottomWidth:0 },
  tlDot:    { position:'absolute', left:-22, width:10, height:10, borderRadius:5 },
  catBadge: { width:32, height:32, borderRadius:10, alignItems:'center', justifyContent:'center' },
  taskTtl:  { fontSize:13, fontFamily:'Inter_600SemiBold', lineHeight:18 },
  blockTxt: { fontSize:9, fontFamily:'Inter_500Medium', color:'rgba(255,255,255,0.3)' },
  priTag:   { paddingHorizontal:6, paddingVertical:2, borderRadius:5, borderWidth:1 },
  priTagTxt:{ fontSize:7, fontFamily:'Inter_700Bold', letterSpacing:0.5 },
  checkBtn: { width:30, height:30, borderRadius:15, alignItems:'center', justifyContent:'center', borderWidth:1 },
  delBtn:   { width:26, height:26, borderRadius:13, alignItems:'center', justifyContent:'center', borderWidth:1, marginLeft:2 },

  // Empty state
  emptyState: { alignItems:'center', paddingTop:28, gap:8 },
  emptyEmoji: { fontSize:36 },
  emptyTxt:   { fontSize:13, fontFamily:'Inter_500Medium', color:'rgba(255,255,255,0.3)', textAlign:'center' },
  emptyBtn:   { flexDirection:'row', alignItems:'center', gap:6, marginTop:10, paddingHorizontal:18, paddingVertical:11, borderRadius:14 },
  emptyBtnTxt:{ fontSize:12, fontFamily:'Inter_700Bold', color:'#000' },

  // FABs
  aiOrb:       { position:'absolute', bottom:88, right:20, width:52, height:52, alignItems:'center', justifyContent:'center' },
  aiOrbGlow:   { position:'absolute', width:52, height:52, borderRadius:26, backgroundColor:'rgba(34,209,90,0.25)' },
  aiOrbInner:  { width:52, height:52, borderRadius:26, alignItems:'center', justifyContent:'center', shadowColor:'#22d15a', shadowOffset:{width:0,height:0}, shadowOpacity:0.5, shadowRadius:10, elevation:8 },
  fab:         { position:'absolute', bottom:24, right:20, width:52, height:52, borderRadius:26, backgroundColor:'#22d15a', alignItems:'center', justifyContent:'center', shadowColor:'#22d15a', shadowOffset:{width:0,height:4}, shadowOpacity:0.45, shadowRadius:14, elevation:9 },

  // Add modal
  overlay:    { flex:1, justifyContent:'flex-end' },
  sheet:      { borderTopLeftRadius:28, borderTopRightRadius:28, borderTopWidth:1, borderLeftWidth:1, borderRightWidth:1, borderColor:'rgba(255,255,255,0.08)', backgroundColor:'#07120a', padding:20, overflow:'hidden' },
  sheetHdr:   { flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 },
  sheetTitle: { fontSize:22, fontFamily:'InstrumentSerif_400Regular', color:'rgba(255,255,255,0.92)' },
  sheetSub:   { fontSize:11, fontFamily:'Inter_500Medium', color:'rgba(255,255,255,0.35)', marginTop:2 },
  xBtn:       { width:32, height:32, borderRadius:16, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center' },
  inputBox:   { backgroundColor:'rgba(255,255,255,0.05)', borderRadius:14, borderWidth:1, borderColor:'rgba(255,255,255,0.1)', paddingHorizontal:14, paddingVertical:10, marginBottom:16 },
  titleIn:    { fontSize:15, fontFamily:'Inter_500Medium', color:'rgba(255,255,255,0.9)', minHeight:40 },
  fieldLbl:   { fontSize:9, fontFamily:'Inter_700Bold', letterSpacing:0.9, color:'rgba(255,255,255,0.35)', marginBottom:8 },
  priRow:     { flexDirection:'row', gap:8, marginBottom:16 },
  priBtn:     { flex:1, paddingVertical:8, borderRadius:10, borderWidth:1.5, alignItems:'center' },
  priBtnTxt:  { fontSize:9, fontFamily:'Inter_700Bold' },
  catBtn:     { flexDirection:'row', alignItems:'center', gap:5, paddingHorizontal:10, paddingVertical:7, borderRadius:10, borderWidth:1 },
  catBtnTxt:  { fontSize:10, fontFamily:'Inter_600SemiBold' },
  aiHintBtn:  { flexDirection:'row', alignItems:'center', gap:8, padding:10, borderRadius:12, borderWidth:1, borderColor:'rgba(34,209,90,0.2)', backgroundColor:'rgba(34,209,90,0.06)', marginBottom:16 },
  aiHintTxt:  { fontSize:11, fontFamily:'Inter_600SemiBold', color:'#22d15a', flex:1 },
  sheetActions:{ flexDirection:'row', gap:10 },
  cancelBtn:  { flex:1, paddingVertical:13, borderRadius:14, alignItems:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.1)' },
  cancelTxt:  { fontSize:13, fontFamily:'Inter_600SemiBold', color:'rgba(255,255,255,0.45)' },
  saveBtn:    { flex:2, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, paddingVertical:13, borderRadius:14 },
  saveTxt:    { fontSize:13, fontFamily:'Inter_700Bold', color:'#000' },

  // AI panel
  aiSheet:    { borderTopLeftRadius:28, borderTopRightRadius:28, borderTopWidth:1, borderLeftWidth:1, borderRightWidth:1, borderColor:'rgba(255,255,255,0.08)', backgroundColor:'#06100a', maxHeight:'82%', overflow:'hidden' },
  aiHdr:      { flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16, paddingBottom:10 },
  aiAvatarWrap:{ width:38, height:38, borderRadius:19, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(34,209,90,0.12)', borderWidth:1, borderColor:'rgba(34,209,90,0.3)' },
  aiTitle:    { fontSize:16, fontFamily:'InstrumentSerif_400Regular', color:'rgba(255,255,255,0.9)' },
  aiSub:      { fontSize:10, fontFamily:'Inter_500Medium', color:'rgba(255,255,255,0.35)' },
  livePill:   { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:8, paddingVertical:4, borderRadius:8, backgroundColor:'rgba(34,209,90,0.1)', borderWidth:1, borderColor:'rgba(34,209,90,0.25)', marginLeft:8 },
  liveDot:    { width:5, height:5, borderRadius:3, backgroundColor:'#22d15a' },
  liveTxt:    { fontSize:8, fontFamily:'Inter_700Bold', color:'#22d15a' },
  qpRow:      { paddingHorizontal:16, paddingBottom:8, gap:8 },
  qpPill:     { paddingHorizontal:12, paddingVertical:6, borderRadius:20, borderWidth:1, borderColor:'rgba(255,255,255,0.1)', backgroundColor:'rgba(255,255,255,0.04)' },
  qpTxt:      { fontSize:11, fontFamily:'Inter_600SemiBold', color:'rgba(255,255,255,0.55)' },
  chatArea:   { maxHeight:240, paddingHorizontal:16 },
  bubble:     { borderRadius:16, padding:12, maxWidth:'84%' },
  bubbleUser: { alignSelf:'flex-end', backgroundColor:'#22d15a', borderBottomRightRadius:4 },
  bubbleAI:   { alignSelf:'flex-start', backgroundColor:'rgba(255,255,255,0.06)', borderBottomLeftRadius:4 },
  bubbleTxt:  { fontSize:13, fontFamily:'Inter_500Medium', lineHeight:19 },
  aiInputRow: { flexDirection:'row', alignItems:'center', margin:12, marginTop:8, borderRadius:16, borderWidth:1, borderColor:'rgba(255,255,255,0.1)', backgroundColor:'rgba(255,255,255,0.04)', paddingHorizontal:12, paddingVertical:8, gap:8 },
  aiInput:    { flex:1, fontSize:13, fontFamily:'Inter_500Medium', color:'rgba(255,255,255,0.88)', minHeight:34 },
  sendBtn:    { width:34, height:34, borderRadius:17, alignItems:'center', justifyContent:'center' },
});
