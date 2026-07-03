import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
ArrowLeft, ArrowRight, Target, ShieldCheck, ChevronDown,
ChevronUp, AlertTriangle, Loader2, Sparkles, Edit2, Save, Wrench,
MapPin, FileText, Eye, Clock, Mic, MicOff, Volume2, X, Globe, Maximize, Minimize
} from 'lucide-react';

// --- 多言語辞書 (i18n) ---
const i18n = {
ja: {
calendar: "作業記録カレンダー",
today: "今日",
openRecord: "記録を開く",
noPlan: "予定なし",
add: "追加",
backToCalendar: "カレンダーに戻る",
createAI: "AIで作業を作成",
editJobName: "作業名の編集",
location: "現場の場所",
memo: "メモ",
viewCount: "閲覧",
noLocationMemo: "場所やメモは登録されていません",
readAll: "現在のタブをすべて読み上げ",
processMgmt: "工程管理",
processDetail: "工程詳細",
edit: "編集",
cancel: "キャンセル",
save: "保存",
recordFlow: "工程の流れを記録します",
aiGenerateBtn: "AIで自動生成する",
swipeToView: "横にスワイプして工程を確認できます",
relation: "関係性",
tapToViewInsight: "タップして詳しい考察を見る",
close: "閉じる",
purpose: "観点・目的",
prevents: "防げる事態",
insight: "深い考察・ノウハウ",
tapToViewDetails: "タップして詳しい手順やリスクを見る",
points: "作業ポイント",
risk: "安全面（リスク）",
riskMgmt: "リスク管理",
aiGenerating: "専門知識を生成中...",
createThisJob: "この作業を作成する",
addJobHint: "例: エアコンの取り付け など (必須)",
locationHint: "現場の場所 (任意)",
memoHint: "作業に関するメモ (任意)",
voiceHint: "「戻る」「○日の記録を開いて」と話しかけてください",
reading: "読み上げ中...",
aiTitle: "AIで作業を自動生成",
aiDesc: "の予定として追加します",
aiPromptLang: "Japanese",
sttLang: "ja-JP",
ttsLang: "ja-JP",
voiceHintText: "ja",
backMsg: "カレンダーに戻りました。",
noPlanMsg: "日の予定はありません。",
todayNoPlanMsg: "今日の予定はありません。"
},
en: {
calendar: "Work Record Calendar",
today: "Today",
openRecord: "Open",
noPlan: "No plan",
add: "Add",
backToCalendar: "Back to Calendar",
createAI: "Create with AI",
editJobName: "Edit Job Name",
location: "Location",
memo: "Memo",
viewCount: "Views",
noLocationMemo: "No location or memo added.",
readAll: "Read current tab",
processMgmt: "Roadmap",
processDetail: "Details",
edit: "Edit",
cancel: "Cancel",
save: "Save",
recordFlow: "Record your workflow",
aiGenerateBtn: "Generate with AI",
swipeToView: "Swipe horizontally to view",
relation: "Relation",
tapToViewInsight: "Tap for insights",
close: "Close",
purpose: "Purpose",
prevents: "Prevents",
insight: "Insights / Know-how",
tapToViewDetails: "Tap for details and risks",
points: "Key Points",
risk: "Safety (Risks)",
riskMgmt: "Risk Management",
aiGenerating: "Generating expert knowledge...",
createThisJob: "Create this job",
addJobHint: "e.g. AC installation (Required)",
locationHint: "Location (Optional)",
memoHint: "Memo (Optional)",
voiceHint: "Say 'Back' or 'Open records for the 15th'",
reading: "Reading...",
aiTitle: "Auto-generate with AI",
aiDesc: "will be added as a schedule",
aiPromptLang: "English",
sttLang: "en-US",
ttsLang: "en-US",
voiceHintText: "en",
backMsg: "Back to calendar.",
noPlanMsg: "No schedule for this day.",
todayNoPlanMsg: "No schedule for today."
},
vi: {
calendar: "Lịch Công Việc",
today: "Hôm nay",
openRecord: "Mở",
noPlan: "Trống",
add: "Thêm",
backToCalendar: "Quay lại lịch",
createAI: "Tạo bằng AI",
editJobName: "Sửa tên công việc",
location: "Vị trí",
memo: "Ghi chú",
viewCount: "Lượt xem",
noLocationMemo: "Chưa có vị trí hoặc ghi chú",
readAll: "Đọc trang này",
processMgmt: "Lộ trình",
processDetail: "Chi tiết",
edit: "Sửa",
cancel: "Hủy",
save: "Lưu",
recordFlow: "Ghi lại quy trình",
aiGenerateBtn: "Tạo tự động",
swipeToView: "Vuốt ngang để xem",
relation: "Mối quan hệ",
tapToViewInsight: "Nhấn để xem phân tích",
close: "Đóng",
purpose: "Mục đích",
prevents: "Phòng ngừa",
insight: "Bí quyết",
tapToViewDetails: "Nhấn để xem chi tiết",
points: "Điểm chính",
risk: "Rủi ro an toàn",
riskMgmt: "Quản lý rủi ro",
aiGenerating: "Đang tạo chuyên môn...",
createThisJob: "Tạo công việc này",
addJobHint: "VD: Lắp điều hòa (Bắt buộc)",
locationHint: "Vị trí (Tùy chọn)",
memoHint: "Ghi chú (Tùy chọn)",
voiceHint: "Nói 'Quay lại' hoặc 'Mở ngày 15'",
reading: "Đang đọc...",
aiTitle: "Tạo tự động bằng AI",
aiDesc: "sẽ được thêm vào lịch",
aiPromptLang: "Vietnamese",
sttLang: "vi-VN",
ttsLang: "vi-VN",
voiceHintText: "vi",
backMsg: "Đã quay lại lịch.",
noPlanMsg: "Không có lịch cho ngày này.",
todayNoPlanMsg: "Không có lịch cho hôm nay."
}
};

export default function App() {
const [lang, setLang] = useState('ja');
const t = (key) => i18n[lang][key] || i18n['ja'][key];

const today = new Date();
const formatDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,
'0')}-${String(date.getDate()).padStart(2, '0')}`;

const timeline = Array.from({ length: 15 }, (_, i) => {
const d = new Date(today);
d.setDate(d.getDate() + (i - 7));
return d;
});

const [jobs, setJobs] = useState(() => {
const init = {};
timeline.forEach(date => {
const key = formatDateKey(date);
init[key] = [];
});
return init;
});

const [selectedDateObj, setSelectedDateObj] = useState(null);
const [activeTab, setActiveTab] = useState('process');
const [expandedProcess, setExpandedProcess] = useState(null);
const [expandedRelation, setExpandedRelation] = useState(null);
const [activeJobId, setActiveJobId] = useState(null);

const [isEditing, setIsEditing] = useState(false);
const [editData, setEditData] = useState(null);

const [showNewJobForm, setShowNewJobForm] = useState(false);
const [targetDateForNewJob, setTargetDateForNewJob] = useState(null);
const [newJobTitle, setNewJobTitle] = useState("");
const [newJobLocation, setNewJobLocation] = useState("");
const [newJobMemo, setNewJobMemo] = useState("");
const [isGenerating, setIsGenerating] = useState(false);
const [errorMsg, setErrorMsg] = useState(null);

const selectedKey = selectedDateObj ? formatDateKey(selectedDateObj) : null;
const currentJob = selectedKey && activeJobId ? jobs[selectedKey]?.find(j => j.id === activeJobId) : null;

const displayTitle = (job) => job?.translations?.[lang]?.title || job?.title || "";
const displayRelationData = (job) => job?.translations?.[lang]?.relationData || job?.relationData || [];
const displayProcesses = (job) => job?.translations?.[lang]?.processes || job?.processes || [];

const [isListening, setIsListening] = useState(false);
const [isSpeaking, setIsSpeaking] = useState(false);
const [isFullscreen, setIsFullscreen] = useState(false);
const [isFullscreenEnabled, setIsFullscreenEnabled] = useState(true);
const [fsErrorMsg, setFsErrorMsg] = useState(false);
const recognitionRef = useRef(null);

useEffect(() => {
setIsFullscreenEnabled(document.fullscreenEnabled ?? true);

const handleFullscreenChange = () => {
setIsFullscreen(!!document.fullscreenElement);
};
document.addEventListener('fullscreenchange', handleFullscreenChange);
return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
}, []);

const toggleFullscreen = () => {
if (!document.fullscreenElement) {
const promise = document.documentElement.requestFullscreen();
if (promise) {
promise.catch(err => {
console.warn(`Fullscreen API error: ${err.message}`);
setFsErrorMsg(true);
setTimeout(() => setFsErrorMsg(false), 4000);
});
}
} else {
if (document.exitFullscreen) {
document.exitFullscreen();
}
}
};

const incrementViewCount = (dateKey, jobId) => {
setJobs(prev => {
const next = { ...prev };
const dayJobs = next[dateKey] || [];
const jobIndex = dayJobs.findIndex(j => j.id === jobId);
if (jobIndex > -1) {
const job = dayJobs[jobIndex];
const now = new Date();
const timeString = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2,
'0')}:${String(now.getMinutes()).padStart(2, '0')}`;
next[dateKey] = [
...dayJobs.slice(0, jobIndex),
{ ...job, viewCount: (job.viewCount || 0) + 1, lastViewedAt: timeString },
...dayJobs.slice(jobIndex + 1)
];
}
return next;
});
};

const handleSelectDate = (date, jobId = null) => {
setSelectedDateObj(date);
const key = formatDateKey(date);
let targetJobId = jobId;
if (!targetJobId && jobs[key] && jobs[key].length > 0) targetJobId = jobs[key][0].id;
if (targetJobId) {
setActiveJobId(targetJobId);
incrementViewCount(key, targetJobId);
} else {
setActiveJobId(null);
}
setActiveTab('process');
setExpandedProcess(null);
setExpandedRelation(null);
setIsEditing(false);
setEditData(null);
};

const handleEditStart = () => { setEditData(JSON.parse(JSON.stringify(currentJob))); setIsEditing(true); };
const handleEditCancel = () => { setIsEditing(false); setEditData(null); };

const handleEditSave = () => {
const currentTitle = displayTitle(editData).trim();
const targetKey = formatDateKey(selectedDateObj);

if (!currentTitle) {
// 作業名が空になった場合はカレンダーから完全に消去する
setJobs(prev => {
const next = { ...prev };
next[targetKey] = next[targetKey].filter(j => j.id !== currentJob.id);
return next;
});
setSelectedDateObj(null);
setActiveJobId(null);
stopSpeaking();
setIsEditing(false);
return;
}

setJobs(prev => {
const next = { ...prev };
next[targetKey] = next[targetKey].map(j => j.id === currentJob.id ? editData : j);
return next;
});
setIsEditing(false);
};

const handleDeleteJob = (jobId) => {
if (window.confirm(lang === 'ja' ? "この作業を削除しますか？" : "Are you sure you want to delete this job?")) {
const targetKey = formatDateKey(selectedDateObj);
setJobs(prev => {
const next = { ...prev };
next[targetKey] = next[targetKey].filter(j => j.id !== jobId);
return next;
});
setSelectedDateObj(null);
setActiveJobId(null);
stopSpeaking();
}
};

const handleTitleChange = (value) => {
if (!editData) return;
// 基本タイトルと現在の言語のタイトル両方を同期して更新
const updated = { ...editData, title: value };
if (updated.translations) {
updated.translations = { ...updated.translations };
if (updated.translations[lang]) {
updated.translations[lang] = {
...updated.translations[lang],
title: value
};
}
}
setEditData(updated);
};

const handleRelationChange = (idx, field, value) => {
if (!editData) return;
const updated = { ...editData };

// 基本の relationData も同期して更新
if (updated.relationData) {
const newData = [...updated.relationData];
newData[idx] = { ...newData[idx], [field]: value };
updated.relationData = newData;
}

// 翻訳がある場合は翻訳の relationData も同期
if (updated.translations && updated.translations[lang]) {
updated.translations = { ...updated.translations };
const newTransData = [...updated.translations[lang].relationData];
newTransData[idx] = { ...newTransData[idx], [field]: value };
updated.translations[lang] = {
...updated.translations[lang],
relationData: newTransData
};
}

setEditData(updated);
};

const handleProcessChange = (idx, field, value) => {
if (!editData) return;
const updated = { ...editData };

// 基本の processes も同期して更新
if (updated.processes) {
const newData = [...updated.processes];
newData[idx] = { ...newData[idx], [field]: value };
updated.processes = newData;
}

// 翻訳がある場合は翻訳の processes も同期
if (updated.translations && updated.translations[lang]) {
updated.translations = { ...updated.translations };
const newTransData = [...updated.translations[lang].processes];
newTransData[idx] = { ...newTransData[idx], [field]: value };
updated.translations[lang] = {
...updated.translations[lang],
processes: newTransData
};
}

setEditData(updated);
};

const speak = useCallback((text) => {
if ('speechSynthesis' in window) {
window.speechSynthesis.cancel();
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = t('ttsLang');

utterance.rate = 0.95;
utterance.pitch = 1.0;

const voices = window.speechSynthesis.getVoices();
const targetVoices = voices.filter(v => v.lang.startsWith(t('voiceHintText')));

if (targetVoices.length > 0) {
let selectedVoice = targetVoices.find(v => v.name.includes('Premium') || v.name.includes('Enhanced'));
if (!selectedVoice) {
selectedVoice = targetVoices.find(v =>
v.name.includes('Google') || v.name.includes('Kyoko') || v.name.includes('Otoya') ||
v.name.includes('Samantha') || v.name.includes('Linh')
);
}
if (!selectedVoice) selectedVoice = targetVoices[0];
utterance.voice = selectedVoice;
}

utterance.onstart = () => setIsSpeaking(true);
utterance.onend = () => setIsSpeaking(false);
utterance.onerror = () => setIsSpeaking(false);
window.speechSynthesis.speak(utterance);
}
}, [lang, t]);

const stopSpeaking = useCallback(() => {
if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
}, []);

const speakAll = useCallback((job, tab) => {
const data = job.translations ? job.translations[lang] : job;
const title = data.title || job.title;
const relations = data.relationData || job.relationData || [];
const procs = data.processes || job.processes || [];

let text = "";
if (lang === 'ja') {
text = `${title}の`;
if (tab === 'process') {
text += "工程管理ロードマップです。";
relations.forEach((rel, i) => { text += `関係性${i +
1}。${rel.source}から、${rel.target}へ。目的は、${rel.focus}。防げる事態は、${rel.prevents}。${rel.details ? `考察として、${rel.details}。` :
''}`; });
} else {
text += "工程詳細です。";
procs.forEach((proc) => { text += `工程${proc.num}、${proc.title}。目的、${proc.purpose}。ポイント、${proc.points.replace(/\n/g,
'。')}。リスク、${proc.risk}。対策、${proc.riskMgmt.replace(/\n/g, '。')}。`; });
}
} else {
if (tab === 'process') {
relations.forEach((rel, i) => { text += `Step ${i + 1}. From ${rel.source} to ${rel.target}. ${rel.focus}.
${rel.prevents}. ${rel.details || ''}. `; });
} else {
procs.forEach((proc) => { text += `Number ${proc.num}. ${proc.title}. ${proc.purpose}. ${proc.points}. ${proc.risk}.
${proc.riskMgmt}. `; });
}
}
speak(text);
}, [lang, speak]);

const speakRelation = (r, idx) => {
let text = lang === 'ja'
? `関係性${idx + 1}。${r.source}から${r.target}へ。目的、${r.focus}。防げる事態、${r.prevents}。${r.details ? `考察、${r.details}。` : ''}`
: `Step ${idx + 1}. From ${r.source} to ${r.target}. ${r.focus}. ${r.prevents}. ${r.details || ''}.`;
speak(text);
};

const speakProcess = (p) => {
const text = lang === 'ja'
? `工程${p.num}、${p.title}。目的、${p.purpose}。ポイント、${p.points.replace(/\n/g,
'。')}。リスク、${p.risk}。対策、${p.riskMgmt.replace(/\n/g, '。')}。`
: `Number ${p.num}. ${p.title}. ${p.purpose}. ${p.points}. ${p.risk}. ${p.riskMgmt}.`;
speak(text);
};

const handleVoiceCommand = useCallback((command) => {
const cmd = command.toLowerCase();

if (/(止め|とめ|ストップ|停止|やめ|うるさい|だまれ|stop|quiet|ngừng|dừng|tắt)/i.test(cmd)) {
stopSpeaking();
return;
}
if (/(戻|もど|カレンダー|ホーム|最初|一覧|back|home|lịch|quay lại)/i.test(cmd)) {
setSelectedDateObj(null);
stopSpeaking();
speak(t('backMsg'));
return;
}

const normalizedCommand = cmd.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));

if (/(今日|きょう|today|hôm nay)/i.test(normalizedCommand) && !selectedDateObj) {
const targetDate = timeline.find(d => d.getDate() === today.getDate() && d.getMonth() === today.getMonth());
if (targetDate) {
handleSelectDate(targetDate);
const key = formatDateKey(targetDate);
if (jobs[key] && jobs[key].length > 0) speakAll(jobs[key][0], 'process');
else speak(t('todayNoPlanMsg'));
return;
}
}

const dayMatch = normalizedCommand.match(/(\d+)/);
if (dayMatch && !selectedDateObj) {
const day = parseInt(dayMatch[1], 10);
const targetDate = timeline.find(d => d.getDate() === day);
if (targetDate) {
handleSelectDate(targetDate);
const key = formatDateKey(targetDate);
if (jobs[key] && jobs[key].length > 0) speakAll(jobs[key][0], 'process');
else speak(lang === 'ja' ? `${day}日の予定はありません。` : t('noPlanMsg'));
return;
}
}

if (/(管理|ロードマップ|全体|流れ|プロセス|roadmap|process|lộ trình|quản lý)/i.test(cmd)) {
setActiveTab('process');
if (currentJob) speakAll(currentJob, 'process');
return;
}
if (/(詳細|詳しく|中身|具体|detail|chi tiết)/i.test(cmd)) {
setActiveTab('extra');
if (currentJob) speakAll(currentJob, 'extra');
return;
}

if (/(読ん|教え|聞かせ|しゃべ|read|speak|đọc|nói)/i.test(cmd)) {
if (currentJob) speakAll(currentJob, activeTab);
}
}, [selectedDateObj, timeline, currentJob, activeTab, jobs, speak, speakAll, stopSpeaking, today, t, lang]);

useEffect(() => {
if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
recognitionRef.current = new SpeechRecognition();
recognitionRef.current.lang = t('sttLang');
recognitionRef.current.continuous = false;
recognitionRef.current.interimResults = false;
recognitionRef.current.onend = () => setIsListening(false);
recognitionRef.current.onerror = () => setIsListening(false);
}
}, [lang, t]);

useEffect(() => {
if (recognitionRef.current) {
recognitionRef.current.onresult = (event) => {
const transcript = event.results[0][0].transcript;
handleVoiceCommand(transcript);
};
}
}, [handleVoiceCommand]);

const toggleListening = () => {
if (!recognitionRef.current) {
alert("お使いのブラウザは音声操作に対応していません。");
return;
}
if (isListening) recognitionRef.current.stop();
else {
try { recognitionRef.current.start(); setIsListening(true); }
catch (e) { console.error(e); }
}
};

// タイトルからAIデータを生成する共通関数
const generateData = async (title) => {
  const apiKey = "";
  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      translations: {
        ja: {
          title: title,
          relationData: [
            { id: "r1", source: "事前準備・現場養生", target: "本体の設置・固定", focus: "作業環境の安全確保と、設置位置の寸法ズレ防止", prevents: "周囲の破損や、据付不良による手戻り", details: "施工前の墨出しと搬入経路の確保を確実行うことが熟練のポイントです。" },
            { id: "r2", source: "本体の設置・固定", target: "配管・配線の接続", focus: "強固な固定を行い、振動による弛みを防ぐ", prevents: "稼働時の異音発生や、配管接続部への余計な負荷集中", details: "アンカーボルトの規定トルクでの締め付けトルク管理を徹底してください。" },
            { id: "r3", source: "配管・配線の接続", target: "試運転・自主検査", focus: "気密試験や結線状態の確認を行い、品質を保証する", prevents: "ガス漏れ、水漏れ、短絡（ショート）などの重大な事故", details: "自主検査のチェックシートを用いてダブルチェックを実施してください。" }
          ],
          processes: [
            { num: 1, title: "現場養生と機材の搬入", purpose: "周囲の床や壁を傷つけないよう保護し、円滑な作業を行うため。", points: "確実な養生シート敷き", risk: "荷崩れによる怪我", riskMgmt: "ヘルメットの完全着用" },
            { num: 2, title: "本体機器の据付工事", purpose: "機器を正確な設計位置に据え付け、将来的な不具合を防ぐため。", points: "水平器による平行調整", risk: "重量物の足元落下", riskMgmt: "安全靴の着用と声掛け" },
            { num: 3, title: "配管・電気配線接続", purpose: "冷媒ガスや電気の確実な供給ラインを構築し、リークを防ぐため。", points: "規定トルクでの締付", risk: "ガスの微小リーク", riskMgmt: "漏れ検知スプレー使用" },
            { num: 4, title: "試運転調整と最終確認", purpose: "初期不具合がないか、設計通りの性能が出ているかを測定確認するため。", points: "運転電流と温度の計測", risk: "稼働部への巻き込み", riskMgmt: "運転中の回転部注意" }
          ]
        },
        en: {
          title: title,
          relationData: [
            { id: "r1", source: "Site Tarping", target: "Unit Mounting", focus: "Ensure environment protection and avoid size deviation", prevents: "Damaging walls and rework of installation", details: "Double-check measurements before securing the anchor bolts." },
            { id: "r2", source: "Unit Mounting", target: "Piping & Wiring", focus: "Solid fixation to prevent loosening by vibration", prevents: "Abnormal noise and fatigue on pipe connections", details: "Use torque wrench for precise fastening." }
          ],
          processes: [
            { num: 1, title: "Preparation & Safety Setup", purpose: "To protect the site and secure a safe working environment.", points: "Check safety gear", risk: "Falling hazards", riskMgmt: "Use safety harness" },
            { num: 2, title: "Mounting the Unit", purpose: "To secure the main unit firmly at the designated location.", points: "Horizontal alignment", risk: "Heavy object drops", riskMgmt: "Safety boots required" },
            { num: 3, title: "Piping & Connection", purpose: "To connect refrigerant lines and electric wiring without leaks.", points: "Torque control", risk: "Gas leakage", riskMgmt: "Soap bubble check" }
          ]
        },
        vi: {
          title: title,
          relationData: [
            { id: "r1", source: "Chuẩn bị hiện trường", target: "Lắp đặt thiết bị", focus: "Đảm bảo môi trường an toàn và chính xác vị trí", prevents: "Trầy xước tường và làm lại do lắp sai lệch", details: "Kiểm tra kỹ kích thước trước khi cố định máy." }
          ],
          processes: [
            { num: 1, title: "Chuẩn bị & An toàn", purpose: "Che chắn hiện trường và chuẩn bị khu vực làm việc an toàn.", points: "Trải bạt cẩn thận", risk: "Rơi đồ vật", riskMgmt: "Đội mũ bảo hộ" },
            { num: 2, title: "Lắp đặt thiết bị", purpose: "Cố định thiết bị chính xác tại vị trí thiết kế.", points: "Đo độ cân bằng", risk: "Thiết bị nặng rơi", riskMgmt: "Đi giày bảo hộ" }
          ]
        }
      }
    };
  } else {
    // 本物のGemini API呼び出し
    const systemPrompt = `System prompt for DODAI application...`;
    const userQuery = `Task: ${title}\nPlease output the roadmap and details.`;
    const baseSchema = {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        relationData: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "STRING" }, source: { type: "STRING" }, target: { type: "STRING" }, focus: { type: "STRING" }, prevents: { type: "STRING" }, details: { type: "STRING" } } } },
        processes: { type: "ARRAY", items: { type: "OBJECT", properties: { num: { type: "INTEGER" }, title: { type: "STRING" }, purpose: { type: "STRING" }, points: { type: "STRING" }, risk: { type: "STRING" }, riskMgmt: { type: "STRING" } } } }
      }
    };
    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { responseMimeType: "application/json", responseSchema: { type: "OBJECT", properties: { translations: { type: "OBJECT", properties: { ja: baseSchema, en: baseSchema, vi: baseSchema } } } } }
    };
    let response = null; let retries = 5; let delay = 1000;
    while (retries > 0) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("API error");
        response = await res.json();
        break;
      } catch (e) { retries--; if (retries === 0) throw e; await new Promise(r => setTimeout(r, delay)); delay *= 2; }
    }
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(text);
  }
};

const generateJobWithAI = async () => {
if (!newJobTitle.trim() || !targetDateForNewJob) return;
setIsGenerating(true);
setErrorMsg(null);

try {
const apiKey = "";
let data = null;

if (!apiKey) {
// APIキーが無い場合のモックデータ処理
await new Promise(resolve => setTimeout(resolve, 1500));
data = {
  translations: {
    ja: {
      title: newJobTitle,
      relationData: [
        { id: "r1", source: "事前準備・現場養生", target: "本体の設置・固定", focus: "作業環境の安全確保と、設置位置の寸法ズレ防止", prevents: "周囲の破損や、据付不良による手戻り", details: "施工前の墨出しと搬入経路の確保を確実行うことが熟練のポイントです。" },
        { id: "r2", source: "本体の設置・固定", target: "配管・配線の接続", focus: "強固な固定を行い、振動による弛みを防ぐ", prevents: "稼働時の異音発生や、配管接続部への余計な負荷集中", details: "アンカーボルトの規定トルクでの締め付けトルク管理を徹底してください。" },
        { id: "r3", source: "配管・配線の接続", target: "試運転・自主検査", focus: "気密試験や結線状態の確認を行い、品質を保証する", prevents: "ガス漏れ、水漏れ、短絡（ショート）などの重大な事故", details: "自主検査のチェックシートを用いてダブルチェックを実施してください。" }
      ],
      processes: [
        { num: 1, title: "現場養生と機材の搬入", purpose: "周囲の床や壁を傷つけないよう保護し、円滑な作業を行うため。", points: "確実な養生シート敷き", risk: "荷崩れによる怪我", riskMgmt: "ヘルメットの完全着用" },
        { num: 2, title: "本体機器の据付工事", purpose: "機器を正確な設計位置に据え付け、将来的な不具合を防ぐため。", points: "水平器による平行調整", risk: "重量物の足元落下", riskMgmt: "安全靴の着用と声掛け" },
        { num: 3, title: "配管・電気配線接続", purpose: "冷媒ガスや電気の確実な供給ラインを構築し、リークを防ぐため。", points: "規定トルクでの締付", risk: "ガスの微小リーク", riskMgmt: "漏れ検知スプレー使用" },
        { num: 4, title: "試運転調整と最終確認", purpose: "初期不具合がないか、設計通りの性能が出ているかを測定確認するため。", points: "運転電流と温度の計測", risk: "稼働部への巻き込み", riskMgmt: "運転中の回転部注意" }
      ]
    },
    en: {
      title: newJobTitle,
      relationData: [
        { id: "r1", source: "Site Tarping", target: "Unit Mounting", focus: "Ensure environment protection and avoid size deviation", prevents: "Damaging walls and rework of installation", details: "Double-check measurements before securing the anchor bolts." },
        { id: "r2", source: "Unit Mounting", target: "Piping & Wiring", focus: "Solid fixation to prevent loosening by vibration", prevents: "Abnormal noise and fatigue on pipe connections", details: "Use torque wrench for precise fastening." }
      ],
      processes: [
        { num: 1, title: "Preparation & Safety Setup", purpose: "To protect the site and secure a safe working environment.", points: "Check safety gear", risk: "Falling hazards", riskMgmt: "Use safety harness" },
        { num: 2, title: "Mounting the Unit", purpose: "To secure the main unit firmly at the designated location.", points: "Horizontal alignment", risk: "Heavy object drops", riskMgmt: "Safety boots required" },
        { num: 3, title: "Piping & Connection", purpose: "To connect refrigerant lines and electric wiring without leaks.", points: "Torque control", risk: "Gas leakage", riskMgmt: "Soap bubble check" }
      ]
    },
    vi: {
      title: newJobTitle,
      relationData: [
        { id: "r1", source: "Chuẩn bị hiện trường", target: "Lắp đặt thiết bị", focus: "Đảm bảo môi trường an toàn và chính xác vị trí", prevents: "Trầy xước tường và làm lại do lắp sai lệch", details: "Kiểm tra kỹ kích thước trước khi cố định máy." }
      ],
      processes: [
        { num: 1, title: "Chuẩn bị & An toàn", purpose: "Che chắn hiện trường và chuẩn bị khu vực làm việc an toàn.", points: "Trải bạt cẩn thận", risk: "Rơi đồ vật", riskMgmt: "Đội mũ bảo hộ" },
        { num: 2, title: "Lắp đặt thiết bị", purpose: "Cố định thiết bị chính xác tại vị trí thiết kế.", points: "Đo độ cân bằng", risk: "Thiết bị nặng rơi", riskMgmt: "Đi giày bảo hộ" }
      ]
    }
  }
};
} else {
// 本物の Gemini API 連携ロジックを完全復元
const systemPrompt = `System prompt for DODAI application...`;
const userQuery = `Task: ${newJobTitle}\nPlease output the roadmap and details.`;
const baseSchema = {
type: "OBJECT",
properties: {
title: { type: "STRING" },
relationData: {
type: "ARRAY",
items: {
type: "OBJECT",
properties: {
id: { type: "STRING" },
source: { type: "STRING" },
target: { type: "STRING" },
focus: { type: "STRING" },
prevents: { type: "STRING" },
details: { type: "STRING" }
}
}
},
processes: {
type: "ARRAY",
items: {
type: "OBJECT",
properties: {
num: { type: "INTEGER" },
title: { type: "STRING" },
purpose: { type: "STRING" },
points: { type: "STRING" },
risk: { type: "STRING" },
riskMgmt: { type: "STRING" }
}
}
}
}
};

const payload = {
contents: [{ parts: [{ text: userQuery }] }],
systemInstruction: { parts: [{ text: systemPrompt }] },
generationConfig: {
responseMimeType: "application/json",
responseSchema: {
type: "OBJECT",
properties: {
translations: {
type: "OBJECT",
properties: {
ja: baseSchema,
en: baseSchema,
vi: baseSchema
}
}
}
}
}
};

let response = null;
let retries = 5;
let delay = 1000;

while (retries > 0) {
try {
const res = await
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
{
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});
if (!res.ok) throw new Error("API error");
response = await res.json();
break;
} catch (e) {
retries--;
if (retries === 0) throw e;
await new Promise(r => setTimeout(r, delay));
delay *= 2;
}
}

const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
const responseData = JSON.parse(text);
data = responseData;
}

const newJobId = `job_${Date.now()}`;
const newJob = {
id: newJobId,
title: newJobTitle,
location: newJobLocation,
memo: newJobMemo,
type: 'dynamic',
translations: data.translations,
viewCount: 0,
lastViewedAt: null
};

// 基本のタイトル・データも同期して初期設定
newJob.relationData = displayRelationData(newJob);
newJob.processes = displayProcesses(newJob);

const targetKey = formatDateKey(targetDateForNewJob);
setJobs(prev => {
const next = { ...prev };
if (!next[targetKey]) next[targetKey] = [];
next[targetKey] = [...next[targetKey], newJob];
return next;
});

handleSelectDate(targetDateForNewJob, newJobId);
setNewJobTitle(""); setNewJobLocation(""); setNewJobMemo("");
setShowNewJobForm(false); setTargetDateForNewJob(null);

} catch (error) {
console.error(error);
setErrorMsg(error.message || "Error");
} finally {
setIsGenerating(false);
}
};

const colors = ["bg-rose-500", "bg-orange-500", "bg-amber-500", "bg-emerald-500", "bg-sky-500", "bg-violet-500"];

const renderRelationFlow = (data, title) => (
<div className="w-full py-4 relative z-0">
    <style>
        {
            `.safe-scrollbar-hide::-webkit-scrollbar {
                display: none;
            }

            .safe-scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }

            `
        }
    </style>

    <div
        className="bg-indigo-50 text-indigo-800 font-black px-6 py-4 md:px-8 md:py-5 rounded-3xl mb-6 text-center border-2 border-indigo-100 shadow-sm w-full max-w-3xl mx-auto">
        {title}
        <span className="text-xs md:text-sm font-bold text-indigo-500 mt-1 md:mt-2 block opacity-90">
            {t('swipeToView')}
        </span>
    </div>

    <div
        className="flex overflow-x-auto pb-8 snap-x snap-mandatory gap-4 px-4 sm:px-8 safe-scrollbar-hide relative z-10 items-start">
        {data?.map((item, index) => {
        const isExpanded = expandedRelation === index;
        return (
        <div key={item.id || index}
            className="w-[85vw] sm:w-[340px] shrink-0 snap-center bg-white border-2 border-gray-200 hover:border-indigo-300 rounded-3xl shadow-sm flex flex-col overflow-hidden transition-all duration-300 h-auto">
            <div className={`bg-indigo-600 text-white px-4 flex flex-col items-center justify-center gap-3
                transition-colors ${!isEditing ? 'cursor-pointer hover:bg-indigo-700 py-5' : 'py-6' }`} onClick={()=> {
                if(!isEditing) setExpandedRelation(isExpanded ? null : index); }}
                >
                <span
                    className="text-indigo-200 text-[10px] font-black tracking-widest bg-indigo-800/50 px-3 py-1 rounded-full">
                    {t('relation')} {index + 1}
                </span>
                <div className="flex items-center gap-2 w-full justify-center">
                    {isEditing ? (
                    <input
                        className="text-xs font-bold text-slate-800 bg-white/90 w-full px-2 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 text-center"
                        value={item.source} onChange={e=> handleRelationChange(index, 'source', e.target.value)}
                    onClick={e => e.stopPropagation()} />
                    ) : (
                    <span
                        className="font-bold text-xs sm:text-sm bg-indigo-800 px-2 py-2 rounded-xl shadow-inner border border-indigo-500 text-center flex-1 flex items-center justify-center h-full">
                        {item.source}
                    </span>
                    )}
                    <ArrowRight className="w-5 h-5 text-indigo-200 shrink-0" strokeWidth={3} />
                    {isEditing ? (
                    <input
                        className="text-xs font-bold text-slate-800 bg-white/90 w-full px-2 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 text-center"
                        value={item.target} onChange={e=> handleRelationChange(index, 'target', e.target.value)}
                    onClick={e => e.stopPropagation()} />
                    ) : (
                    <span
                        className="font-bold text-xs sm:text-sm bg-emerald-500 px-2 py-2 rounded-xl shadow-inner border border-emerald-400 text-center flex-1 flex items-center justify-center h-full">
                        {item.target}
                    </span>
                    )}
                </div>
                {!isEditing && (
                <div className="mt-1 flex items-center gap-2">
                    <div
                        className="text-indigo-200/90 text-[10px] font-bold flex items-center gap-1 bg-indigo-800/40 px-3 py-1 rounded-full">
                        {isExpanded ? <>
                            <ChevronUp className="w-3.5 h-3.5" /> {t('close')}
                        </> : <>
                            <ChevronDown className="w-3.5 h-3.5" /> {t('tapToViewInsight')}
                        </>}
                    </div>
                    <button onClick={(e)=> { e.stopPropagation(); speakRelation(item, index); }}
                        className="bg-indigo-800/40 p-1.5 rounded-full text-indigo-200 hover:text-white
                        hover:bg-indigo-500 transition-all">
                        <Volume2 className="w-3.5 h-3.5" />
                    </button>
                </div>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col bg-white gap-4">
                <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 p-2 rounded-full shrink-0 mt-0.5">
                        <Target className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <span className="text-xs font-black text-indigo-400 block mb-1">【{t('purpose')}】</span>
                        {isEditing ? (
                        <textarea
                            className="w-full p-2 text-xs font-bold text-slate-800 rounded-lg border-2 border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            rows={2} value={item.focus} onChange={e=> handleRelationChange(index, 'focus', e.target.value)} />
                  ) : <p className="text-gray-800 text-sm leading-snug font-bold">{item.focus}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-50 p-2 rounded-full shrink-0 mt-0.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /></div>
                <div className="flex-1">
                  <span className="text-xs font-black text-emerald-500 block mb-1">【{t('prevents')}】</span>
                  {isEditing ? (
                    <textarea className="w-full p-2 text-xs font-bold text-slate-800 rounded-lg border-2 border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400" rows={2} value={item.prevents} onChange={e => handleRelationChange(index, 'prevents', e.target.value)} />
                  ) : <p className="text-gray-800 text-sm leading-snug font-bold">{item.prevents}</p>}
                </div>
              </div>
            </div>

            {(isExpanded || isEditing) && (
              <div className="px-5 pb-5 bg-white border-t border-dashed border-gray-100 pt-4">
                {isEditing ? (
                  <>
                    <div className="flex items-center gap-2 mb-2"><span className="w-1.5 h-4 bg-sky-500 rounded-full"></span><h3 className="text-xs font-black text-sky-900 uppercase tracking-wider">{t('insight')}</h3></div>
                    <textarea className="w-full p-2 text-xs font-bold text-slate-800 rounded-lg border-2 border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400" rows={3} value={item.details || ""} onChange={e => handleRelationChange(index, 'details', e.target.value)} />
                  </>
                ) : (
                  <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-100/50">
                    <span className="text-xs font-black text-sky-600 block mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> 【{t('insight')}】</span>
                    {item.details ? <p className="text-sm text-gray-700 leading-snug whitespace-pre-wrap font-bold">{item.details}</p> : <p className="text-xs text-gray-400 italic flex items-center gap-1.5 font-bold"><Edit2 className="w-3.5 h-3.5" /></p>}
                  </div>
                )}
              </div>
            )}
          </div>
        )})}
      </div>
    </div>
  );

  const renderProcesses = (processes) => (
    <div className="py-4 space-y-4">
      {processes?.map((process, idx) => {
        const isExpanded = expandedProcess === process.num;
        return (
          <div key={process.num || idx} className="flex items-start gap-4 relative z-0">
            <div className={`${colors[idx % colors.length]} w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shrink-0 sticky top-8 z-10 transition-transform`}>
              {process.num}
            </div>
            <div className="flex-1 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-indigo-200 hover:shadow-md transition-all overflow-hidden relative z-0">
              <div 
                className={`p-4 flex flex-col bg-white transition-colors ${!isEditing ? 'cursor-pointer group hover:bg-gray-50/50' : ''}`}
                onClick={() => { if(!isEditing) setExpandedProcess(isExpanded ? null : process.num); }}
              >
                <div className="flex justify-between items-center w-full">
                  {isEditing ? (
                    <input className="flex-1 mr-4 px-3 py-1.5 border-2 border-indigo-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={process.title} onChange={e => handleProcessChange(idx, 'title', e.target.value)} onClick={e => e.stopPropagation()} />
                  ) : <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{process.title}</h2>}
                  
                  <div className={`flex items-center gap-1 p-1 rounded-full transition-colors ${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`} onClick={(e) => { e.stopPropagation(); if(!isEditing) setExpandedProcess(isExpanded ? null : process.num); }}>
                    {!isEditing && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); speakProcess(process); }} className="p-1.5 rounded-full hover:bg-indigo-200 hover:text-indigo-700 transition-colors">
                           <Volume2 className="w-4 h-4" />
                        </button>
                        <div className="p-1">{isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
                      </>
                    )}
                  </div>
                </div>

                {!isExpanded && !isEditing && (
                  <div className="mt-3 text-indigo-600/80 text-[11px] font-bold flex items-center gap-1.5 bg-indigo-50/70 w-fit px-3 py-1.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" /> {t('tapToViewDetails')}
                  </div>
                )}
              </div>
              
              {(isExpanded || isEditing) && (
                <div className="p-6 pt-0 border-t-2 border-gray-50">

                  <div className="space-y-5 mt-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2"><span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span><h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider">{t('purpose')}</h3></div>
                      {isEditing ? <textarea className="w-full p-2 border-2 border-indigo-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" rows={2} value={process.purpose} onChange={e => handleProcessChange(idx, 'purpose', e.target.value)} /> : <p className="text-sm text-gray-700 leading-snug pl-3">{process.purpose}</p>}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2"><span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span><h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider">{t('points')}</h3></div>
                      {isEditing ? <textarea className="w-full p-2 border-2 border-emerald-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400" rows={2} value={process.points} onChange={e => handleProcessChange(idx, 'points', e.target.value)} /> : <p className="text-sm text-gray-700 font-bold leading-snug pl-3">{process.points}</p>}
                    </div>
                    <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/50">
                      <div className="flex items-center gap-2 mb-2"><span className="w-1.5 h-4 bg-rose-500 rounded-full"></span><h3 className="text-xs font-black text-rose-900 uppercase tracking-wider">{t('risk')}</h3></div>
                      {isEditing ? <textarea className="w-full mb-4 p-2 border-2 border-rose-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white" rows={2} value={process.risk} onChange={e => handleProcessChange(idx, 'risk', e.target.value)} /> : <p className="text-sm text-gray-700 font-bold leading-snug mb-4 pl-3">{process.risk}</p>}
                      
                      <div className="flex items-center gap-2 mb-2"><span className="w-1.5 h-4 bg-amber-500 rounded-full"></span><h3 className="text-xs font-black text-amber-900 uppercase tracking-wider">{t('riskMgmt')}</h3></div>
                      {isEditing ? <textarea className="w-full p-2 border-2 border-amber-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" rows={2} value={process.riskMgmt} onChange={e => handleProcessChange(idx, 'riskMgmt', e.target.value)} /> : <p className="text-sm text-gray-700 font-bold leading-snug pl-3">{process.riskMgmt}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const currentRelationData = isEditing ? displayRelationData(editData) : displayRelationData(currentJob);
  const currentProcesses = isEditing ? displayProcesses(editData) : displayProcesses(currentJob);
  const currentJobTitle = isEditing ? displayTitle(editData) : displayTitle(currentJob);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      
      {/* 共通ヘッダー：DODAIロゴ */}
      <header className="bg-white border-b-2 border-gray-100 px-4 md:px-6 py-3 md:py-4 shrink-0 flex items-center justify-between relative z-20 shadow-sm">
        {/* 言語選択 */}
        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1.5 rounded-xl border border-gray-200">
          <Globe className="w-4 h-4 text-gray-400" />
          <select 
            value={lang} 
            onChange={e => setLang(e.target.value)}
            className="bg-transparent text-gray-700 font-bold text-xs md:text-sm outline-none cursor-pointer"
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </div>

        <img 
          src="image.png" 
          alt="DODAI Logo" 
          className="h-8 md:h-10 object-contain absolute left-1/2 transform -translate-x-1/2"
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
          }}
        />
        <div style={{ display: 'none' }} className="items-center font-black text-3xl tracking-tighter absolute left-1/2 transform -translate-x-1/2">
          <span className="text-[#3252A2]">DOD</span><span className="text-[#EB7A28]">A</span>
          <Wrench className="w-7 h-7 text-[#EB7A28] ml-0.5 -mt-1 -rotate-12" strokeWidth={2.5} />
        </div>
        
        {/* 右側アクションボタン */}
        <div className="flex items-center gap-2">
          {/* フルスクリーンボタン（許可されている環境のみ表示） */}
          {isFullscreenEnabled && (
            <button 
              onClick={toggleFullscreen}
              className="p-2.5 rounded-full bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm hidden sm:block"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          )}

          {/* 音声認識スタートボタン */}
          <button 
            onClick={toggleListening}
            className={`p-2.5 rounded-full transition-all shadow-sm ${isListening ? 'bg-rose-100 text-rose-600 ring-2 ring-rose-400 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* エラーメッセージ（フルスクリーン非対応時） */}
      {fsErrorMsg && (
        <div className="absolute top-20 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="bg-slate-800/90 text-white text-xs font-bold px-4 py-3 rounded-xl backdrop-blur shadow-lg flex items-center gap-2 text-center leading-snug">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            プレビュー環境の制限により全画面表示できません。<br/>実際のブラウザや端末でお試しください。
          </div>
        </div>
      )}

      {/* 音声コマンドのヒント */}
      {isListening && (
        <div className="absolute top-20 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="bg-slate-800/85 text-white text-xs font-bold px-4 py-2.5 rounded-full backdrop-blur shadow-lg flex items-center gap-2">
             <Mic className="w-3.5 h-3.5 text-rose-400" /> {t('voiceHint')}
          </div>
        </div>
      )}

      {isSpeaking && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-indigo-900/95 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-4 z-50 backdrop-blur-sm">
          <div className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 flex items-center justify-center">
              <Volume2 className="w-2.5 h-2.5 text-white" />
            </span>
          </div>
          <span className="font-bold text-sm tracking-widest">{t('reading')}</span>
          <button onClick={stopSpeaking} className="ml-2 bg-white/20 p-1.5 rounded-full hover:bg-rose-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {showNewJobForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative border-4 border-indigo-100 max-h-[90vh] overflow-y-auto">
            <button onClick={() => { setShowNewJobForm(false); setTargetDateForNewJob(null); setErrorMsg(null); setNewJobTitle(""); setNewJobLocation(""); setNewJobMemo(""); }} className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 font-black text-2xl transition-colors">×</button>
            <h3 className="font-black text-indigo-900 mb-2 flex items-center gap-2 text-lg md:text-xl"><Sparkles className="w-6 h-6 text-indigo-500" /> {t('aiTitle')}</h3>
            <p className="text-gray-500 text-sm font-bold mb-6 flex items-center gap-1.5">
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">{targetDateForNewJob ? `${targetDateForNewJob.getMonth() + 1}/${targetDateForNewJob.getDate()}` : ''}</span>
              {t('aiDesc')}
            </p>
            <div className="flex flex-col gap-4">
               <input type="text" placeholder={t('addJobHint')} className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none shadow-sm font-bold text-gray-800" value={newJobTitle} onChange={e => setNewJobTitle(e.target.value)} disabled={isGenerating} autoFocus />
               <input type="text" placeholder={t('locationHint')} className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none shadow-sm font-bold text-gray-800 text-sm" value={newJobLocation} onChange={e => setNewJobLocation(e.target.value)} disabled={isGenerating} />
               <textarea placeholder={t('memoHint')} className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none shadow-sm font-bold text-gray-800 text-sm min-h-[80px]" value={newJobMemo} onChange={e => setNewJobMemo(e.target.value)} disabled={isGenerating} />
               <button onClick={generateJobWithAI} disabled={isGenerating || !newJobTitle.trim()} className="w-full py-4 bg-indigo-600 text-white text-lg font-black rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                 {isGenerating ? <><Loader2 className="w-6 h-6 animate-spin" /> {t('aiGenerating')}</> : t('createThisJob')}
               </button>
            </div>
            {errorMsg && <p className="mt-4 text-sm font-bold text-rose-600 flex items-center gap-1.5 bg-rose-50 p-3 rounded-lg border border-rose-100"><AlertTriangle className="w-5 h-5 shrink-0" /> {errorMsg}</p>}
          </div>
        </div>
      )}

      {!selectedDateObj ? (
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-8 text-gray-800 text-center">{t('calendar')}</h1>
          <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-10">
            {timeline.map(date => {
              const dateKey = formatDateKey(date);
              const isToday = dateKey === formatDateKey(today);
              const dayJobs = jobs[dateKey] || [];

              return (
                <div key={dateKey} onClick={() => handleSelectDate(date)} className={`p-5 md:p-6 rounded-3xl flex flex-col items-start border-2 transition-all shadow-sm cursor-pointer ${isToday ? 'bg-indigo-50 border-indigo-400 ring-4 ring-indigo-100' : 'bg-white border-gray-100 hover:border-indigo-200'}`}>
                  <div className="flex items-center justify-between w-full mb-4 pointer-events-none">
                    <div className="flex items-center gap-4 md:gap-6">
                      <span className={`text-2xl md:text-3xl font-black tracking-tight ${isToday ? 'text-indigo-900' : 'text-gray-800'}`}>{date.getMonth() + 1}/{date.getDate()}</span>
                      {isToday && <span className="bg-indigo-600 text-white text-xs md:text-sm font-bold px-3 md:px-4 py-1.5 rounded-full shadow-sm">{t('today')}</span>}
                    </div>
                    <span className={`font-bold text-sm md:text-base ${isToday ? 'text-indigo-600' : 'text-gray-400'}`}>{t('openRecord')}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 w-full relative z-10 items-center">
                    {dayJobs.length > 0 ? (
                      dayJobs.map(j => {
                        const jTitle = j.translations?.[lang]?.title || j.title;
                        return (
                          <div key={j.id} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSelectDate(date, j.id); }} className="border px-3 md:px-4 py-3 rounded-xl text-xs md:text-sm font-bold shadow-sm transition-colors cursor-pointer w-full text-left flex flex-col gap-1.5 bg-white border-indigo-200 hover:bg-indigo-50">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full shrink-0 bg-indigo-500"></span>
                              <span className="truncate text-indigo-700">{jTitle}</span>
                            </div>
                            {(j.location || j.memo) && (
                              <div className="pl-4 text-xs font-normal text-gray-500 space-y-1">
                                {j.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0 text-indigo-400" /><span className="truncate font-bold">{j.location}</span></div>}
                                {j.memo && <div className="flex items-start gap-1.5"><FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" /><span className="line-clamp-2">{j.memo}</span></div>}
                              </div>
                            )}
                          </div>
                        )
                      })
                    ) : <div className="text-gray-400 text-xs md:text-sm font-bold px-3 py-2 bg-gray-100 rounded-xl flex items-center h-[38px] pointer-events-none">{t('noPlan')}</div>}
                    <button onClick={(e) => { e.stopPropagation(); setTargetDateForNewJob(date); setShowNewJobForm(true); }} className="border px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-white border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 h-[38px]">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" /> {t('add')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-white relative">
          <button onClick={() => { setSelectedDateObj(null); stopSpeaking(); }} className="flex items-center text-indigo-600 font-bold mb-8 hover:opacity-70 transition-colors">
            <ArrowLeft className="mr-2" /> {t('backToCalendar')}
          </button>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">{selectedDateObj.getMonth()+1}/{selectedDateObj.getDate()}</h1>

            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 safe-scrollbar-hide items-center">
              {(jobs[selectedKey] || []).map(job => (
                <button key={job.id} onClick={() => { if(isEditing || activeJobId === job.id) return; setActiveJobId(job.id); setActiveTab('process'); setExpandedProcess(null); incrementViewCount(selectedKey, job.id); stopSpeaking(); }} className={`px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border-2 ${activeJobId === job.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200'} ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {displayTitle(job)}
                </button>
              ))}
              <button onClick={() => { if(isEditing) return; setTargetDateForNewJob(selectedDateObj); setShowNewJobForm(true); }} className={`px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 flex items-center gap-2 bg-gray-50 hover:bg-indigo-50 shrink-0 ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Sparkles className="w-4 h-4" /> {t('createAI')}
              </button>
            </div>

            {currentJob ? (
              <>
                {isEditing ? (
                  <div className="mb-6 p-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl space-y-4">
                    <div><label className="text-xs font-black text-indigo-600 block mb-2 uppercase tracking-wider">{t('editJobName')}</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-indigo-200 font-bold text-slate-800 focus:outline-none focus:border-indigo-500" value={currentJobTitle} onChange={e => handleTitleChange(e.target.value)} /></div>
                    <div><label className="text-xs font-black text-indigo-600 block mb-2 uppercase tracking-wider">{t('location')}</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-indigo-200 font-bold text-slate-800 text-sm" value={editData?.location || ""} onChange={e => setEditData({...editData, location: e.target.value})} /></div>
                    <div><label className="text-xs font-black text-indigo-600 block mb-2 uppercase tracking-wider">{t('memo')}</label><textarea className="w-full px-4 py-3 rounded-xl border border-indigo-200 font-bold text-slate-800 text-sm min-h-[80px]" value={editData?.memo || ""} onChange={e => setEditData({...editData, memo: e.target.value})} /></div>
                  </div>
                ) : (
                  <div className="mb-6 bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm hover:border-indigo-100 transition-colors">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h2 className="text-xl md:text-2xl font-black text-gray-800">{currentJobTitle}</h2>
                      <div className="flex flex-col items-end gap-1.5 text-[11px] md:text-xs font-bold text-gray-400 shrink-0 mt-1">
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Eye className="w-3.5 h-3.5" /> {t('viewCount')} {currentJob.viewCount || 0}</div>
                        {currentJob.lastViewedAt && <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Clock className="w-3.5 h-3.5" /> {currentJob.lastViewedAt}</div>}
                      </div>
                    </div>
                    {(currentJob.location || currentJob.memo) ? (
                      <div className="space-y-3 pt-3 border-t-2 border-dashed border-gray-100 text-sm font-bold text-gray-600">
                        {currentJob.location && <div className="flex items-start gap-2.5"><MapPin className="w-5 h-5 mt-0.5 text-indigo-400 shrink-0" /><span className="leading-relaxed">{currentJob.location}</span></div>}
                        {currentJob.memo && <div className="flex items-start gap-2.5"><FileText className="w-5 h-5 mt-0.5 text-amber-400 shrink-0" /><span className="whitespace-pre-wrap leading-relaxed">{currentJob.memo}</span></div>}
                      </div>
                    ) : <div className="pt-3 border-t-2 border-dashed border-gray-100 text-sm font-bold text-gray-400 flex items-center gap-2"><FileText className="w-4 h-4" /> {t('noLocationMemo')}</div>}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button onClick={() => speakAll(currentJob, activeTab)} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors w-fit">
                         <Volume2 className="w-4 h-4" /> {t('readAll')}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                  <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                    <button onClick={() => { if(!isEditing) { setActiveTab('process'); stopSpeaking(); } }} className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'process' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'} ${isEditing ? 'cursor-default' : ''}`}>{t('processMgmt')}</button>
                    <button onClick={() => { if(!isEditing) { setActiveTab('extra'); stopSpeaking(); } }} className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'extra' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'} ${isEditing ? 'cursor-default' : ''}`}>{t('processDetail')}</button>
                  </div>
                  {!isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={handleEditStart} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"><Edit2 className="w-4 h-4" /> {t('edit')}</button>
                      <button onClick={() => handleDeleteJob(currentJob.id)} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-rose-200 rounded-xl text-rose-600 font-bold hover:bg-rose-50 hover:text-rose-700 transition-colors shadow-sm">
                        <X className="w-4 h-4" /> {lang === 'ja' ? '削除' : 'Delete'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleEditCancel} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200">{t('cancel')}</button>
                      <button onClick={handleEditSave} disabled={isRegenerating} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-70 transition-opacity">{isRegenerating ? <><Loader2 className="w-4 h-4 animate-spin" />{t('aiGenerating')}</> : <><Save className="w-4 h-4" />{t('save')}</>}</button>
                    </div>
                  )}
                </div>

                {activeTab === 'process' ? renderRelationFlow(currentRelationData, currentJobTitle) : renderProcesses(currentProcesses)}
              </>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
                <p className="text-gray-400 font-bold mb-4">{t('recordFlow')}</p>
                <button onClick={() => { setTargetDateForNewJob(selectedDateObj); setShowNewJobForm(true); }} className="px-6 py-3 bg-white border border-gray-200 text-indigo-600 rounded-xl font-bold shadow-sm hover:border-indigo-300 flex items-center gap-2"><Sparkles className="w-5 h-5"/> {t('aiGenerateBtn')}</button>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
