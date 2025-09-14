 const STATES = {
      "Andhra Pradesh": ["Anantapur", "Chittoor", "Guntur", "Krishna", "Visakhapatnam"],
      "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
      "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
      "Tamil Nadu": ["Chennai", "Madurai", "Coimbatore", "Salem", "Tiruchirappalli"],
      "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Allahabad"],
      "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Asansol", "Durgapur"]
    };

    const CROPS = [
      {id:'sugarcane',name:'Sugarcane',months:[6,7,8,9,10],rain:[600,2000],N:[100,200],P:[30,80],K:[60,120],pH:[5.5,8]},
      {id:'rice',name:'Rice',months:[6,7,8,9],rain:[800,2000],N:[80,160],P:[30,60],K:[40,120],pH:[5,6.8]},
      {id:'maize',name:'Maize',months:[6,7,8,9],rain:[200,1000],N:[60,140],P:[20,60],K:[20,80],pH:[5.5,7.5]},
      {id:'groundnut',name:'Groundnut',months:[7,8,9,10],rain:[400,1200],N:[20,60],P:[20,60],K:[20,80],pH:[5.5,7.0]},
      {id:'wheat',name:'Wheat',months:[11,12,1,2,3],rain:[200,600],N:[60,120],P:[30,70],K:[20,60],pH:[6.0,7.5]}
    ];

    const COMPOSTS = {
      'rice': ['Green manure (Sesbania)', 'Compost + Azolla', 'Farmyard manure'],
      'maize': ['Compost enriched with Neem cake', 'Vermicompost'],
      'wheat': ['N-rich FYM', 'Composted manure'],
      'sugarcane': ['Pressmud compost', 'Vermicompost'],
      'groundnut': ['Biochar enriched compost', 'Vermicompost']
    };

    const PESTS = {
      'rice': ['Use Trichogramma parasitoids', 'Neem oil spray (biopesticide)'],
      'maize': ['Pheromone traps', 'Crop rotation & biopesticides'],
      'wheat': ['Monitor for rust - apply recommended fungicide', 'Use resistant varieties'],
      'sugarcane': ['Integrated pest management, Topical biopesticides'],
      'groundnut': ['Use seed treatment with Trichoderma', 'Timely weeding']
    };

    const WEATHER = {
      'Pune':{rain:650,temp:24},'Nagpur':{rain:1200,temp:26},'Nashik':{rain:700,temp:25},
      'Bengaluru Urban':{rain:900,temp:23},'Mysore':{rain:750,temp:25},'Belgaum':{rain:1100,temp:24},
      'Chennai':{rain:1000,temp:29},'Coimbatore':{rain:800,temp:26},'Madurai':{rain:650,temp:28}
    };

    // dom
    const stateSelect = document.getElementById('stateSelect');
    const districtSelect = document.getElementById('districtSelect');
    const monthSelect = document.getElementById('monthSelect');
    const nVal = document.getElementById('nVal');
    const pVal = document.getElementById('pVal');
    const kVal = document.getElementById('kVal');
    const phVal = document.getElementById('phVal');

    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const langSelect = document.getElementById('langSelect');

    const cropList = document.getElementById('cropList');
    const compostList = document.getElementById('compostList');
    const pestList = document.getElementById('pestList');
    const snapshot = document.getElementById('snapshot');
    const farmScore = document.getElementById('farmScore');
    const oneLine = document.getElementById('oneLine');
    const upliftEl = document.getElementById('uplift');
    const waterSaveEl = document.getElementById('waterSave');

    const micBtn = document.getElementById('micBtn');
    const voiceStatusEl = document.getElementById('voiceStatus');

    /* ============================
       Populate selects
       ============================ */
    Object.keys(STATES).forEach(s=>{
      const o = document.createElement('option'); o.value = s; o.textContent = s; stateSelect.appendChild(o);
    });

    function populateDistricts(){
      districtSelect.innerHTML = '';
      const s = stateSelect.value || Object.keys(STATES)[0];
      (STATES[s] || []).forEach(d => { const o = document.createElement('option'); o.value = d; o.textContent = d; districtSelect.appendChild(o); });
    }
    stateSelect.addEventListener('change', populateDistricts);

    for(let m=1;m<=12;m++){ const o=document.createElement('option'); o.value=m; o.textContent=new Date(0,m-1).toLocaleString('en',{month:'long'}); monthSelect.appendChild(o); }
    populateDistricts();

    analyzeBtn.addEventListener('click', analyze);
    clearBtn.addEventListener('click', ()=>{ nVal.value=80; pVal.value=30; kVal.value=40; phVal.value=6.5; });

    /* ============================
       Analysis logic (same scoring)
       ============================ */
    function analyze(){
      const state = stateSelect.value; const district = districtSelect.value; const month = +monthSelect.value;
      const N = +nVal.value, P = +pVal.value, K = +kVal.value, ph = +phVal.value;
      const w = WEATHER[district] || {rain:600,temp:25};

      const scored = CROPS.map(c=>{
        let score=0;
        if(c.months.includes(month)) score+=30;
        const rainAvg = w.rain; const rMid = (c.rain[0]+c.rain[1])/2;
        const rainScore = Math.max(0,30 - Math.abs(rMid - rainAvg)/10);
        score+=rainScore;
        const nScore = Math.max(0,20 - Math.abs(((c.N[0]+c.N[1])/2) - N)/5);
        const pScore = Math.max(0,10 - Math.abs(((c.P[0]+c.P[1])/2) - P)/3);
        const kScore = Math.max(0,10 - Math.abs(((c.K[0]+c.K[1])/2) - K)/4);
        score += nScore + pScore + kScore;
        const phPref = (c.pH[0] + c.pH[1]) / 2;
        const phScore = Math.max(0,10 - Math.abs(phPref - ph)*4);
        score += phScore;
        return {...c, score: Math.round(score)};
      }).sort((a,b)=>b.score-a.score);

      // show top 3
      cropList.innerHTML=''; scored.slice(0,3).forEach(c=>{
        const li = document.createElement('li');
        li.style.padding='8px'; li.style.borderRadius='8px'; li.style.background='#f7fff6'; li.style.marginBottom='6px';
        li.innerHTML = `<strong>${c.name}</strong> <div class='muted'>Match score: ${c.score}</div>`;
        cropList.appendChild(li);
      });

      // compost & pests for top crop
      compostList.innerHTML=''; pestList.innerHTML='';
      const top = scored[0];
      (COMPOSTS[top.id] || []).forEach(it => { const li = document.createElement('li'); li.textContent=it; compostList.appendChild(li); });
      (PESTS[top.id] || []).forEach(it => { const li = document.createElement('li'); li.textContent=it; pestList.appendChild(li); });

      snapshot.innerHTML = `<div><strong>District:</strong> ${district} • <strong>State:</strong> ${state}</div>
        <div class='muted'>Avg Rain: ${w.rain} mm • Avg Temp: ${w.temp}°C</div>
        <div class='muted'>Soil: N=${N} P=${P} K=${K} • pH=${ph}</div>`;

      farmScore.textContent = scored[0].score + '/110';
      oneLine.textContent = `Best: ${scored[0].name}. Suggest: ${COMPOSTS[scored[0].id]?.[0] || 'Standard compost'}. Use biopesticides if needed.`;

      upliftEl.textContent = (5 + Math.round(scored[0].score/11)) + '%';
      waterSaveEl.textContent = Math.max(5, Math.round((scored[0].score/110)*20)) + '%';

      // speak result summary
      const compostTxt = (COMPOSTS[top.id] && COMPOSTS[top.id][0]) ? COMPOSTS[top.id][0] : 'farmyard manure';
      const pestTxt = (PESTS[top.id] && PESTS[top.id][0]) ? PESTS[top.id][0] : 'monitor pests';
      speakText(`${top.name} is recommended. Compost suggestion: ${compostTxt}. Pest tip: ${pestTxt}.`);
    }

    /* ============================
       Voice assistant (ASR + TTS)
       ============================ */
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    let recognition = null;
    let isListening = false;

    function devToLatinDigits(str){
      // convert Devanagari digits to latin digits (०-९)
      return str.replace(/[\u0966-\u096F]/g, ch => String(ch.charCodeAt(0) - 0x0966));
    }

    function extractNumbersFromText(text){
      const t = devToLatinDigits(text);
      const nums = t.match(/\d+(\.\d+)?/g);
      return nums ? nums.map(n => parseFloat(n)) : [];
    }

    function findMonthFromText(text){
      // map of common month names in Hindi & English
      const map = {
        'january':1,'जनवरी':1,'february':2,'फरवरी':2,'march':3,'मार्च':3,'april':4,'अप्रैल':4,
        'may':5,'मई':5,'june':6,'जून':6,'july':7,'जुलाई':7,'august':8,'अगस्त':8,
        'september':9,'सितंबर':9,'october':10,'अक्टूबर':10,'november':11,'नवंबर':11,
        'december':12,'दिसंबर':12
      };
      for(const k in map){ if(text.includes(k)) return map[k]; }
      // also allow numeric month words like '6', '६'
      const num = extractNumbersFromText(text)[0];
      if(num && num>=1 && num<=12) return Math.round(num);
      return null;
    }

    function matchStateDistrictFromText(text){
      // try to match state or district by substring (lowercased)
      const t = text.toLowerCase();
      // states
      for(const st of Object.keys(STATES)){
        if(t.includes(st.toLowerCase())) return {state: st};
      }
      // districts
      for(const st of Object.keys(STATES)){
        for(const d of STATES[st]){
          if(t.includes(d.toLowerCase())) return {state: st, district: d};
        }
      }
      return {};
    }

    function speakText(txt){
      const lang = langSelect.value || 'hi-IN';
      if('speechSynthesis' in window){
        const utter = new SpeechSynthesisUtterance(txt);
        utter.lang = lang;
        // try to pick a voice that matches the selected language
        const voices = speechSynthesis.getVoices();
        if(voices && voices.length){
          // pick voice that starts with language code (e.g., 'hi' for hi-IN) else fallback to first voice
          const langPrefix = lang.split('-')[0];
          const v = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix)) || voices.find(v=>v.lang && v.lang.toLowerCase().startsWith(lang)) || voices[0];
          if(v) utter.voice = v;
        }
        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
      } else {
        console.log('TTS not supported');
      }
    }

    // Initialize recognition if available
    if(SpeechRecognition){
      recognition = new SpeechRecognition();
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = langSelect.value || 'hi-IN';

      recognition.onstart = () => { isListening = true; micBtn.classList.add('active'); voiceStatusEl.textContent = 'Listening...'; }
      recognition.onend = () => { isListening = false; micBtn.classList.remove('active'); if(voiceStatusEl.textContent === 'Listening...') voiceStatusEl.textContent = 'Idle'; }
      recognition.onerror = (e) => { isListening = false; micBtn.classList.remove('active'); voiceStatusEl.textContent = 'Speech error: ' + (e.error || e.message || 'unknown'); }

      recognition.onresult = (e) => {
        const textRaw = e.results[0][0].transcript;
        voiceStatusEl.textContent = 'Heard: ' + textRaw;
        processVoiceCommand(textRaw);
      };
    } else {
      micBtn.style.opacity = 0.5; micBtn.title = 'Speech recognition not supported';
      voiceStatusEl.textContent = 'Speech API not supported in this browser';
    }

    // change recognition language when user picks a different voice lang
    langSelect.addEventListener('change', ()=>{
      if(recognition) recognition.lang = langSelect.value || 'hi-IN';
      speakText(langSelect.options[langSelect.selectedIndex].text + ' voice selected');
    });

    // mic toggle
    micBtn.addEventListener('click', ()=>{
      if(!recognition) { speakText('Speech recognition not supported on this browser. Use Chrome.'); return; }
      if(!isListening){ try { recognition.start(); } catch(e){ console.warn(e); } }
      else recognition.stop();
    });

    /* ============================
       Process spoken text -> autofill & commands
       ============================ */
    function processVoiceCommand(text){
      const lower = text.toLowerCase();
      const nums = extractNumbersFromText(lower); // array of numbers converted to latin digits

      // try match state/district
      const matched = matchStateDistrictFromText(lower);
      if(matched.state){
        stateSelect.value = matched.state;
        populateDistricts();
        if(matched.district) districtSelect.value = matched.district;
      }

      // month
      const monthNum = findMonthFromText(lower);
      if(monthNum) monthSelect.value = monthNum;

      // If user spoke 4+ numbers, assume N P K pH order
      if(nums.length >= 4){
        nVal.value = nums[0];
        pVal.value = nums[1];
        kVal.value = nums[2];
        phVal.value = nums[3];
        voiceStatusEl.textContent = 'Values set from voice';
        speakText('मान सेट कर दिए गए हैं। यदि आप चाहिए तो "सुझाव" कहें।');
        return;
      }

      // If user mentions specific nutrient words, map first found number to it
      if((lower.includes('नाइट्रोजन') || lower.includes('nitrogen') || /\bएन\b/.test(lower)) && nums.length>=1){
        nVal.value = nums[0];
        voiceStatusEl.textContent = 'Nitrogen set to ' + nums[0];
        speakText('नाइट्रोजन सेट किया गया: ' + nums[0]);
        return;
      }
      if((lower.includes('फॉस्फोरस') || lower.includes('phosphorus') || lower.includes('फॉस्फो') || /\bपी\b/.test(lower)) && nums.length>=1){
        pVal.value = nums[0];
        voiceStatusEl.textContent = 'Phosphorus set to ' + nums[0];
        speakText('फॉस्फोरस सेट किया गया: ' + nums[0]);
        return;
      }
      if((lower.includes('पोटाश') || lower.includes('potash') || lower.includes('potassium') || /\bके\b/.test(lower)) && nums.length>=1){
        kVal.value = nums[0];
        voiceStatusEl.textContent = 'Potassium set to ' + nums[0];
        speakText('पोटाश सेट किया गया: ' + nums[0]);
        return;
      }
      if(lower.includes('पीएच') || lower.includes('ph') || lower.includes('pH')){
        // pH might be a decimal
        const num = extractNumbersFromText(lower)[0];
        if(num){ phVal.value = num; voiceStatusEl.textContent = 'pH set to ' + num; speakText('पीएच सेट किया गया: ' + num); return; }
      }

      // If user asks for suggestions / analyze
      const analyzeKeywords = ['analyze','analyse','सुझाव','सुझाव दो','बताओ','कौन सी फसल','कौन फसल','अनालाइज़','सुझाए'];
      if(analyzeKeywords.some(k => lower.includes(k))){
        voiceStatusEl.textContent = 'Running analysis...';
        analyze();
        return;
      }

      // fallback: echo and hint
      speakText('मैंने सुना: ' + text + '. आप कह सकते हैं, उदाहरण के लिए: \"नाइट्रोजन 40\" या \"कौन सी फसल\"।');
    }

    /* ============================
       Helpful: ensure voices loaded for TTS
       ============================ */
    // Some browsers populate voices asynchronously
    if(typeof speechSynthesis !== 'undefined'){
      speechSynthesis.onvoiceschanged = () => { /* no-op: ensures voices populated */ };
    }

    // initial analyze so UI is populated
    analyze();

