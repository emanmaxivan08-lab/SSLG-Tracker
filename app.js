// ---------------- Demo backend ----------------
const adminPassword = "sslg2026";

// Preloaded officers/students
let students = [
  {name:"Nicole Montemayor", role:"President", totalPoints:0},
  {name:"Ma. Flor R. Floralde", role:"Vice President Internal", totalPoints:0},
  {name:"Vonn Haven Sabordo", role:"Vice President External", totalPoints:0},
  {name:"Nizzle Ostulano", role:"Secretary", totalPoints:0},
  {name:"Rheanna Bustillo", role:"Assistant Secretary", totalPoints:0},
  {name:"Matthew Tomenes", role:"Treasurer SHS", totalPoints:0},
  {name:"Francesca Bello", role:"Treasurer JHS", totalPoints:0},
  {name:"Kimberly Shane Pavia", role:"Auditor SHS", totalPoints:0},
  {name:"Kristine Diaz", role:"Auditor JHS", totalPoints:0},
  {name:"Rhyian Jay Arma", role:"PIO SHS", totalPoints:0},
  {name:"Venice Robedillo", role:"PIO JHS", totalPoints:0},
  {name:"Joel Fortaleza", role:"Protocol Officer SHS", totalPoints:0},
  {name:"Lorraine Bolido", role:"Protocol Officer JHS", totalPoints:0},
  {name:"Ealhx Kimberly Alicos", role:"Grade 12 Chairperson", totalPoints:0},
  {name:"Joshua Daniel Mills", role:"Grade 12 Representative", totalPoints:0},
  {name:"Rizamae Diongzon", role:"Grade 12 Representative", totalPoints:0},
  {name:"Eivan Dacutanan", role:"Grade 11 Chairperson", totalPoints:0},
  {name:"Akira Lavendia", role:"Grade 11 Representative", totalPoints:0},
  {name:"Ksaffer Sabejon", role:"Grade 11 Representative", totalPoints:0},
  {name:"Ryza Camille Antivo", role:"Grade 10 Chairperson", totalPoints:0},
  {name:"Frederick Robles", role:"Grade 10 Representative", totalPoints:0},
  {name:"Tabebeng Cajusay", role:"Grade 10 Representative", totalPoints:0},
  {name:"Reynaldo Bernabe", role:"Grade 9 Chairperson", totalPoints:0},
  {name:"Jay Ann Monterona", role:"Grade 9 Representative", totalPoints:0},
  {name:"Kyla Manlangit", role:"Grade 9 Representative", totalPoints:0},
  {name:"Karyle Fate D. Manlangit", role:"Grade 8 Chairperson", totalPoints:0},
  {name:"Frenchedca Mae A. Cabangunay", role:"Grade 8 Representative", totalPoints:0},
  {name:"Rhiana Saby Saagundo", role:"Grade 8 Representative", totalPoints:0}
];

let events = [];
let checklists = {};

// ---------------- Login ----------------
function login(){
  const pw = document.getElementById("password").value;
  if(pw===adminPassword){
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    updateEventDropdown();
    updateStudentPoints();
  } else alert("Wrong password!");
}

function logout(){ location.reload(); }

// ---------------- Event Form ----------------
function updateEventForm(){
  document.getElementById("meetingFields").classList.add("hidden");
  document.getElementById("activityFields").classList.add("hidden");
  document.getElementById("programFields").classList.add("hidden");
  document.getElementById("otherRoomFields").classList.add("hidden");

  const type = document.getElementById("eventType").value;
  if(type==="Meeting") document.getElementById("meetingFields").classList.remove("hidden");
  else if(type==="Activity") document.getElementById("activityFields").classList.remove("hidden");
  else if(type==="Program/Project") document.getElementById("programFields").classList.remove("hidden");
}

function checkOtherRoom(){
  const val = document.getElementById("meetingLocation").value;
  if(val==="Other") document.getElementById("otherRoomFields").classList.remove("hidden");
  else document.getElementById("otherRoomFields").classList.add("hidden");
}

// ---------------- Add Event ----------------
function addEvent(){
  const type = document.getElementById("eventType").value;
  if(!type) return alert("Select event type");

  let eventObj = {type, points:0, name:"", date:"", location:"", adviser:"", meetingNumber:"", meetingAbout:""};

  if(type==="Meeting"){
    const num = document.getElementById("meetingNumber").value.trim();
    const about = document.getElementById("meetingAbout").value.trim();
    const loc = document.getElementById("meetingLocation").value==="Other"?document.getElementById("otherRoomName").value.trim():document.getElementById("meetingLocation").value;
    const adviser = document.getElementById("adviserTeacher").value.trim();
    const date = document.getElementById("meetingDate").value;
    const time = document.getElementById("meetingTime").value;
    let pts = parseFloat(document.getElementById("meetingPoints").value); if(!pts) pts=0.5;
    if(!num||!about||!loc||!date||!time) return alert("Fill all meeting fields");

    eventObj.name = `Meeting ${num}: ${about}`;
    eventObj.date = `${date} ${time}`;
    eventObj.location = loc;
    eventObj.adviser = adviser;
    eventObj.meetingNumber = num;
    eventObj.meetingAbout = about;
    eventObj.points = pts;
  } 
  else if(type==="Activity"){
    const name = document.getElementById("activityName").value.trim();
    const date = document.getElementById("activityDate").value;
    const loc = document.getElementById("activityLocation").value.trim();
    let pts = parseFloat(document.getElementById("activityPoints").value); if(!pts) pts=0.5;
    if(!name||!date||!loc) return alert("Fill all activity fields");
    eventObj.name = name; eventObj.date = date; eventObj.location = loc; eventObj.points = pts;
  } 
  else if(type==="Program/Project"){
    const name = document.getElementById("programName").value.trim();
    const date = document.getElementById("programDate").value;
    const loc = document.getElementById("programLocation").value.trim();
    let pts = parseFloat(document.getElementById("programPoints").value); if(!pts) pts=0.5;
    if(!name||!date||!loc) return alert("Fill all program/project fields");
    eventObj.name = name; eventObj.date = date; eventObj.location = loc; eventObj.points = pts;
  }

  events.push(eventObj);
  checklists[eventObj.name]={};
  students.forEach(s=>checklists[eventObj.name][s.name]=0);

  // Clear form
  document.querySelectorAll("input").forEach(inp=>inp.value="");
  document.getElementById("meetingLocation").value="";
  updateEventDropdown();
  loadChecklist();
}

// ---------------- Event Dropdown ----------------
function updateEventDropdown(){
  const sel = document.getElementById("selectEvent");
  sel.innerHTML = '<option value="">--Select Event--</option>';
  events.forEach((e, index)=>{
    sel.innerHTML += `<option value="${index}">${e.name} (${e.type})</option>`;
  });
}

// ---------------- Checklist ----------------
function loadChecklist(){
  const sel = document.getElementById("selectEvent");
  const eventIndex = sel.value;
  if(eventIndex===""){ 
    document.getElementById("checklistSection").classList.add("hidden");
    return;
  }

  const e = events[eventIndex];
  const eventName = e.name;
  document.getElementById("checklistSection").classList.remove("hidden");

  // Show event info
  let infoDiv = document.getElementById("eventInfo");
  if(!infoDiv){
    infoDiv = document.createElement("div");
    infoDiv.id="eventInfo";
    document.getElementById("checklistSection").prepend(infoDiv);
  }

  infoDiv.innerHTML = `
    <b>Type:</b> ${e.type} <br>
    ${e.type==="Meeting"? `<b>Meeting Number:</b> ${e.meetingNumber}<br>
    <b>About:</b> ${e.meetingAbout}<br>
    <b>Location:</b> ${e.location}<br>
    <b>Adviser:</b> ${e.adviser}<br>
    <b>Date & Time:</b> ${e.date}` : ""}
    ${e.type==="Activity"? `<b>Activity Name:</b> ${e.name}<br>
    <b>Date:</b> ${e.date}<br>
    <b>Location:</b> ${e.location}` : ""}
    ${e.type==="Program/Project"? `<b>Program/Project Name:</b> ${e.name}<br>
    <b>Date:</b> ${e.date}<br>
    <b>Location:</b> ${e.location}` : ""}
    <br><b>Points:</b> ${e.points}
  `;

  // Checklist Table
  const table = document.getElementById("checklistTable");
  table.innerHTML = "<tr><th>Student</th><th>Position</th><th>Attendance %</th><th>Points Earned</th></tr>";
  students.forEach(s=>{
    const attendance = checklists[eventName][s.name] || 0;
    const points = (attendance/100)*e.points;
    table.innerHTML += `<tr>
      <td>${s.name}</td>
      <td>${s.role}</td>
      <td>
        <select onchange="updateAttendance('${eventName}','${s.name}',this.value)">
          <option value="0" ${attendance==0?'selected':''}>0%</option>
          <option value="20" ${attendance==20?'selected':''}>20%</option>
          <option value="40" ${attendance==40?'selected':''}>40%</option>
          <option value="60" ${attendance==60?'selected':''}>60%</option>
          <option value="80" ${attendance==80?'selected':''}>80%</option>
          <option value="100" ${attendance==100?'selected':''}>100%</option>
        </select>
      </td>
      <td>${points.toFixed(2)}</td>
    </tr>`;
  });

  updateStudentPoints();
}

// ---------------- Update Attendance ----------------
function updateAttendance(eventName, studentName, percent){
  checklists[eventName][studentName] = parseInt(percent);
  loadChecklist();
}

// ---------------- Total Points ----------------
function updateStudentPoints(){
  const table = document.getElementById("studentPointsTable");
  table.innerHTML = "<tr><th>Student</th><th>Position</th><th>Total Points</th></tr>";
  students.forEach(s=>{
    let total=0;
    events.forEach(ev=>{
      total += (checklists[ev.name][s.name]/100)*ev.points;
    });
    table.innerHTML += `<tr><td>${s.name}</td><td>${s.role}</td><td>${total.toFixed(2)}</td></tr>`;
  });
}
