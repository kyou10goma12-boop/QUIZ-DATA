/* ================================
   設定読み込み
================================ */
const playlist = JSON.parse(localStorage.getItem("playlist"));
const reverse  = localStorage.getItem("reverse") === "1";
const speakOn  = localStorage.getItem("speak") === "1";
const typeOn   = localStorage.getItem("typewriter") === "1";

let qTime = Number(localStorage.getItem("qTime") || 2) * 1000;
let aTime = Number(localStorage.getItem("aTime") || 2) * 1000;

/* ================================
   DOM 取得（スライド側にある要素）
================================ */
const question = document.getElementById("question");
const answer   = document.getElementById("answer");

const qTimeBox = document.getElementById("qTimeBox");
const aTimeBox = document.getElementById("aTimeBox");

if (qTimeBox) qTimeBox.value = qTime / 1000;
if (aTimeBox) aTimeBox.value = aTime / 1000;

/* ================================
   playlist が無い場合（単独モード）
================================ */
let index = -1;
if (playlist) {
  const current = window.location.pathname.split("/").pop();
  index = playlist.findIndex(p => p.endsWith(current));
}

/* ================================
   読み上げ
================================ */
function speak(text) {
  if (!speakOn) return;
  const uttr = new SpeechSynthesisUtterance(text);
  uttr.lang = "en-US";
  speechSynthesis.speak(uttr);
}

/* ================================
   タイプライター
================================ */
function typeWriter(element, text, speed = 100) {
  if (!typeOn) {
    element.textContent = text;
    return;
  }
  element.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

/* ================================
   表裏切り替え
================================ */
if (reverse) {
  answer.style.display = 'block';
  question.style.display = 'none';

  typeWriter(answer, answer.textContent);
  speak(answer.textContent);

  setTimeout(() => {
    question.style.display = 'block';
    typeWriter(question, question.textContent);
    speak(question.textContent);
  }, qTime);

} else {
  answer.style.display = 'none';

  typeWriter(question, question.textContent);
  speak(question.textContent);

  setTimeout(() => {
    answer.style.display = 'block';
    typeWriter(answer, answer.textContent);
  }, qTime);
}

/* ================================
   自動で次へ（playlist がある時だけ）
================================ */
let paused = false;

if (playlist && index >= 0) {
  setTimeout(() => {
    if (!paused) {
      const next = playlist[index + 1];
      if (next) window.location.href = next;
    }
  }, qTime + aTime);
}

/* ================================
   ボタン操作
================================ */
const showAnswerBtn = document.getElementById("showAnswerBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const pauseBtn = document.getElementById("pauseBtn");
const applyTime = document.getElementById("applyTime");

if (showAnswerBtn) {
  showAnswerBtn.onclick = () => {
    answer.style.display = "block";
  };
}

if (nextBtn) {
  nextBtn.onclick = () => {
    if (playlist && index >= 0) {
      const next = playlist[index + 1];
      if (next) window.location.href = next;
    } else {
      alert("index.html から起動してください");
    }
  };
}

if (prevBtn) {
  prevBtn.onclick = () => {
    if (playlist && index >= 0) {
      const prev = playlist[index - 1];
      if (prev) window.location.href = prev;
    } else {
      alert("index.html から起動してください");
    }
  };
}

if (pauseBtn) {
  pauseBtn.onclick = () => {
    paused = !paused;
    pauseBtn.textContent = paused ? "再開" : "一時停止";
  };
}

/* ================================
   時間設定を変更（次の問題から反映）
================================ */
if (applyTime) {
  applyTime.onclick = () => {
    const q = Number(qTimeBox.value);
    const a = Number(aTimeBox.value);

    localStorage.setItem("qTime", q);
    localStorage.setItem("aTime", a);

    alert("次の問題から時間設定が反映されます");
  };
}
