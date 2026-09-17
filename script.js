const KEY="edumanage_data_v1";
const seed={
 students:[
  {id:"STU-001",name:"Gh.Ishaque",gender:"MAale",class:"Grade 8",phone:"0300-1111111",email:"ghishaque@example.com"},
  {id:"STU-002",name:" Nazaqat Ali",gender:"Male",class:"Grade 9",phone:"0301-2222222",email:"alinazaqat575@gmail.com"},
  {id:"STU-003",name:"Shoaib",gender:"Male",class:"Grade 7",phone:"0302-3333333",email:"shoaib@example.com"},
  {id:"STU-004",name:"AShhar Malik",gender:"Male",class:"Grade 10",phone:"0303-4444444",email:"Ashhar@example.com"},
  {id:"STU-005",name:"M.Saleem",gender:"Male",class:"Grade 6",phone:"0304-5555555",email:"saleem@example.com"}
 ],
 teachers:[
  {id:"TCH-001",name:"Mr. Suleman Memon",subject:"Data Minig",class:"Grade 9",phone:"0311-1111111",email:"suleman45@gmail.com"},
  {id:"TCH-002",name:"Ms. Areej Memon",subject:"Cloud Computing",class:"Grade 8",phone:"0312-2222222",email:"areej786@gmail.com"},
  {id:"TCH-003",name:"Ms. kalsoom Panhwar",subject:"Parallel & Distributed Computing",class:"Grade 10",phone:"0313-3333333",email:"kalsoom110@gamil.com"},
  {id:"TCH-004",name:"Ms. jaweria Hussain",subject:"Database",class:"Grade 7",phone:"0314-4444444",email:"hussainjaweria786@gmail,.com"}
 ],
 fees:[
  {receipt:"REC-1001",student:"GH.Ishaque",month:"2026-09",amount:5000,status:"Paid"},
  {receipt:"REC-1002",student:"Nazaqat Ali",month:"2026-09",amount:5000,status:"Paid"},
  {receipt:"REC-1003",student:"Shoaib",month:"2026-09",amount:4500,status:"Pending"}
 ],
 results:[
  {student:"GH.Ishaque",subject:"Cloud Computing",marks:88,total:100},
  {student:"Nazaqat Ali",subject:"Parallel & Distributed Computing",marks:91,total:100},
  {student:"Shoaib",subject:"Database",marks:79,total:100}
 ],
 attendance:{},
 notices:[
  {title:"Parent-Teacher Meeting",message:"Parents are requested to attend the meeting on 18 September 2026 at 10:00 AM.",date:"15 Sep 2026"},
  {title:"Mid-Term Examination",message:"Mid-term examinations will begin from 1 October 2026. Students should prepare according to the published timetable.",date:"12 Sep 2026"},
  {title:"Sports Day",message:"Annual Sports Day will be held on 25 September 2026 at the school ground.",date:"10 Sep 2026"}
 ],
 settings:{schoolName:"MBBS Campus Dadu"}
};
let data=load();
let currentAttendance={};

function load(){try{return JSON.parse(localStorage.getItem(KEY))||structuredClone(seed)}catch(e){return structuredClone(seed)}}
function persist(){localStorage.setItem(KEY,JSON.stringify(data)); updateDashboard()}
function $(id){return document.getElementById(id)}
function escapeHTML(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function showToast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2500)}
function openModal(id){if(id==="feeModal")fillStudentOptions("fStudent");if(id==="resultModal")fillStudentOptions("rStudent");$(id).classList.add("show")}
function closeModal(id){$(id).classList.remove("show")}
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("show")}));

document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>showSection(btn.dataset.section)));
function showSection(id){
 document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
 $(id).classList.add("active");
 document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.section===id));
 const titles={dashboard:"Dashboard",students:"Students",teachers:"Teachers",classes:"Classes",attendance:"Attendance",fees:"Fees",results:"Results",notices:"Notices",settings:"Settings"};
 $("pageTitle").textContent=titles[id];
 if(id==="students")renderStudents(); if(id==="teachers")renderTeachers(); if(id==="classes")renderClasses(); if(id==="attendance")renderAttendance(); if(id==="fees")renderFees(); if(id==="results")renderResults(); if(id==="notices")renderNotices();
 $("sidebar").classList.remove("open");
}
$("menuBtn").onclick=()=>$("sidebar").classList.toggle("open");
$("today").textContent=new Date().toLocaleDateString("en-GB",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});

function updateDashboard(){
 $("studentCount").textContent=data.students.length;
 $("teacherCount").textContent=data.teachers.length;
 const paid=data.fees.filter(f=>f.status==="Paid").reduce((a,b)=>a+Number(b.amount),0);
 $("feeTotal").textContent="Rs. "+paid.toLocaleString();
 const vals=Object.values(data.attendance).flat();
 $("attendanceRate").textContent=vals.length?Math.round(vals.filter(Boolean).length/vals.length*100)+"%":"0%";
 $("feesCollected").textContent="Rs. "+paid.toLocaleString();
 $("feesPending").textContent="Rs. "+data.fees.filter(f=>f.status==="Pending").reduce((a,b)=>a+Number(b.amount),0).toLocaleString();
 $("paymentCount").textContent=data.fees.length;
 $("recentStudents").innerHTML=data.students.slice(-5).reverse().map(s=>`<tr><td><strong>${escapeHTML(s.name)}</strong></td><td>${escapeHTML(s.class)}</td><td><span class="status active-status">Active</span></td></tr>`).join("")||`<tr><td colspan="3">No students found.</td></tr>`;
}
function renderStudents(){
 const q=($("studentSearch").value||"").toLowerCase(), cls=$("studentClassFilter").value;
 const rows=data.students.filter(s=>(!cls||s.class===cls)&&[s.id,s.name,s.class].some(v=>v.toLowerCase().includes(q)));
 $("studentsTable").innerHTML=rows.map((s,i)=>`<tr><td>${escapeHTML(s.id)}</td><td><strong>${escapeHTML(s.name)}</strong><small>${escapeHTML(s.email||"")}</small></td><td>${escapeHTML(s.gender)}</td><td>${escapeHTML(s.class)}</td><td>${escapeHTML(s.phone||"-")}</td><td><span class="status active-status">Active</span></td><td><button class="action" onclick="editStudent(${data.students.indexOf(s)})">Edit</button><button class="action delete" onclick="deleteStudent(${data.students.indexOf(s)})">Delete</button></td></tr>`).join("")||`<tr><td colspan="7">No matching students.</td></tr>`;
}
function addStudent(e){e.preventDefault();data.students.push({id:$("sId").value.trim(),name:$("sName").value.trim(),gender:$("sGender").value,class:$("sClass").value,phone:$("sPhone").value.trim(),email:$("sEmail").value.trim()});persist();e.target.reset();closeModal("studentModal");renderStudents();showToast("Student added successfully")}
function editStudent(i){const s=data.students[i];const name=prompt("Edit student name:",s.name);if(name===null)return;s.name=name.trim()||s.name;s.class=prompt("Edit class:",s.class)||s.class;s.phone=prompt("Edit phone:",s.phone)||s.phone;persist();renderStudents();showToast("Student updated")}
function deleteStudent(i){if(confirm(`Delete ${data.students[i].name}?`)){data.students.splice(i,1);persist();renderStudents();showToast("Student deleted")}}

function renderTeachers(){
 const q=($("teacherSearch").value||"").toLowerCase();
 const rows=data.teachers.filter(t=>[t.id,t.name,t.subject,t.class].some(v=>v.toLowerCase().includes(q)));
 $("teachersTable").innerHTML=rows.map(t=>`<tr><td>${escapeHTML(t.id)}</td><td><strong>${escapeHTML(t.name)}</strong><small>${escapeHTML(t.email||"")}</small></td><td>${escapeHTML(t.subject)}</td><td>${escapeHTML(t.class)}</td><td>${escapeHTML(t.phone||"-")}</td><td><button class="action" onclick="editTeacher(${data.teachers.indexOf(t)})">Edit</button><button class="action delete" onclick="deleteTeacher(${data.teachers.indexOf(t)})">Delete</button></td></tr>`).join("")||`<tr><td colspan="6">No teachers found.</td></tr>`;
}
function addTeacher(e){e.preventDefault();data.teachers.push({id:$("tId").value.trim(),name:$("tName").value.trim(),subject:$("tSubject").value.trim(),class:$("tClass").value,phone:$("tPhone").value.trim(),email:$("tEmail").value.trim()});persist();e.target.reset();closeModal("teacherModal");renderTeachers();showToast("Teacher added successfully")}
function editTeacher(i){const t=data.teachers[i];t.name=prompt("Teacher name:",t.name)||t.name;t.subject=prompt("Subject:",t.subject)||t.subject;persist();renderTeachers();showToast("Teacher updated")}
function deleteTeacher(i){if(confirm(`Delete ${data.teachers[i].name}?`)){data.teachers.splice(i,1);persist();renderTeachers();showToast("Teacher deleted")}}

function renderClasses(){
 const classes=["Grade 6","Grade 7","Grade 8","Grade 9","Grade 10"];
 $("classGrid").innerHTML=classes.map(c=>{const count=data.students.filter(s=>s.class===c).length;const teacher=data.teachers.find(t=>t.class===c);const pct=Math.min(100,count*20+20);return `<div class="class-card"><h3>${c}</h3><p>👨‍🎓 ${count} students</p><p>👩‍🏫 ${teacher?escapeHTML(teacher.name):"Teacher not assigned"}</p><p>📚 ${teacher?escapeHTML(teacher.subject):"Multiple subjects"}</p><div class="class-progress"><i style="width:${pct}%"></i></div></div>`}).join("");
}

function renderAttendance(){
 const cls=$("attendanceClass").value,date=$("attendanceDate").value||new Date().toISOString().slice(0,10);
 $("attendanceDate").value=date;const key=date+"_"+cls;
 const students=data.students.filter(s=>s.class===cls);
 currentAttendance=data.attendance[key]||Object.fromEntries(students.map(s=>[s.id,true]));
 $("attendanceTable").innerHTML=students.map(s=>`<tr><td>${s.id}</td><td><strong>${escapeHTML(s.name)}</strong></td><td><label><input type="checkbox" class="att-check" data-id="${s.id}" ${currentAttendance[s.id]?"checked":""}> Present</label></td></tr>`).join("")||`<tr><td colspan="3">No students in this class.</td></tr>`;
}
function markAll(v){document.querySelectorAll(".att-check").forEach(c=>c.checked=v)}
function saveAttendance(){const date=$("attendanceDate").value,cls=$("attendanceClass").value,key=date+"_"+cls;data.attendance[key]={};document.querySelectorAll(".att-check").forEach(c=>data.attendance[key][c.dataset.id]=c.checked);persist();showToast("Attendance saved successfully")}
$("attendanceDate").value=new Date().toISOString().slice(0,10);

function fillStudentOptions(id){$(id).innerHTML=data.students.map(s=>`<option value="${escapeHTML(s.name)}">${escapeHTML(s.name)} — ${escapeHTML(s.class)}</option>`).join("")}
function renderFees(){$("feesTable").innerHTML=data.fees.slice().reverse().map((f,i)=>`<tr><td>${f.receipt}</td><td>${escapeHTML(f.student)}</td><td>${f.month}</td><td>Rs. ${Number(f.amount).toLocaleString()}</td><td><span class="status ${f.status==="Paid"?"paid":"pending"}">${f.status}</span></td><td><button class="action delete" onclick="deleteFee(${data.fees.indexOf(f)})">Delete</button></td></tr>`).join("")||`<tr><td colspan="6">No payments recorded.</td></tr>`}
function addFee(e){e.preventDefault();data.fees.push({receipt:"REC-"+(1000+data.fees.length+1),student:$("fStudent").value,month:$("fMonth").value,amount:Number($("fAmount").value),status:$("fStatus").value});persist();closeModal("feeModal");renderFees();e.target.reset();showToast("Fee record saved")}
function deleteFee(i){if(confirm("Delete this fee record?")){data.fees.splice(i,1);persist();renderFees()}}

function grade(m,t){const p=m/t*100;return p>=90?"A+":p>=80?"A":p>=70?"B":p>=60?"C":p>=50?"D":"F"}
function renderResults(){const q=($("resultSearch").value||"").toLowerCase();const rows=data.results.filter(r=>r.student.toLowerCase().includes(q)||r.subject.toLowerCase().includes(q));$("resultsTable").innerHTML=rows.map(r=>`<tr><td><strong>${escapeHTML(r.student)}</strong></td><td>${escapeHTML(r.subject)}</td><td>${r.marks}</td><td>${r.total}</td><td><span class="status ${grade(r.marks,r.total)==="F"?"absent":"paid"}">${grade(r.marks,r.total)}</span></td><td><button class="action delete" onclick="deleteResult(${data.results.indexOf(r)})">Delete</button></td></tr>`).join("")||`<tr><td colspan="6">No results found.</td></tr>`}
function addResult(e){e.preventDefault();data.results.push({student:$("rStudent").value,subject:$("rSubject").value.trim(),marks:Number($("rMarks").value),total:Number($("rTotal").value)});persist();closeModal("resultModal");renderResults();e.target.reset();showToast("Result saved")}
function deleteResult(i){if(confirm("Delete this result?")){data.results.splice(i,1);persist();renderResults()}}

function renderNotices(){$("noticeList").innerHTML=data.notices.map((n,i)=>`<article class="notice"><h3>📢 ${escapeHTML(n.title)}</h3><p>${escapeHTML(n.message)}</p><small>${escapeHTML(n.date)}</small><button class="action delete" style="float:right" onclick="deleteNotice(${i})">Delete</button></article>`).join("")}
function addNotice(e){e.preventDefault();data.notices.unshift({title:$("nTitle").value.trim(),message:$("nMessage").value.trim(),date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})});persist();closeModal("noticeModal");renderNotices();e.target.reset();showToast("Notice published")}
function deleteNotice(i){if(confirm("Delete this notice?")){data.notices.splice(i,1);persist();renderNotices()}}
function saveSettings(){data.settings.schoolName=$("schoolName").value.trim()||"EduManage School";persist();showToast("Settings saved")}
function resetData(){if(confirm("Reset all demo data? This cannot be undone.")){localStorage.removeItem(KEY);data=structuredClone(seed);persist();renderStudents();renderTeachers();renderFees();renderResults();renderNotices();renderClasses();renderAttendance();$("schoolName").value=data.settings.schoolName;showToast("Demo data reset")}}

updateDashboard();renderStudents();renderTeachers();renderClasses();renderAttendance();renderFees();renderResults();renderNotices();
