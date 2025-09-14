 // ===== MOCK DATASETS =====
    const STATES = {
      "Andhra Pradesh": ["Anantapur", "Chittoor", "Guntur", "Krishna", "Visakhapatnam"],
      "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
      "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
      "Tamil Nadu": ["Chennai", "Madurai", "Coimbatore", "Salem", "Tiruchirappalli"],
      "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Allahabad"],
      "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Asansol", "Durgapur"]
    };

    // Crop definitions: preferred months, rainfall range (mm), NPK ideal ranges, pH range
    const CROPS = [
      {id:'sugarcane',name:'Sugarcane',months:[6,7,8,9,10],rain:[600,2000],N:[100,200],P:[30,80],K:[60,120],pH:[5.5,8]},
      {id:'rice',name:'Rice',months:[6,7,8,9],rain:[800,2000],N:[80,160],P:[30,60],K:[40,120],pH:[5,6.8]},
      {id:'maize',name:'Maize',months:[6,7,8,9],rain:[200,1000],N:[60,140],P:[20,60],K:[20,80],pH:[5.5,7.5]},
      {id:'groundnut',name:'Groundnut',months:[7,8,9,10],rain:[400,1200],N:[20,60],P:[20,60],K:[20,80],pH:[5.5,7.0]},
      {id:'wheat',name:'Wheat',months:[11,12,1,2,3],rain:[200,600],N:[60,120],P:[30,70],K:[20,60],pH:[6.0,7.5]}
    ];

    // Compost suggestions per crop
    const COMPOSTS = {
      'rice': ['Green manure (Sesbania)', 'Compost + Azolla', 'Farmyard manure'],
      'maize': ['Compost enriched with Neem cake', 'Vermicompost'],
      'wheat': ['N-rich FYM', 'Composted manure'],
      'sugarcane': ['Pressmud compost', 'Vermicompost'],
      'groundnut': ['Biochar enriched compost', 'Vermicompost']
    };

    // Pest suggestions per crop
    const PESTS = {
      'rice': ['Use Trichogramma parasitoids', 'Neem oil spray (biopesticide)'],
      'maize': ['Pheromone traps', 'Crop rotation & biopesticides'],
      'wheat': ['Monitor for rust - apply recommended fungicide', 'Use resistant varieties'],
      'sugarcane': ['Integrated pest management, Topical biopesticides'],
      'groundnut': ['Use seed treatment with Trichoderma', 'Timely weeding']
    };

    // Mock monthly weather by district (avg rainfall mm and temp C)
    const WEATHER = {
      'Pune':{rain:650,temp:24},'Nagpur':{rain:1200,temp:26},'Nashik':{rain:700,temp:25},
      'Bengaluru Urban':{rain:900,temp:23},'Mysore':{rain:750,temp:25},'Belgaum':{rain:1100,temp:24},
      'Chennai':{rain:1000,temp:29},'Coimbatore':{rain:800,temp:26},'Madurai':{rain:650,temp:28}
    };

    // ----- populate selects -----
    const stateSelect = document.getElementById('stateSelect');
    const districtSelect = document.getElementById('districtSelect');
    const monthSelect = document.getElementById('monthSelect');
    const cropList = document.getElementById('cropList');
    const compostList = document.getElementById('compostList');
    const pestList = document.getElementById('pestList');
    const snapshot = document.getElementById('snapshot');
    const farmScore = document.getElementById('farmScore');

    Object.keys(STATES).forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent=s;stateSelect.appendChild(o)});
    stateSelect.addEventListener('change',e=>{populateDistricts();});
    function populateDistricts(){districtSelect.innerHTML='';const s=stateSelect.value||Object.keys(STATES)[0];(STATES[s]||[]).forEach(d=>{const o=document.createElement('option');o.value=d;o.textContent=d;districtSelect.appendChild(o);});}
    for(let m=1;m<=12;m++){const o=document.createElement('option');o.value=m;o.textContent=new Date(0, m-1).toLocaleString('en',{month:'long'});monthSelect.appendChild(o);}    
    populateDistricts();

    // analyze logic
    document.getElementById('analyzeBtn').addEventListener('click',analyze);
    document.getElementById('clearBtn').addEventListener('click',resetForm);

    function analyze(){
      const state=stateSelect.value;const district=districtSelect.value;const month=+monthSelect.value;
      const N=+document.getElementById('nVal').value;const P=+document.getElementById('pVal').value;const K=+document.getElementById('kVal').value;const ph=+document.getElementById('phVal').value;
      const w = WEATHER[district]||{rain:600,temp:25};

      // simple scoring: crop gets score based on month suitability + rainfall + NPK+pH match
      const scored = CROPS.map(c=>{
        let score=0;
        if(c.months.includes(month)) score+=30;
        // rainfall closeness
        const rainAvg=w.rain; const rRange=c.rain; const rainScore=Math.max(0,30 - Math.abs((rRange[0]+rRange[1])/2 - rainAvg)/10);
        score+=rainScore;
        // n/p/k closeness
        const nScore=Math.max(0,20 - Math.abs(((c.N[0]+c.N[1])/2)-N)/5);
        const pScore=Math.max(0,10 - Math.abs(((c.P[0]+c.P[1])/2)-P)/3);
        const kScore=Math.max(0,10 - Math.abs(((c.K[0]+c.K[1])/2)-K)/4);
        score+=nScore+pScore+kScore;
        // pH
        const phPref=(c.pH[0]+c.pH[1])/2; const phScore=Math.max(0,10 - Math.abs(phPref-ph)*4);
        score+=phScore;
        return {...c,score:Math.round(score)};
      }).sort((a,b)=>b.score-a.score);

      // show top 3
      cropList.innerHTML='';scored.slice(0,3).forEach(c=>{
        const li=document.createElement('li');li.style.padding='8px';li.style.borderRadius='8px';li.style.background='#f7fff6';li.style.marginBottom='6px';
        li.innerHTML=`<strong>${c.name}</strong> <div class='muted'>Match score: ${c.score}</div>`;
        cropList.appendChild(li);
      });

      // composts & pests
      compostList.innerHTML='';pestList.innerHTML='';
      const top=scored[0];
      (COMPOSTS[top.id]||[]).forEach(it=>{const li=document.createElement('li');li.textContent=it;compostList.appendChild(li)});
      (PESTS[top.id]||[]).forEach(it=>{const li=document.createElement('li');li.textContent=it;pestList.appendChild(li)});

      // snapshot
      snapshot.innerHTML=`<div><strong>District:</strong> ${district}</div><div class='muted'>Avg Rain: ${w.rain} mm • Avg Temp: ${w.temp}°C</div><div class='muted'>Soil: N=${N} P=${P} K=${K} • pH=${ph}</div>`;

      farmScore.textContent = scored[0].score + '/110';
      document.getElementById('oneLine').textContent = `Best: ${scored[0].name}. Suggest: ${COMPOSTS[scored[0].id]?.[0]||'Standard compost'}. Use biopesticides if needed.`;

      // KPIs - simple estimates
      document.getElementById('uplift').textContent = (5 + Math.round(scored[0].score/11)) + '%';
      document.getElementById('waterSave').textContent = Math.max(5, Math.round((scored[0].score/110)*20)) + '%';

      // speak summary
      speakText(`${scored[0].name} is recommended. Expected uplift ${(5 + Math.round(scored[0].score/11))} percent. Compost suggestion: ${(COMPOSTS[scored[0].id]||['Farmyard manure'])[0]}`);
    }

    function resetForm(){document.getElementById('nVal').value=80;document.getElementById('pVal').value=30;document.getElementById('kVal').value=40;document.getElementById('phVal').value=6.5;}

    // ===== Voice Assistant (ASR + TTS) =====
    const micBtn = document.getElementById('micBtn');
    const voiceStatus = document.getElementById('voiceStatus');
    let recognition=null; let listening=false;

    // Setup Web Speech API if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if(SpeechRecognition){
      recognition = new SpeechRecognition();
      recognition.lang = document.getElementById('langSelect').value || 'hi-IN';
      recognition.interimResults = false; recognition.maxAlternatives = 1;

      recognition.onstart = ()=>{listening=true;voiceStatus.textContent='Listening...';micBtn.style.transform='scale(1.06)';}
      recognition.onend = ()=>{listening=false;voiceStatus.textContent='Idle';micBtn.style.transform='scale(1)';}
      recognition.onerror = (e)=>{listening=false;voiceStatus.textContent='Error: '+e.error;}
      recognition.onresult = (e)=>{
        const text = e.results[0][0].transcript;voiceStatus.textContent='Heard: '+text;processVoiceCommand(text);
      }
    } else {
      // fallback
      document.getElementById('voiceStatus').textContent='Speech API not supported in this browser';
      micBtn.style.opacity=0.6;micBtn.style.cursor='not-allowed';
    }

    document.getElementById('langSelect').addEventListener('change',()=>{if(recognition) recognition.lang=document.getElementById('langSelect').value;});

    micBtn.addEventListener('click',()=>{
      if(!recognition) return; if(!listening) recognition.start(); else recognition.stop();
    });

    function processVoiceCommand(text){
      // VERY simple NLU demo: look for numbers and keywords
      const t = text.toLowerCase();
      // if user asks to analyze
      if(t.includes('analyze')||t.includes('sifarish')||t.includes('suo')||t.includes('recommend')||t.includes('sujaav')||t.includes('kaunsa')){
        analyze();
        return;
      }
      // fill numbers like N P K pH
      const nums = text.match(/\d+(?:\.\d+)?/g);
      if(nums && nums.length>=4){document.getElementById('nVal').value = nums[0];document.getElementById('pVal').value = nums[1];document.getElementById('kVal').value = nums[2];document.getElementById('phVal').value = nums[3];voiceStatus.textContent='Values set from voice';return;}
      // generic fallback
      speakText('मैं आपकी मदद करूँगा। कृपया "Analyze" बोलें या विवरण दें।');
    }

    // TTS
    function speakText(txt){
      const lang = document.getElementById('langSelect').value || 'hi-IN';
      if('speechSynthesis' in window){
        const ut = new SpeechSynthesisUtterance(txt);
        ut.lang = lang;
        // pick a voice that matches language roughly
        const voices = speechSynthesis.getVoices();
        if(voices && voices.length){
          const v = voices.find(v=>v.lang && v.lang.startsWith(lang.split('-')[0]));
          if(v) ut.voice = v;
        }
        speechSynthesis.cancel();speechSynthesis.speak(ut);
      } else {
        console.log('TTS not supported');
      }
    }

    // initial sample run
    analyze();
