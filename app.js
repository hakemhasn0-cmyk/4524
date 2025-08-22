import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔑 كودك من Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCUb5ySGCLuNwBlCbZx_VuaDfqMtWno1cs",
  authDomain: "tttr-dbde2.firebaseapp.com",
  projectId: "tttr-dbde2",
  storageBucket: "tttr-dbde2.firebasestorage.app",
  messagingSenderId: "296112669273",
  appId: "1:296112669273:web:ae6f583e15705a688be748",
  measurementId: "G-GP1C50C9E9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const donateBtn = document.getElementById("donateBtn");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const phoneInput = document.getElementById("phone");
const messageInput = document.getElementById("message");
const donorsList = document.getElementById("donors");
const totalElem = document.getElementById("total");
const donorsCount = document.getElementById("donorsCount");
const thanksElem = document.getElementById("thanks");
const toast = document.getElementById("toast");
const switchCurrencyBtn = document.getElementById("switchCurrency");
const currencyElem = document.getElementById("currency");

let currency = "TRY"; // افتراضي: الليرة التركية

donateBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim() || "متبرع مجهول";
  const amount = parseFloat(amountInput.value);
  const phone = phoneInput.value.trim();
  const message = messageInput.value.trim();

  if (!amount) { alert("الرجاء إدخال مبلغ التبرع"); return; }

  await addDoc(collection(db, "donations"), { name, amount, phone, message, currency, time: new Date() });

  thanksElem.textContent = `شكراً ${name} على تبرعك!`;
  nameInput.value = "";
  amountInput.value = "";
  phoneInput.value = "";
  messageInput.value = "";
});

onSnapshot(collection(db, "donations"), (snapshot) => {
  donorsList.innerHTML = "";
  let total = 0;
  let count = 0;
  snapshot.forEach(doc => {
    const { name, amount, message } = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `<strong>${name}</strong> — ${amount} ${currency} <br><em>${message}</em>`;
    donorsList.appendChild(li);
    total += amount;
    count++;
    showToast(`تبرع جديد من ${name} بقيمة ${amount} ${currency}`);
  });
  totalElem.textContent = total.toFixed(2);
  donorsCount.textContent = count;
});

// إشعار عند تبرع جديد
function showToast(msg) {
  toast.textContent = msg;
  toast.className = "toast show";
  setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// تبديل العملة
switchCurrencyBtn.addEventListener("click", () => {
  currency = (currency === "TRY") ? "USD" : "TRY";
  currencyElem.textContent = (currency === "TRY") ? "ل.ت" : "$";
});

// مشاركة
function shareWhatsApp() {
  const url = window.location.href;
  window.open(`https://wa.me/?text=شاهد حملة التبرع لقرية الشغور: ${url}`, "_blank");
}
function shareFacebook() {
  const url = window.location.href;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
}
function copyLink() {
  navigator.clipboard.writeText(window.location.href);
  showToast("تم نسخ الرابط ✅");
}
window.shareWhatsApp = shareWhatsApp;
window.shareFacebook = shareFacebook;
window.copyLink = copyLink;