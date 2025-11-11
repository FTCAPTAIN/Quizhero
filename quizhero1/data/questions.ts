import type { StaticQuestion } from '../types';

export const staticQuestions: StaticQuestion[] = [
  // GK
  {
    question: {
      en: 'What is the capital of India?',
      hi: 'भारत की राजधानी क्या है?',
      te: 'భారతదేశ రాజధాని ఏది?',
    },
    options: {
      en: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
      hi: ['मुंबई', 'नई दिल्ली', 'कोलकाता', 'चेन्नई'],
      te: ['ముంబై', 'న్యూఢిల్లీ', 'కోల్‌కతా', 'చెన్నై'],
    },
    answer: 'New Delhi',
    category: 'GK',
    difficulty: 'Easy',
  },
  {
    question: {
        en: 'Which is the largest state in India by area?',
        hi: 'क्षेत्रफल की दृष्टि से भारत का सबसे बड़ा राज्य कौन सा है?',
        te: 'విస్తీర్ణంలో భారతదేశంలో అతిపెద్ద రాష్ట్రం ఏది?',
    },
    options: {
        en: ['Maharashtra', 'Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh'],
        hi: ['महाराष्ट्र', 'मध्य प्रदेश', 'राजस्थान', 'उत्तर प्रदेश'],
        te: ['మహారాష్ట్ర', 'మధ్యప్రదేశ్', 'రాజస్థాన్', 'ఉత్తర ప్రదేశ్'],
    },
    answer: 'Rajasthan',
    category: 'GK',
    difficulty: 'Medium',
  },
   {
    question: {
      en: 'What is the national animal of India?',
      hi: 'भारत का राष्ट्रीय पशु क्या है?',
      te: 'భారతదేశ జాతీయ జంతువు ఏది?',
    },
    options: {
      en: ['Lion', 'Tiger', 'Elephant', 'Leopard'],
      hi: ['शेर', 'बाघ', 'हाथी', 'तेंदुआ'],
      te: ['సింహం', 'పులి', 'ఏనుగు', 'చిరుతపులి'],
    },
    answer: 'Tiger',
    category: 'GK',
    difficulty: 'Easy',
  },
  // Sports
  {
    question: {
      en: 'Who is known as the "God of Cricket"?',
      hi: '"क्रिकेट का भगवान" किसे कहा जाता है?',
      te: '"క్రికెట్ దేవుడు" అని ఎవరిని అంటారు?',
    },
    options: {
      en: ['Virat Kohli', 'MS Dhoni', 'Sachin Tendulkar', 'Kapil Dev'],
      hi: ['विराट कोहली', 'एमएस धोनी', 'सचिन तेंदुलकर', 'कपिल देव'],
      te: ['విరాట్ కోహ్లీ', 'ఎంఎస్ ధోని', 'సచిన్ టెండూల్కర్', 'కపిల్ దేవ్'],
    },
    answer: 'Sachin Tendulkar',
    category: 'Sports',
    difficulty: 'Easy',
  },
  {
    question: {
        en: 'In which year did India win its first Cricket World Cup?',
        hi: 'भारत ने अपना पहला क्रिकेट विश्व कप किस वर्ष जीता था?',
        te: 'భారతదేశం తన మొదటి క్రికెట్ ప్రపంచ కప్‌ను ఏ సంవత్సరంలో గెలుచుకుంది?',
    },
    options: {
        en: ['1983', '1987', '2003', '2011'],
        hi: ['1983', '1987', '2003', '2011'],
        te: ['1983', '1987', '2003', '2011'],
    },
    answer: '1983',
    category: 'Sports',
    difficulty: 'Medium',
  },
   {
    question: {
      en: 'Which Indian athlete is nicknamed the "Dhing Express"?',
      hi: 'किस भारतीय एथलीट को "ढिंग एक्सप्रेस" उपनाम दिया गया है?',
      te: '"ధింగ్ ఎక్స్‌ప్రెస్" అని ఏ భారతీయ అథ్లెట్‌కు మారుపేరు ఉంది?',
    },
    options: {
      en: ['P. T. Usha', 'Hima Das', 'Dutee Chand', 'Anju Bobby George'],
      hi: ['पी. टी. उषा', 'हिमा दास', 'दुती चंद', 'अंजू बॉबी जॉर्ज'],
      te: ['పి. టి. ఉష', 'హిమ దాస్', 'ద్యుతీ చంద్', 'అంజు బాబీ జార్జ్'],
    },
    answer: 'Hima Das',
    category: 'Sports',
    difficulty: 'Hard',
  },
  // Bollywood
  {
    question: {
      en: 'Which movie won the first Filmfare Award for Best Film?',
      hi: 'किस फिल्म ने सर्वश्रेष्ठ फिल्म का पहला फिल्मफेयर पुरस्कार जीता?',
      te: 'ఉత్తమ చిత్రంగా మొదటి ఫిల్మ్‌ఫేర్ అవార్డును ఏ చిత్రం గెలుచుకుంది?',
    },
    options: {
      en: ['Do Bigha Zamin', 'Mother India', 'Mughal-e-Azam', 'Pyaasa'],
      hi: ['दो बीघा ज़मीन', 'मदर इंडिया', 'मुगल-ए-आज़म', 'प्यासा'],
      te: ['దో బిఘా జమీన్', 'మదర్ ఇండియా', 'మొఘల్-ఎ-ఆజం', 'ప్యాసా'],
    },
    answer: 'Do Bigha Zamin',
    category: 'Bollywood',
    difficulty: 'Hard',
  },
  {
    question: {
        en: 'Who is popularly known as the "King Khan" of Bollywood?',
        hi: 'बॉलीवुड के "किंग खान" के नाम से किसे जाना जाता है?',
        te: 'బాలీవుడ్‌లో "కింగ్ ఖాన్" అని ఎవరిని పిలుస్తారు?',
    },
    options: {
        en: ['Amitabh Bachchan', 'Salman Khan', 'Aamir Khan', 'Shah Rukh Khan'],
        hi: ['अमिताभ बच्चन', 'सलमान खान', 'आमिर खान', 'शाहरुख खान'],
        te: ['అమితాబ్ బచ్చన్', 'సల్మాన్ ఖాన్', 'ఆమిర్ ఖాన్', 'షారుఖ్ ఖాన్'],
    },
    answer: 'Shah Rukh Khan',
    category: 'Bollywood',
    difficulty: 'Easy',
  },
   {
    question: {
      en: 'In the movie "Lagaan", what was the name of the main character played by Aamir Khan?',
      hi: 'फिल्म "लगान" में, आमिर खान द्वारा निभाए गए मुख्य किरदार का नाम क्या था?',
      te: '"లగాన్" సినిమాలో, అమీర్ ఖాన్ పోషించిన ప్రధాన పాత్ర పేరు ఏమిటి?',
    },
    options: {
      en: ['Mohan', 'Bhuvan', 'Lakha', 'Deva'],
      hi: ['मोहन', 'भुवन', 'लाखा', 'देवा'],
      te: ['మోహన్', 'భువన్', 'లఖ', 'దేవా'],
    },
    answer: 'Bhuvan',
    category: 'Bollywood',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'Which film is considered India\'s first full-length feature film?',
      hi: 'कौन सी फिल्म भारत की पहली पूरी लंबाई वाली फीचर फिल्म मानी जाती है?',
      te: 'భారతదేశపు మొట్టమొదటి పూర్తి-నిడివి చలనచిత్రంగా ఏ సినిమా పరిగణించబడుతుంది?',
    },
    options: {
      en: ['Alam Ara', 'Raja Harishchandra', 'Kisan Kanya', 'Mother India'],
      hi: ['आलम आरा', 'राजा हरिश्चंद्र', 'किसान कन्या', 'मदर इंडिया'],
      te: ['ఆలం ఆరా', 'రాజా హరిశ్చంద్ర', 'కిసాన్ కన్య', 'మదర్ ఇండియా'],
    },
    answer: 'Raja Harishchandra',
    category: 'Bollywood',
    difficulty: 'Hard',
  },
  {
    question: {
      en: 'Who directed the classic film "Sholay"?',
      hi: 'क्लासिक फिल्म "शोले" का निर्देशन किसने किया था?',
      te: 'క్లాసిక్ చిత్రం "షోలే"కి ఎవరు దర్శకత్వం వహించారు?',
    },
    options: {
      en: ['Yash Chopra', 'Hrishikesh Mukherjee', 'Ramesh Sippy', 'G. P. Sippy'],
      hi: ['यश चोपड़ा', 'हृषिकेश मुखर्जी', 'रमेश सिप्पी', 'जी. पी. सिप्पी'],
      te: ['యశ్ చోప్రా', 'హృషికేశ్ ముఖర్జీ', 'రమేష్ సిप्पी', 'జి. పి. సిप्पी'],
    },
    answer: 'Ramesh Sippy',
    category: 'Bollywood',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'Which actor is known for his role as "Mogambo" in "Mr. India"?',
      hi: '"मिस्टर इंडिया" में "मोगैम्बो" की भूमिका के लिए कौन सा अभिनेता जाना जाता है?',
      te: '"మిస్టర్ ఇండియా"లో "మొగాంబో" పాత్రకు ఏ నటుడు ప్రసిద్ధి చెందాడు?',
    },
    options: {
      en: ['Amjad Khan', 'Amrish Puri', 'Anupam Kher', 'Paresh Rawal'],
      hi: ['अमजद खान', 'अमरीश पुरी', 'अनुपम खेर', 'परेश रावल'],
      te: ['అమ్జద్ ఖాన్', 'అమ్రిష్ పురి', 'అనుపమ్ ఖేర్', 'పరేష్ రావల్'],
    },
    answer: 'Amrish Puri',
    category: 'Bollywood',
    difficulty: 'Easy',
  },
  {
    question: {
      en: 'The song "Jai Ho" from "Slumdog Millionaire" won which prestigious award?',
      hi: '"स्लमडॉग मिलियनेयर" के गीत "जय हो" ने कौन सा प्रतिष्ठित पुरस्कार जीता?',
      te: '"స్లమ్‌డాగ్ మిలియనీర్" నుండి "జై హో" పాటకు ఏ ప్రతిష్టాత్మక అవార్డు లభించింది?',
    },
    options: {
      en: ['Grammy Award', 'Golden Globe Award', 'Academy Award', 'BAFTA Award'],
      hi: ['ग्रैमी पुरस्कार', 'गोल्डन ग्लोब पुरस्कार', 'अकादमी पुरस्कार', 'बाफ्टा पुरस्कार'],
      te: ['గ్రామీ అవార్డు', 'గోల్డెన్ గ్లోబ్ అవార్డు', 'అకాడమీ అవార్డు', 'బాఫ్టా అవార్డు'],
    },
    answer: 'Academy Award',
    category: 'Bollywood',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'Who played the female lead role in the movie "Dilwale Dulhania Le Jayenge"?',
      hi: 'फिल्म "दिलवाले दुल्हनिया ले जाएंगे" में मुख्य महिला भूमिका किसने निभाई?',
      te: '"దిల్వాలే దుల్హనియా లేజాయేంగే" సినిమాలో ప్రధాన మహిళా పాత్రను ఎవరు పోషించారు?',
    },
    options: {
      en: ['Rani Mukerji', 'Kajol', 'Juhi Chawla', 'Madhuri Dixit'],
      hi: ['रानी मुखर्जी', 'काजोल', 'जूही चावला', 'माधुरी दीक्षित'],
      te: ['రాణి ముఖర్జీ', 'కాజోల్', 'జూహీ చావ్లా', 'మాధురీ దీక్షిత్'],
    },
    answer: 'Kajol',
    category: 'Bollywood',
    difficulty: 'Easy',
  },
  {
    question: {
      en: 'What is the name of the film studio founded by Raj Kapoor?',
      hi: 'राज कपूर द्वारा स्थापित फिल्म स्टूडियो का नाम क्या है?',
      te: 'రాజ్ కపూర్ స్థాపించిన ఫిల్మ్ స్టూడియో పేరు ఏమిటి?',
    },
    options: {
      en: ['Filmalaya', 'Navketan Films', 'RK Films', 'Mehboob Studio'],
      hi: ['फिल्मालय', 'नवकेतन फिल्म्स', 'आरके फिल्म्स', 'महबूब स्टूडियो'],
      te: ['ఫిల్మాలయ', 'నవకేతన్ ఫిల్మ్స్', 'ఆర్‌కె ఫిల్మ్స్', 'మెహబూబ్ స్టూడియో'],
    },
    answer: 'RK Films',
    category: 'Bollywood',
    difficulty: 'Hard',
  },
  {
    question: {
      en: 'Who composed the music for the film "Lagaan"?',
      hi: 'फिल्म "लगान" के लिए संगीत किसने तैयार किया था?',
      te: '"లగాన్" చిత్రానికి సంగీతం ఎవరు సమకూర్చారు?',
    },
    options: {
      en: ['Anu Malik', 'Jatin-Lalit', 'Shankar-Ehsaan-Loy', 'A. R. Rahman'],
      hi: ['अनु मलिक', 'जतिन-ललित', 'शंकर-एहसान-लॉय', 'ए. आर. रहमान'],
      te: ['అను మాలిక్', 'జతిన్-లలిత్', 'శంకర్-ఎహసాన్-లాయ్', 'ఎ. ఆర్. రెహమాన్'],
    },
    answer: 'A. R. Rahman',
    category: 'Bollywood',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'Which movie is based on the life of cricketer M.S. Dhoni?',
      hi: 'कौन सी फिल्म क्रिकेटर एम.एस. धोनी के जीवन पर आधारित है?',
      te: 'క్రికెటర్ ఎం.ఎస్. ధోనీ జీవితం ఆధారంగా ఏ సినిమా తీశారు?',
    },
    options: {
      en: ['83', 'M.S. Dhoni: The Untold Story', 'Azhar', 'Sachin: A Billion Dreams'],
      hi: ['83', 'एम.एस. धोनी: द अनटोल्ड स्टोरी', 'अजहर', 'सचिन: ए बिलियन ड्रीम्स'],
      te: ['83', 'ఎం.ఎస్. ధోని: ది అన్‌టోల్డ్ స్టోరీ', 'అజహర్', 'సచిన్: ఎ బిలియన్ డ్రీమ్స్'],
    },
    answer: 'M.S. Dhoni: The Untold Story',
    category: 'Bollywood',
    difficulty: 'Easy',
  },
  {
    question: {
      en: 'Who is the director of the "Baahubali" film series?',
      hi: '"बाहुबली" फिल्म श्रृंखला के निर्देशक कौन हैं?',
      te: '"బాహుబలి" చిత్ర సిరీస్ దర్శకుడు ఎవరు?',
    },
    options: {
      en: ['Shankar', 'S. S. Rajamouli', 'Mani Ratnam', 'Puri Jagannadh'],
      hi: ['शंकर', 'एस. एस. राजामौली', 'मणि रत्नम', 'पुरी जगन्नाध'],
      te: ['శంకర్', 'ఎస్. ఎస్. రాజమౌళి', 'మణిరత్నం', 'పూరి జగన్నాథ్'],
    },
    answer: 'S. S. Rajamouli',
    category: 'Bollywood',
    difficulty: 'Medium',
  },
  // Science
  {
    question: {
      en: 'Who is known as the father of the Indian space program?',
      hi: 'भारतीय अंतरिक्ष कार्यक्रम का जनक किसे कहा जाता है?',
      te: 'భారత అంతరిక్ష కార్యక్రమానికి పితామహుడిగా ఎవరిని పిలుస్తారు?',
    },
    options: {
      en: ['C.V. Raman', 'Homi J. Bhabha', 'Vikram Sarabhai', 'A.P.J. Abdul Kalam'],
      hi: ['सी.वी. रमन', 'होमी जे. भाभा', 'विक्रम साराभाई', 'ए.पी.जे. अब्दुल कलाम'],
      te: ['సి.వి. రామన్', 'హోమి జె. భాభా', 'విక్రమ్ సారాభాయ్', 'ఎ.పి.జె. అబ్దుల్ కలాం'],
    },
    answer: 'Vikram Sarabhai',
    category: 'Science',
    difficulty: 'Medium',
  },
  {
    question: {
      en: "India's first satellite was named after which astronomer?",
      hi: 'भारत के पहले उपग्रह का नाम किस खगोलशास्त्री के नाम पर रखा गया था?',
      te: 'భారతదేశం యొక్క మొదటి ఉపగ్రహానికి ఏ ఖగోళ శాస్త్రవేత్త పేరు పెట్టారు?',
    },
    options: {
      en: ['Brahmagupta', 'Bhaskara II', 'Varahamihira', 'Aryabhata'],
      hi: ['ब्रह्मगुप्त', 'भास्कर द्वितीय', 'वराहमिहिर', 'आर्यभट्ट'],
      te: ['బ్రహ్మగుప్తుడు', 'భాస్కరుడు II', 'వరాహమిహిరుడు', 'ఆర్యభట్ట'],
    },
    answer: 'Aryabhata',
    category: 'Science',
    difficulty: 'Hard',
  },
  // Technology
  {
    question: {
        en: 'Which Indian city is known as the "Silicon Valley of India"?',
        hi: 'किस भारतीय शहर को "भारत की सिलिकॉन वैली" के रूप में जाना जाता है?',
        te: '"భారతదేశపు సిలికాన్ వ్యాలీ" అని ఏ భారతీయ నగరాన్ని పిలుస్తారు?',
    },
    options: {
        en: ['Hyderabad', 'Pune', 'Bengaluru', 'Chennai'],
        hi: ['हैदराबाद', 'पुणे', 'बेंगलुरु', 'चेन्नई'],
        te: ['హైదరాబాద్', 'పూణే', 'బెంగళూరు', 'చెన్నై'],
    },
    answer: 'Bengaluru',
    category: 'Technology',
    difficulty: 'Easy',
  },
  {
    question: {
        en: 'What does UPI stand for in the context of digital payments in India?',
        hi: 'भारत में डिजिटल भुगतान के संदर्भ में UPI का क्या अर्थ है?',
        te: 'భారతదేశంలో డిజిటల్ చెల్లింపుల సందర్భంలో UPI అంటే ఏమిటి?',
    },
    options: {
        en: ['Unique Payment Interface', 'Unified Payments Interface', 'Universal Payment Identity', 'Union Payment Integration'],
        hi: ['यूनिक पेमेंट इंटरफ़ेस', 'यूनिफाइड पेमेंट्स इंटरफ़ेस', 'यूनिवर्सल पेमेंट आइडेंटिटी', 'यूनियन पेमेंट इंटीग्रेशन'],
        te: ['యూనిక్ పేమెంట్ ఇంటర్‌ఫేస్', 'యూనిఫైడ్ పేమెంట్స్ ఇంటర్‌ఫేస్', 'యూనివర్సల్ పేమెంట్ ఐడెంటిటీ', 'యూనియన్ పేమెంట్ ఇంటిగ్రేషన్'],
    },
    answer: 'Unified Payments Interface',
    category: 'Technology',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'What is the full form of ISRO?',
      hi: 'इसरो (ISRO) का पूरा नाम क्या है?',
      te: 'ఇస్రో (ISRO) పూర్తి రూపం ఏమిటి?',
    },
    options: {
      en: ['Indian Satellite Research Organisation', 'Indian Space Research Organisation', 'International Space Research Organisation', 'Indian Space Rocket Organisation'],
      hi: ['इंडियन सैटेलाइट रिसर्च ऑर्गनाइजेशन', 'इंडियन स्पेस रिसर्च ऑर्गनाइजेशन', 'इंटरनेशनल स्पेस रिसर्च ऑर्गनाइजेशन', 'इंडियन स्पेस रॉकेट ऑर्गनाइजेशन'],
      te: ['ఇండియన్ శాటిలైట్ రీసెర్చ్ ఆర్గనైజేషన్', 'ఇండియన్ స్పేస్ రీసెర్చ్ ఆర్గనైజేషన్', 'ఇంటర్నేషనల్ స్పేస్ రీసెర్చ్ ఆర్గనైజేషన్', 'ఇండియన్ స్పేస్ రాకెట్ ఆర్గనైజేషన్'],
    },
    answer: 'Indian Space Research Organisation',
    category: 'Technology',
    difficulty: 'Easy',
  },
  {
    question: {
      en: 'India\'s first supercomputer was named?',
      hi: 'भारत के पहले सुपर कंप्यूटर का नाम क्या था?',
      te: 'భారతదేశపు మొట్టమొదటి సూపర్ కంప్యూటర్ పేరు ఏమిటి?',
    },
    options: {
      en: ['SAGA-220', 'EKA', 'PARAM 8000', 'AADITYA'],
      hi: ['सागा-220', 'एका', 'परम 8000', 'आदित्य'],
      te: ['సాగా-220', 'ఏకా', 'పరం 8000', 'ఆదిత్య'],
    },
    answer: 'PARAM 8000',
    category: 'Technology',
    difficulty: 'Hard',
  },
  {
    question: {
      en: 'Which company launched India\'s first mobile phone service?',
      hi: 'किस कंपनी ने भारत की पहली मोबाइल फोन सेवा शुरू की?',
      te: 'భారతదేశపు మొట్టమొదటి మొబైల్ ఫోన్ సేవను ఏ కంపెనీ ప్రారంభించింది?',
    },
    options: {
      en: ['Airtel', 'Modi Telstra', 'BPL Mobile', 'Reliance'],
      hi: ['एयरटेल', 'मोदी टेल्स्ट्रा', 'बीपीएल मोबाइल', 'रिलायंस'],
      te: ['ఎయిర్‌టెల్', 'మోడీ టెల్స్ట్రా', 'బిపిఎల్ మొబైల్', 'రిలయన్స్'],
    },
    answer: 'Modi Telstra',
    category: 'Technology',
    difficulty: 'Hard',
  },
  {
    question: {
      en: 'Infosys was founded by N. R. Narayana Murthy and six others in which city?',
      hi: 'इन्फोसिस की स्थापना एन. आर. नारायण मूर्ति और छह अन्य लोगों ने किस शहर में की थी?',
      te: 'ఇన్ఫోసిస్‌ను ఎన్. ఆర్. నారాయణ మూర్తి మరియు మరో ఆరుగురు ఏ నగరంలో స్థాపించారు?',
    },
    options: {
      en: ['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad'],
      hi: ['बेंगलुरु', 'मुंबई', 'पुणे', 'हैदराबाद'],
      te: ['బెంగళూరు', 'ముంబై', 'పుణె', 'హైదరాబాద్'],
    },
    answer: 'Pune',
    category: 'Technology',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'What does the \'B\' in the BHIM app stand for?',
      hi: 'भीम (BHIM) ऐप में \'B\' का क्या अर्थ है?',
      te: 'భీమ్ (BHIM) యాప్‌లో \'B\' అంటే ఏమిటి?',
    },
    options: {
      en: ['Bharat', 'Bank', 'Bonus', 'Business'],
      hi: ['भारत', 'बैंक', 'बोनस', 'बिजनेस'],
      te: ['భారత్', 'బ్యాంక్', 'బోనస్', 'బిజినెస్'],
    },
    answer: 'Bharat',
    category: 'Technology',
    difficulty: 'Easy',
  },
  {
    question: {
      en: 'India\'s Mars Orbiter Mission is also known as?',
      hi: 'भारत के मार्स ऑर्बिटर मिशन को और किस नाम से जाना जाता है?',
      te: 'భారతదేశపు మార్స్ ఆర్బిటర్ మిషన్‌ను ఏమని కూడా పిలుస్తారు?',
    },
    options: {
      en: ['Chandrayaan', 'Gaganyaan', 'Mangalyaan', 'Aditya-L1'],
      hi: ['चंद्रयान', 'गगनयान', 'मंगलयान', 'आदित्य-एल1'],
      te: ['చంద్రయాన్', 'గగన్‌యాన్', 'మంగళ్‌యాన్', 'ఆదిత్య-ఎల్1'],
    },
    answer: 'Mangalyaan',
    category: 'Technology',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'The Aadhar card system is based on which type of identification?',
      hi: 'आधार कार्ड प्रणाली किस प्रकार की पहचान पर आधारित है?',
      te: 'ఆధార్ కార్డ్ వ్యవస్థ ఏ రకమైన గుర్తింపుపై ఆధారపడి ఉంటుంది?',
    },
    options: {
      en: ['Digital Signature', 'Biometric', 'Password', 'Geotagging'],
      hi: ['डिजिटल हस्ताक्षर', 'बायोमेट्रिक', 'पासवर्ड', 'जियोटैगिंग'],
      te: ['డిజిటల్ సంతకం', 'బయోమెట్రిక్', 'పాస్‌వర్డ్', 'జియోట్యాగింగ్'],
    },
    answer: 'Biometric',
    category: 'Technology',
    difficulty: 'Easy',
  },
  {
    question: {
      en: 'Which Indian company is a major manufacturer of electric vehicles?',
      hi: 'कौन सी भारतीय कंपनी इलेक्ट्रिक वाहनों की एक प्रमुख निर्माता है?',
      te: 'ఎలక్ట్రిక్ వాహనాల ప్రధాన తయారీదారు అయిన భారతీయ కంపెనీ ఏది?',
    },
    options: {
      en: ['Mahindra Electric', 'Tata Motors', 'Ola Electric', 'Ather Energy'],
      hi: ['महिंद्रा इलेक्ट्रिक', 'टाटा मोटर्स', 'ओला इलेक्ट्रिक', 'एथर एनर्जी'],
      te: ['మహీంద్రా ఎలక్ట్రిక్', 'టాటా మోటార్స్', 'ఓలా ఎలక్ట్రిక్', 'ఏథర్ ఎనర్జీ'],
    },
    answer: 'Tata Motors',
    category: 'Technology',
    difficulty: 'Medium',
  },
  // History
  {
    question: {
      en: 'Who was the first Prime Minister of India?',
      hi: 'भारत के पहले प्रधानमंत्री कौन थे?',
      te: 'భారతదేశపు మొదటి ప్రధానమంత్రి ఎవరు?',
    },
    options: {
      en: ['Sardar Patel', 'Mahatma Gandhi', 'Jawaharlal Nehru', 'Dr. Rajendra Prasad'],
      hi: ['सरदार पटेल', 'महात्मा गांधी', 'जवाहरलाल नेहरू', 'डॉ. राजेंद्र प्रसाद'],
      te: ['సర్దార్ పటేల్', 'మహాత్మా గాంధీ', 'జవహర్‌లాల్ నెహ్రూ', 'డా. రాజేంద్ర ప్రసాద్'],
    },
    answer: 'Jawaharlal Nehru',
    category: 'History',
    difficulty: 'Easy',
  },
  {
    question: {
        en: 'The Taj Mahal was built by which Mughal emperor?',
        hi: 'ताजमहल किस मुगल सम्राट ने बनवाया था?',
        te: 'తాజ్ మహల్‌ను ఏ మొఘల్ చక్రవర్తి నిర్మించారు?',
    },
    options: {
        en: ['Akbar', 'Jahangir', 'Shah Jahan', 'Aurangzeb'],
        hi: ['अकबर', 'जहाँगीर', 'शाहजहाँ', 'औरंगजेब'],
        te: ['అక్బర్', 'జహంగీర్', 'షాజహాన్', 'ఔరంగజేబు'],
    },
    answer: 'Shah Jahan',
    category: 'History',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'In which year did India gain independence from British rule?',
      hi: 'भारत को ब्रिटिश शासन से किस वर्ष स्वतंत्रता मिली?',
      te: 'బ్రిటిష్ పాలన నుండి భారతదేశానికి ఏ సంవత్సరంలో స్వాతంత్ర్యం వచ్చింది?',
    },
    options: {
      en: ['1945', '1947', '1950', '1952'],
      hi: ['1945', '1947', '1950', '1952'],
      te: ['1945', '1947', '1950', '1952'],
    },
    answer: '1947',
    category: 'History',
    difficulty: 'Easy',
  },
  {
    question: {
      en: 'Who founded the Maurya Empire?',
      hi: 'मौर्य साम्राज्य की स्थापना किसने की?',
      te: 'మౌర్య సామ్రాజ్యాన్ని ఎవరు స్థాపించారు?',
    },
    options: {
      en: ['Ashoka', 'Chandragupta Maurya', 'Samudragupta', 'Bindusara'],
      hi: ['अशोक', 'चंद्रगुप्त मौर्य', 'समुद्रगुप्त', 'बिन्दुसार'],
      te: ['అశోకుడు', 'చంద్రగుప్త మౌర్యుడు', 'సముద్రగుప్తుడు', 'బిందుసారుడు'],
    },
    answer: 'Chandragupta Maurya',
    category: 'History',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'The Battle of Plassey was fought in which year?',
      hi: 'प्लासी का युद्ध किस वर्ष लड़ा गया था?',
      te: 'ప్లాసీ యుద్ధం ఏ సంవత్సరంలో జరిగింది?',
    },
    options: {
      en: ['1757', '1764', '1857', '1776'],
      hi: ['1757', '1764', '1857', '1776'],
      te: ['1757', '1764', '1857', '1776'],
    },
    answer: '1757',
    category: 'History',
    difficulty: 'Hard',
  },
  {
    question: {
      en: 'Who wrote the \'Arthashastra\'?',
      hi: '\'अर्थशास्त्र\' किसने लिखा?',
      te: '‘అర్థశాస్త్రం’ ఎవరు రాశారు?',
    },
    options: {
      en: ['Kalidasa', 'Kautilya', 'Panini', 'Patanjali'],
      hi: ['कालिदास', 'कौटिल्य', 'पाणिनि', 'पतंजलि'],
      te: ['కాళిదాసు', 'కౌటిల్యుడు', 'పాణిని', 'పతంజలి'],
    },
    answer: 'Kautilya',
    category: 'History',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'The Indus Valley Civilization flourished around which river?',
      hi: 'सिंधु घाटी सभ्यता किस नदी के आसपास फली-फूली?',
      te: 'సింధు లోయ నాగరికత ఏ నది చుట్టూ వృద్ధి చెందింది?',
    },
    options: {
      en: ['Ganges', 'Yamuna', 'Brahmaputra', 'Indus'],
      hi: ['गंगा', 'यमुना', 'ब्रह्मपुत्र', 'सिंधु'],
      te: ['గంగా', 'యమునా', 'బ్రహ్మపుత్ర', 'సింధు'],
    },
    answer: 'Indus',
    category: 'History',
    difficulty: 'Easy',
  },
  {
    question: {
      en: 'Who was the last Viceroy of British India?',
      hi: 'ब्रिटिश भारत के अंतिम वायसराय कौन थे?',
      te: 'బ్రిటిష్ ఇండియా చివరి వైస్రాయ్ ఎవరు?',
    },
    options: {
      en: ['Lord Curzon', 'Lord Mountbatten', 'Lord Irwin', 'Lord Dalhousie'],
      hi: ['लॉर्ड कर्जन', 'लॉर्ड माउंटबेटन', 'लॉर्ड इरविन', 'लॉर्ड डलहौजी'],
      te: ['లార్డ్ కర్జన్', 'లార్డ్ మౌంట్‌బాటెన్', 'లార్డ్ ఇర్విన్', 'లార్డ్ డల్హౌసీ'],
    },
    answer: 'Lord Mountbatten',
    category: 'History',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'The Quit India Movement was launched by Mahatma Gandhi in which year?',
      hi: 'भारत छोड़ो आंदोलन महात्मा गांधी द्वारा किस वर्ष शुरू किया गया था?',
      te: 'క్విట్ ఇండియా ఉద్యమాన్ని మహాత్మా గాంధీ ఏ సంవత్సరంలో ప్రారంభించారు?',
    },
    options: {
      en: ['1930', '1942', '1945', '1920'],
      hi: ['1930', '1942', '1945', '1920'],
      te: ['1930', '1942', '1945', '1920'],
    },
    answer: '1942',
    category: 'History',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'Ashoka the Great belonged to which dynasty?',
      hi: 'अशोक महान किस राजवंश से संबंधित थे?',
      te: 'అశోక చక్రవర్తి ఏ రాజవంశానికి చెందినవాడు?',
    },
    options: {
      en: ['Gupta Dynasty', 'Kushan Dynasty', 'Mauryan Dynasty', 'Chola Dynasty'],
      hi: ['गुप्त राजवंश', 'कुषाण राजवंश', 'मौर्य राजवंश', 'चोल राजवंश'],
      te: ['గుప్త రాజవంశం', 'కుషాన్ రాజవంశం', 'మౌర్య రాజవంశం', 'చోళ రాజవంశం'],
    },
    answer: 'Mauryan Dynasty',
    category: 'History',
    difficulty: 'Easy',
  },
  {
    question: {
      en: 'Who was the founder of the Mughal Empire in India?',
      hi: 'भारत में मुगल साम्राज्य का संस्थापक कौन था?',
      te: 'భారతదేశంలో మొఘల్ సామ్రాజ్య స్థాపకుడు ఎవరు?',
    },
    options: {
      en: ['Humayun', 'Akbar', 'Babur', 'Jahangir'],
      hi: ['हुमायूँ', 'अकबर', 'बाबर', 'जहाँगीर'],
      te: ['హుమాయున్', 'అక్బర్', 'బాబర్', 'జహంగీర్'],
    },
    answer: 'Babur',
    category: 'History',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'The Jallianwala Bagh massacre took place in which city?',
      hi: 'जलियाँवाला बाग हत्याकांड किस शहर में हुआ था?',
      te: 'జలియన్‌వాలా బాగ్ ఊచకోత ఏ నగరంలో జరిగింది?',
    },
    options: {
      en: ['Lahore', 'Delhi', 'Amritsar', 'Kolkata'],
      hi: ['लाहौर', 'दिल्ली', 'अमृतसर', 'कोलकाता'],
      te: ['లాహోర్', 'ఢిల్లీ', 'అమృత్‌సర్', 'కోల్‌కతా'],
    },
    answer: 'Amritsar',
    category: 'History',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'Who is known as the \'Iron Man of India\'?',
      hi: '\'भारत के लौह पुरुष\' के रूप में किसे जाना जाता है?',
      te: '‘భారత ఉక్కు మనిషి’ అని ఎవరిని పిలుస్తారు?',
    },
    options: {
      en: ['Jawaharlal Nehru', 'Sardar Vallabhbhai Patel', 'Subhas Chandra Bose', 'Mahatma Gandhi'],
      hi: ['जवाहरलाल नेहरू', 'सरदार वल्लभभाई पटेल', 'सुभाष चंद्र बोस', 'महात्मा गांधी'],
      te: ['జవహర్‌లాల్ నెహ్రూ', 'సర్దార్ వల్లభాయ్ పటేల్', 'సుభాష్ చంద్రబోస్', 'మహాత్మా గాంధీ'],
    },
    answer: 'Sardar Vallabhbhai Patel',
    category: 'History',
    difficulty: 'Easy',
  },
  // Geography
  {
    question: {
        en: 'Which is the longest river in India?',
        hi: 'भारत की सबसे लंबी नदी कौन सी है?',
        te: 'భారతదేశంలో పొడవైన నది ఏది?',
    },
    options: {
        en: ['Yamuna', 'Ganges', 'Brahmaputra', 'Godavari'],
        hi: ['यमुना', 'गंगा', 'ब्रह्मपुत्र', 'गोदावरी'],
        te: ['యమునా', 'గంగా', 'బ్రహ్మపుత్ర', 'గోదావరి'],
    },
    answer: 'Ganges',
    category: 'Geography',
    difficulty: 'Medium',
  },
  {
    question: {
      en: 'Which Indian state is known as the "Land of Five Rivers"?',
      hi: 'किस भारतीय राज्य को "पांच नदियों की भूमि" के रूप में जाना जाता है?',
      te: '"ఐదు నదుల భూమి" అని ఏ భారత రాష్ట్రాన్ని పిలుస్తారు?',
    },
    options: {
      en: ['Haryana', 'Gujarat', 'Punjab', 'Rajasthan'],
      hi: ['हरियाणा', 'गुजरात', 'पंजाब', 'राजस्थान'],
      te: ['హర్యానా', 'గుజరాత్', 'పంజాబ్', 'రాజస్థాన్'],
    },
    answer: 'Punjab',
    category: 'Geography',
    difficulty: 'Medium',
  },
  // Current Affairs
  {
    question: {
        en: 'Who is the current President of India (as of 2024)?',
        hi: 'भारत के वर्तमान राष्ट्रपति (2024 तक) कौन हैं?',
        te: 'భారతదేశ ప్రస్తుత రాష్ట్రపతి (2024 నాటికి) ఎవరు?',
    },
    options: {
        en: ['Ram Nath Kovind', 'Pranab Mukherjee', 'Droupadi Murmu', 'Narendra Modi'],
        hi: ['राम नाथ कोविंद', 'प्रणब मुखर्जी', 'द्रौपदी मुर्मू', 'नरेंद्र मोदी'],
        te: ['రామ్ నాథ్ కోవింద్', 'ప్రణబ్ ముఖర్జీ', 'ద్రౌపది ముర్ము', 'నరేంద్ర మోడీ'],
    },
    answer: 'Droupadi Murmu',
    category: 'CurrentAffairs',
    difficulty: 'Medium',
  },
  {
    question: {
        en: "What is the name of India's lunar exploration mission that successfully landed on the moon's south pole in 2023?",
        hi: '2023 में चंद्रमा के दक्षिणी ध्रुव पर सफलतापूर्वक उतरने वाले भारत के चंद्र अन्वेषण मिशन का नाम क्या है?',
        te: "2023లో చంద్రుని దక్షిణ ధ్రువంపై విజయవంతంగా ల్యాండ్ అయిన భారతదేశపు చంద్ర అన్వేషణ మిషన్ పేరు ఏమిటి?",
    },
    options: {
        en: ['Mangalyaan 2', 'Gaganyaan', 'Chandrayaan-3', 'Aditya-L1'],
        hi: ['मंगलयान 2', 'गगनयान', 'चंद्रयान-3', 'आदित्य-एल1'],
        te: ['మంగళయాన్ 2', 'గగన్‌యాన్', 'చంద్రయాన్-3', 'ఆదిత్య-ఎల్1'],
    },
    answer: 'Chandrayaan-3',
    category: 'CurrentAffairs',
    difficulty: 'Hard',
  },
];