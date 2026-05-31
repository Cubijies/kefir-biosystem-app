import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const RECIPES = [
  {id:"A1",family:"A",name:"Desayuno andino estable",short:"Energía sostenida sin bajón",goal:"Energía de 4–5 h, sin pico glucémico",
   objectives:["energia","enfoque","glucosa"],meal:"desayuno",kcal:310,protein:12,carbs:48,fat:9,
   base:"kéfir",time:"12h F2",tags:["diabéticos","sarcopenia"],
   contraindications:[],
   f1:"250 ml kéfir de leche fermentado 24 h",
   f2:[{i:"Avena tostada",q:"15 g",p:"Tostada en sartén 5 min, enfriada"},{i:"Máchica",q:"10 g",p:"Lista para usar"},{i:"Miel cruda multiflora",q:"5 g",p:"Disolver con cuchara de madera"}],
   f2time:"12 h a 20–22 °C, frasco cerrado",
   fresh:["60 g plátano maduro en rodajas finas","40 g mortiño fresco o congelado","8 g sacha inchi tostado picado grueso","(Opcional) 1 hoja de toronjil fresca"],
   why:"La avena tostada y predigerida en F2 libera glucosa lentamente. La máchica aporta β-glucanos. El sacha inchi equilibra omega-6/omega-3. Resultado: glucemia estable y energía hasta el almuerzo.",
   shopping:{"Kéfir (leche)":250,"Avena tostada":15,"Máchica":10,"Miel cruda":5,"Plátano maduro":60,"Mortiño":40,"Sacha inchi":8}},

  {id:"A2",family:"A",name:"Kombucha de la mañana",short:"Despertar suave sin lactosa",goal:"Despertar suave, control glucémico",
   objectives:["glucosa","energia","digestión"],meal:"desayuno",kcal:45,protein:0.5,carbs:11,fat:0,
   base:"kombucha",time:"Sin F2",tags:["sin lactosa","diabéticos"],
   contraindications:["embarazo","niños","hipertensión severa","histaminosis"],
   f1:"250 ml kombucha de té negro casera (9–12 días)",f2:[],f2time:"Sin F2",
   fresh:["4 cubos de hielo","50 ml jugo fresco de naranjilla colado","3 hojas de toronjil fresco","5 ml jarabe de yacón (opcional)","1 rodaja de limón"],
   why:"La kombucha tiene ácido acético + ácido glucónico que enlentecen el vaciamiento gástrico. Los polifenoles del té son antioxidantes cardioprotectores.",
   shopping:{"Kombucha casera":250,"Naranjilla":50,"Toronjil":3,"Jarabe de yacón":5}},

  {id:"A3",family:"A",name:"Energía pre-caminata",short:"Pre-actividad física",goal:"Energía rápida + sostenida para 1–2 h de actividad",
   objectives:["energia","musculo","enfoque"],meal:"desayuno",kcal:385,protein:13,carbs:70,fat:7,
   base:"kéfir",time:"10h F2",tags:["activos","pre-ejercicio"],
   contraindications:[],
   f1:"250 ml kéfir 24 h",
   f2:[{i:"Avena tostada",q:"20 g",p:""},{i:"Miel cruda",q:"8 g",p:""}],f2time:"10 h",
   fresh:["80 g plátano maduro","30 g amaranto reventado","30 ml infusión fría de hierba luisa"],
   why:"Carbohidratos disponibles (azúcares del plátano y miel) + carbohidratos de digestión gradual (avena F2 y amaranto). Dos curvas que se solapan dando energía sostenida.",
   shopping:{"Kéfir (leche)":250,"Avena tostada":20,"Miel cruda":8,"Plátano maduro":80,"Amaranto reventado":30,"Hierba luisa":2}},

  {id:"B1",family:"B",name:"Bowl andino del calcio",short:"Densidad ósea y prevención osteopenia",goal:"Densidad mineral ósea, prevención osteopenia/osteoporosis",
   objectives:["huesos","articulaciones","musculo"],meal:"desayuno",kcal:355,protein:28,carbs:38,fat:11,
   base:"yogur griego",time:"12–24h F2",tags:["post-menopausia","hombres>70","calcio"],
   contraindications:["no combinar con café en misma hora","no combinar con espinaca"],
   f1:"200 g yogur griego colado 8 h",
   f2:[{i:"Cacao puro en polvo",q:"5 g",p:"Sin alcalinizar"},{i:"Miel cruda",q:"3 g",p:""}],f2time:"12–24 h en nevera",
   fresh:["15 g amaranto reventado","8 g ajonjolí negro tostado","20 g higos secos andinos picados","10 g colágeno hidrolizado en polvo","5 g miel cruda (opcional)"],
   why:"Tres fuentes de calcio biodisponible: yogur griego, ajonjolí y amaranto. Proteína de 28 g asegura la matriz orgánica del hueso. El cacao aporta cobre y magnesio. Combinar con 15 min de sol matinal.",
   shopping:{"Yogur griego":200,"Cacao puro":5,"Miel cruda":3,"Amaranto reventado":15,"Ajonjolí negro":8,"Higos secos":20,"Colágeno hidrolizado":10}},

  {id:"B2",family:"B",name:"Kéfir K2",short:"Fermentación extendida para hueso y corazón",goal:"Maximizar K2 endógena, dirigir calcio al hueso",
   objectives:["huesos","corazón"],meal:"desayuno",kcal:390,protein:18,carbs:32,fat:18,
   base:"kéfir",time:"8h F2",tags:["riesgo cardiovascular","baja densidad ósea"],
   contraindications:["anticoagulantes","warfarina","acenocumarol"],
   f1:"250 ml kéfir fermentado 28–30 h (más ácido)",
   f2:[{i:"Cebada perlada cocida y fría",q:"20 g",p:""},{i:"Miel cruda",q:"5 g",p:""}],f2time:"8 h frasco semi-cerrado",
   fresh:["1 yema de huevo cruda campera","5 g perejil fresco picado fino","5 ml aceite de sacha inchi"],
   why:"La K2 es liposoluble: sin grasa no se absorbe. La fermentación extendida maximiza la producción de menaquinonas. El perejil aporta K1 que el cuerpo puede convertir a MK-4.",
   shopping:{"Kéfir (leche)":250,"Cebada perlada":20,"Miel cruda":5,"Huevo campero":1,"Perejil fresco":5,"Aceite de sacha inchi":5}},

  {id:"B3",family:"B",name:"Avena, sésamo y mortiño",short:"Hueso + corazón en una fórmula",goal:"Hueso + corazón en una sola fórmula",
   objectives:["huesos","corazón","digestión"],meal:"desayuno",kcal:390,protein:20,carbs:45,fat:13,
   base:"kéfir+yogur",time:"10h F2",tags:["calcio","beta-glucanos"],contraindications:[],
   f1:"200 ml kéfir + 100 g yogur griego mezclados",
   f2:[{i:"Avena tostada",q:"20 g",p:""},{i:"Panela rallada",q:"5 g",p:""}],f2time:"10 h",
   fresh:["10 g ajonjolí negro tostado","40 g mortiño","8 g linaza molida en el momento","2 hojas de hierba luisa"],
   why:"Combinación de β-glucanos (avena, baja LDL), calcio mineralizado (ajonjolí + yogur), antocianinas (mortiño) y lignanos + omega-3 (linaza fresca).",
   shopping:{"Kéfir (leche)":200,"Yogur griego":100,"Avena tostada":20,"Panela":5,"Ajonjolí negro":10,"Mortiño":40,"Linaza":8}},

  {id:"C1",family:"C",name:"Beta-glucano cardio",short:"La receta cuasi-medicamento para LDL",goal:"Bajar colesterol LDL, dosis terapéutica de β-glucanos",
   objectives:["corazón","glucosa","peso"],meal:"desayuno",kcal:350,protein:14,carbs:50,fat:10,
   base:"kéfir",time:"12–14h F2",tags:["dislipidemia","colesterol"],
   contraindications:["requiere control médico"],
   f1:"250 ml kéfir 24 h",
   f2:[{i:"Cebada perlada cocida y enfriada",q:"40 g",p:"≈ 3 g β-glucanos"},{i:"Miel cruda",q:"5 g",p:""}],f2time:"12–14 h",
   fresh:["60 g mora andina","10 g linaza recién molida","pizca de canela Ceylon 0.5 g"],
   why:"Los β-glucanos forman un gel viscoso en el intestino que captura ácidos biliares y colesterol. Tu hígado usa colesterol sanguíneo para sintetizar nuevos → baja el LDL. Estudios: 5–10 % reducción con 3 g/día.",
   shopping:{"Kéfir (leche)":250,"Cebada perlada":40,"Miel cruda":5,"Mora andina":60,"Linaza":10,"Canela Ceylon":1}},

  {id:"C2",family:"C",name:"Kombucha verde de mora",short:"Antioxidantes vasculares y presión",goal:"Antioxidantes vasculares, presión arterial",
   objectives:["corazón","glucosa"],meal:"cualquier",kcal:80,protein:0.5,carbs:18,fat:0,
   base:"kombucha",time:"3 días F2",tags:["hipertensión leve","colesterol"],
   contraindications:["embarazo","niños"],
   f1:"250 ml kombucha de té verde (9–12 días)",
   f2:[{i:"Mora andina machacada",q:"60 g",p:""},{i:"Jengibre rallado",q:"5 g",p:"Opcional, omitir si piel sensible"}],f2time:"3 días en botella swing-top, purgar cada 12 h",
   fresh:["Filtrar al servir","Hielo","1 rama de hierba luisa"],
   why:"Catequinas del té verde (EGCG): protectores endoteliales. Antocianinas de la mora: vasodilatadoras. Ácidos orgánicos de la kombucha: efecto hipotensor suave.",
   shopping:{"Kombucha casera":250,"Mora andina":60,"Jengibre":5}},

  {id:"D1",family:"D",name:"Bowl neuroprotector andino",short:"Cognición, memoria y BDNF",goal:"Función cognitiva, memoria, BDNF",
   objectives:["cerebro","memoria","enfoque"],meal:"desayuno",kcal:410,protein:22,carbs:32,fat:22,
   base:"yogur griego",time:"12–24h F2",tags:["cognición","memoria"],
   contraindications:["no después de las 15:00 (cacao y maca estimulan)"],
   f1:"200 g yogur griego",
   f2:[{i:"Cacao puro",q:"5 g",p:"Sin alcalinizar"}],f2time:"12–24 h en nevera",
   fresh:["60 g mortiño","15 g nueces activadas picadas","5 ml aceite de sacha inchi","5 g miel cruda","1 g maca gelatinizada (opcional, empezar aquí)"],
   why:"Antocianinas del mortiño cruzan la barrera hematoencefálica y ↑ BDNF. Flavanoles del cacao mejoran flujo cerebral. Omega-3 de nueces y sacha inchi para membranas neuronales.",
   shopping:{"Yogur griego":200,"Cacao puro":5,"Mortiño":60,"Nueces":15,"Aceite de sacha inchi":5,"Miel cruda":5,"Maca gelatinizada":1}},

  {id:"D2",family:"D",name:"Vaso del buen dormir",short:"Conciliar el sueño profundo",goal:"Conciliar sueño, calidad de sueño profundo",
   objectives:["sueño","ansiedad","cerebro"],meal:"cena",kcal:240,protein:18,carbs:28,fat:6,
   base:"yogur griego",time:"24h F2",tags:["insomnio","sueño"],
   contraindications:["no con kombucha ni kéfir muy fermentado en esta misma noche"],
   f1:"200 g yogur griego (mejor base nocturna que kéfir)",
   f2:[{i:"Cacao puro",q:"3 g",p:"Muy pequeña cantidad"}],f2time:"24 h en nevera",
   fresh:["40 g plátano maduro machacado","8 g semillas de zambo tostadas picadas","30 ml infusión fría de toronjil + manzanilla","5 g miel cruda"],
   why:"Triptófano del yogur → 5-HTP → serotonina → melatonina. Magnesio de semillas de zambo: cofactor de GABA. La miel facilita transporte de triptófano al cerebro. Tomar 90 min antes de dormir.",
   shopping:{"Yogur griego":200,"Cacao puro":3,"Plátano maduro":40,"Semillas de zambo":8,"Toronjil":2,"Manzanilla":2,"Miel cruda":5}},

  {id:"E1",family:"E",name:"Yogur proteína post-caminata",short:"Activar síntesis muscular post-ejercicio",goal:"Activar síntesis muscular, alcanzar umbral de leucina ≥ 2.5 g",
   objectives:["musculo","huesos","peso"],meal:"cualquier",kcal:440,protein:32,carbs:50,fat:8,
   base:"yogur griego",time:"Sin F2",tags:["sarcopenia","post-ejercicio","ganancia muscular"],
   contraindications:["tomar dentro de 60 min después del ejercicio"],
   f1:"250 g yogur griego",f2:[],f2time:"Sin F2",
   fresh:["20 g amaranto reventado","30 g quinua cocida fría","10 g colágeno hidrolizado","50 g mora andina","5 g miel cruda","pizca de canela Ceylon"],
   why:"Yogur griego aporta 22 g proteína completa. Leucina ≥ 2.5 g activa mTOR → síntesis muscular. Quinua + amaranto aportan los 9 aminoácidos esenciales. Carbohidratos reponen glucógeno.",
   shopping:{"Yogur griego":250,"Amaranto reventado":20,"Quinua cocida":30,"Colágeno hidrolizado":10,"Mora andina":50,"Miel cruda":5}},

  {id:"E2",family:"E",name:"Chocho Power",short:"Ganancia de peso limpio y calórico",goal:"Ganar peso en mayores con bajo IMC, anorexia del envejecimiento",
   objectives:["peso","musculo","energia"],meal:"desayuno",kcal:560,protein:30,carbs:70,fat:16,
   base:"kéfir+yogur",time:"10h F2",tags:["bajo IMC","ganancia de peso","sarcopenia"],
   contraindications:[],
   f1:"200 ml kéfir + 100 g yogur griego",
   f2:[{i:"Avena tostada",q:"25 g",p:""},{i:"Miel cruda",q:"10 g",p:""}],f2time:"10 h",
   fresh:["25 g chocho desamargado y cocido","60 g plátano maduro","15 g chía hidratada","8 g sacha inchi tostado"],
   why:"Densidad calórica + proteína completa. El chocho aporta 6–11 g de proteína extra mejorando aminoácidos limitantes. Combinación de carbohidratos lentos + rápidos = aporte energético amplio. Tomar 2 veces al día.",
   shopping:{"Kéfir (leche)":200,"Yogur griego":100,"Avena tostada":25,"Miel cruda":10,"Chocho":25,"Plátano maduro":60,"Chía":15,"Sacha inchi":8}},

  {id:"F1",family:"F",name:"Kombucha pre-comida",short:"Reducir pico glucémico postprandial",goal:"Reducir pico glucémico postprandial",
   objectives:["glucosa","digestión"],meal:"cualquier",kcal:15,protein:0,carbs:3,fat:0,
   base:"kombucha",time:"Sin F2",tags:["diabetes tipo 2","prediabetes","glucosa"],
   contraindications:["gastritis activa","reflujo","no mezclar con metformina sin consulta","tomar 15 min ANTES de la comida"],
   f1:"100 ml kombucha sin saborizar (11–14 días, más ácida)",f2:[],f2time:"Sin F2",
   fresh:["Diluir en 100 ml de agua si resulta muy ácida"],
   why:"El ácido acético retrasa el vaciamiento gástrico. Inhibe disacaridasas → menos glucosa absorbida rápido. Pico glucémico postprandial 15–25 % menor en estudios pequeños.",
   shopping:{"Kombucha casera":100}},

  {id:"F2",family:"F",name:"Yacón yogur",short:"Endulzar sin elevar glucosa",goal:"Desayuno o merienda satisfactoria para diabéticos, IG muy bajo",
   objectives:["glucosa","digestión","peso"],meal:"desayuno",kcal:280,protein:19,carbs:26,fat:9,
   base:"yogur griego",time:"Sin F2",tags:["diabetes","IG bajo","yacón"],
   contraindications:[],
   f1:"200 g yogur griego",f2:[],f2time:"Sin F2",
   fresh:["50 g yacón fresco rallado","5 ml jarabe de yacón","10 g linaza molida fresca","8 g semillas de zambo tostadas","pizca de canela Ceylon 0.5 g"],
   why:"Yacón: dulzor sin glucosa, FOS prebióticos. 8 g son FOS no digeribles. Linaza + chía enlentecen absorción. Canela Ceylon sensibiliza suavemente a la insulina.",
   shopping:{"Yogur griego":200,"Yacón":50,"Jarabe de yacón":5,"Linaza":10,"Semillas de zambo":8,"Canela Ceylon":1}},

  {id:"G1",family:"G",name:"Kéfir terapéutico intestino-piel",short:"La fórmula maestra de butirato",goal:"Producir butirato, sellar barrera intestinal, mejorar piel",
   objectives:["digestión","piel","inmunidad"],meal:"desayuno",kcal:240,protein:13,carbs:36,fat:5,
   base:"kéfir",time:"14h F2",tags:["intestino","piel","butirato","30 días"],
   contraindications:["no tomar con antiácidos en la misma hora"],
   f1:"250 ml kéfir fermentado 28–30 h (más ácido)",
   f2:[{i:"Harina de plátano verde",q:"10 g",p:"Almidón resistente tipo 2"},{i:"Avena tostada",q:"15 g",p:""},{i:"Jarabe de yacón",q:"5 ml",p:"FOS"}],f2time:"14 h",
   fresh:["30 g plátano verde cocido y enfriado ≥4 h en cubitos","10 g chía hidratada"],
   why:"Las fibras fermentables llegan intactas al colon. Bacterias producen butirato → combustible para colonocitos, inhibe NF-κB, refuerza tight junctions, mejora piel. Diario 30 días para ver efecto.",
   shopping:{"Kéfir (leche)":250,"Harina de plátano verde":10,"Avena tostada":15,"Jarabe de yacón":5,"Plátano verde":30,"Chía":10}},

  {id:"G2",family:"G",name:"Mucílago suave para gastritis",short:"Calmar mucosa gástrica y reflujo",goal:"Calmar mucosa gástrica, reflujo leve, sensibilidad gástrica",
   objectives:["digestión","piel"],meal:"desayuno",kcal:270,protein:17,carbs:38,fat:5,
   base:"yogur griego",time:"Sin F2",tags:["gastritis","reflujo","mucosa"],
   contraindications:["tomar frío o tibio, nunca caliente","esperar 1 hora antes de tumbarse"],
   f1:"200 g yogur griego (más suave que el kéfir ácido)",f2:[],f2time:"Sin F2",
   fresh:["50 g melloco cocido y frío en cubitos","50 g plátano maduro","10 g chía hidratada","30 ml infusión fría de manzanilla","5 ml miel cruda"],
   why:"Tres mucílagos vegetales (melloco, chía, manzanilla) más la caseína del yogur forman una capa protectora sobre la mucosa gástrica. No suben acidez gástrica.",
   shopping:{"Yogur griego":200,"Melloco":50,"Plátano maduro":50,"Chía":10,"Manzanilla":2,"Miel cruda":5}},

  {id:"H1",family:"H",name:"Shot andino inmunitario",short:"Apoyo inmune en estaciones frías",goal:"Apoyo inmune en estaciones frías",
   objectives:["inmunidad","energia"],meal:"cualquier",kcal:220,protein:9,carbs:32,fat:5,
   base:"kumis",time:"6–8h F2",tags:["inmunidad","invierno"],
   contraindications:["alergia al polen"],
   f1:"200 ml kumis casero",
   f2:[{i:"Uvilla machacada",q:"30 g",p:""}],f2time:"6–8 h",
   fresh:["30 g mortiño","3 g polen de abeja (si no eres alérgico)","5 ml miel cruda","pizca de jengibre rallado fresco"],
   why:"Withanólidos de uvilla: inmunomoduladores. Antocianinas de mortiño: protección celular. Polen: vitaminas, minerales y fitoquímicos. Kumis: probióticos suaves.",
   shopping:{"Kumis casero":200,"Uvilla":30,"Mortiño":30,"Polen de abeja":3,"Miel cruda":5,"Jengibre":2}},

  {id:"I1",family:"I",name:"Para él — Próstata y energía",short:"Salud prostática, energía masculina",goal:"Salud prostática, energía sostenida masculina",
   objectives:["hormonal","energia","corazón"],meal:"desayuno",kcal:420,protein:17,carbs:50,fat:16,
   base:"kéfir",time:"12h F2",tags:["hombres>50","próstata"],
   contraindications:["consultar si tomas finasterida, dutasterida o tamsulosina"],
   f1:"250 ml kéfir 24 h",
   f2:[{i:"Avena tostada",q:"20 g",p:""}],f2time:"12 h",
   fresh:["15 g semillas de zambo tostadas","40 g mashua cocida y fría en cubitos","50 g mora andina","5 ml aceite de sacha inchi","5 g cacao puro (opcional)"],
   why:"Zinc de semillas de zambo: cofactor de testosterona. Fitosteroles: inhiben competitivamente la conversión a DHT. Mashua: glucosinolatos, tradición andina. Mora: protección vascular.",
   shopping:{"Kéfir (leche)":250,"Avena tostada":20,"Semillas de zambo":15,"Mashua":40,"Mora andina":50,"Aceite de sacha inchi":5}},

  {id:"I2",family:"I",name:"Para ella — Menopausia y hueso",short:"Sofocos, hueso y soporte hormonal",goal:"Sofocos, salud ósea, soporte hormonal femenino",
   objectives:["hormonal","huesos","corazón"],meal:"desayuno",kcal:380,protein:28,carbs:38,fat:11,
   base:"yogur griego",time:"12–24h F2",tags:["menopausia","peri-menopausia","sofocos","huesos"],
   contraindications:[],
   f1:"200 g yogur griego",
   f2:[{i:"Cacao puro",q:"5 g",p:"Magnesio, polifenoles"}],f2time:"12–24 h en nevera",
   fresh:["15 g linaza recién molida","15 g amaranto reventado","50 g mora andina","5 g miel cruda","10 g colágeno hidrolizado"],
   why:"Lignanos de la linaza → fitoestrógenos → reducción de sofocos 30–50 % en estudios (6–12 semanas, 25–40 g/día de linaza). Calcio + proteína + colágeno: prevención osteopenia post-menopáusica.",
   shopping:{"Yogur griego":200,"Cacao puro":5,"Linaza":15,"Amaranto reventado":15,"Mora andina":50,"Miel cruda":5,"Colágeno hidrolizado":10}},

  {id:"J1",family:"J",name:"Tropical andino express",short:"Sin F2, listo en 2 minutos",goal:"Energía express sin segunda fermentación",
   objectives:["energia","digestión"],meal:"cualquier",kcal:200,protein:8,carbs:30,fat:3,
   base:"kumis",time:"Sin F2",tags:["express","sin tiempo"],contraindications:[],
   f1:"200 ml kumis",f2:[],f2time:"Sin F2",
   fresh:["60 g babaco en cubos","40 g uvilla partidas","10 g chía hidratada","Hielo, batir 20 segundos"],
   why:"Express: sin F2. Babaco y uvilla aportan vitamina C y enzimas digestivas naturales. Kumis aporta probióticos suaves.",
   shopping:{"Kumis casero":200,"Babaco":60,"Uvilla":40,"Chía":10}},

  {id:"J2",family:"J",name:"Mañana cremosa express",short:"Textura helada, energía inmediata",goal:"Desayuno rápido, textura helada cremosa",
   objectives:["energia","musculo"],meal:"desayuno",kcal:320,protein:19,carbs:45,fat:6,
   base:"yogur griego",time:"Sin F2",tags:["express","sin tiempo"],contraindications:[],
   f1:"200 g yogur griego",f2:[],f2time:"Sin F2",
   fresh:["80 g plátano maduro congelado","10 g máchica","5 g miel cruda","Batir 30 segundos en licuadora"],
   why:"El plátano congelado da textura cremosa sin helado. La máchica aporta energía sostenida. Rápido y completo.",
   shopping:{"Yogur griego":200,"Plátano maduro":80,"Máchica":10,"Miel cruda":5}},

  {id:"J3",family:"J",name:"Verde digestivo express",short:"Digestión y frescura en 2 min",goal:"Digestión fácil, frescura verde",
   objectives:["digestión","glucosa"],meal:"cualquier",kcal:195,protein:7,carbs:32,fat:2,
   base:"kéfir",time:"Sin F2",tags:["express","digestión"],contraindications:[],
   f1:"200 ml kéfir colado",f2:[],f2time:"Sin F2",
   fresh:["60 g manzana verde pelada en trozos","5 g perejil fresco","30 g yacón rallado","5 ml jarabe yacón","Batir, colar si hay fibras gruesas"],
   why:"Yacón: FOS prebióticos sin elevar glucosa. Manzana verde: pectina prebiótica. Perejil: vitamina K y C. Rápido y digestivo.",
   shopping:{"Kéfir (leche)":200,"Manzana verde":60,"Perejil":5,"Yacón":30,"Jarabe de yacón":5}},

  {id:"K1",family:"K",name:"Suave reconstructor post-cirugía",short:"Semana 1 post-operatorio",goal:"Proteína de alta calidad sin esforzar la digestión",
   objectives:["recuperación","musculo","digestión"],meal:"desayuno",kcal:310,protein:28,carbs:35,fat:6,
   base:"yogur griego",time:"Sin F2",tags:["post-cirugía","convalecencia"],
   contraindications:["consultar cirujano","no con kombucha","no con cereales crudos"],
   f1:"200 g yogur griego (menos ácido, menos gas)",f2:[],f2time:"Sin F2",
   fresh:["50 g plátano maduro machacado finamente","10 g colágeno hidrolizado","30 ml infusión fría de manzanilla","5 g miel cruda"],
   why:"Cicatrización requiere proteína extra 1.5–2 g/kg/día. Vitamina C + colágeno para sintetizar tejido cicatricial. Fácil de tragar, bajo en residuo, probióticos suaves.",
   shopping:{"Yogur griego":200,"Plátano maduro":50,"Colágeno hidrolizado":10,"Manzanilla":2,"Miel cruda":5}},

  {id:"L1",family:"L",name:"Vaso del primer síntoma",short:"Apoyo inmune en primeras 24 h de gripe",goal:"Soporte inmune al inicio de gripe, hidratación, antioxidantes",
   objectives:["inmunidad","recuperación"],meal:"cualquier",kcal:200,protein:10,carbs:30,fat:4,
   base:"kumis",time:"Sin F2",tags:["gripe","resfriado","primer síntoma"],
   contraindications:["fiebre alta → médico","dificultad respiratoria → médico"],
   f1:"200 ml kumis o yogur griego batido con agua",f2:[],f2time:"Sin F2",
   fresh:["50 g uvilla machacada","30 g mortiño","5 g miel cruda","30 ml infusión fría de jengibre + limón","3 g polen de abeja (si no eres alérgico)"],
   why:"Vitamina C acorta duración del resfriado 8–14 % (Cochrane). Antocianinas: actividad antiviral in vitro. Miel cruda: efecto demulcente para mucosa faríngea. Probióticos: refuerzo de IgA secretora.",
   shopping:{"Kumis casero":200,"Uvilla":50,"Mortiño":30,"Miel cruda":5,"Jengibre":2,"Limón":1,"Polen de abeja":3}},

  {id:"M1",family:"M",name:"Pre-viaje: refuerzo microbiota",short:"3 días antes de un viaje largo",goal:"Fortalecer microbiota antes de un viaje largo",
   objectives:["inmunidad","digestión","viaje"],meal:"desayuno",kcal:280,protein:13,carbs:42,fat:5,
   base:"kéfir",time:"12h F2",tags:["viaje","prevención diarrea"],contraindications:[],
   f1:"250 ml kéfir 28–30 h (más maduro)",
   f2:[{i:"Harina de plátano verde",q:"10 g",p:""},{i:"Jarabe de yacón",q:"5 ml",p:""}],f2time:"12 h",
   fresh:["30 g plátano verde cocido y enfriado en cubitos","10 g chía hidratada","30 g mortiño"],
   why:"3 días de alta dosis de almidón resistente + FOS + probióticos maduros robustecen Faecalibacterium prausnitzii. Una microbiota fuerte resiste mejor la colonización por patógenos foráneos.",
   shopping:{"Kéfir (leche)":250,"Harina de plátano verde":10,"Jarabe de yacón":5,"Plátano verde":30,"Chía":10,"Mortiño":30}},

  {id:"M2",family:"M",name:"Versión portátil sin refrigeración",short:"Para avión, bus o excursión (4–6 h)",goal:"Llevar fermento portátil al avión, autobús o excursión",
   objectives:["energia","viaje","digestión"],meal:"desayuno",kcal:400,protein:22,carbs:55,fat:12,
   base:"yogur griego",time:"24h F2",tags:["viaje","portátil","excursión"],contraindications:[],
   f1:"250 g yogur griego",
   f2:[{i:"Máchica",q:"15 g",p:""},{i:"Cacao puro",q:"10 g",p:""},{i:"Plátano maduro machacado",q:"30 g",p:""},{i:"Miel cruda",q:"5 g",p:""}],f2time:"24 h en nevera con todo añadido",
   fresh:["Todo va junto — usar termo de boca ancha 350 ml preenfriado","Consumir dentro de 4–6 h con frío o 2 h sin"],
   why:"El yogur griego es el fermento más portátil: espeso, menos gas, no explota. Con F2 ya preparada, solo necesitas abrirlo y comerlo. Dura 4–6 h en bolsa con acumulador de frío.",
   shopping:{"Yogur griego":250,"Máchica":15,"Cacao puro":10,"Plátano maduro":30,"Miel cruda":5}},

  {id:"N1",family:"N",name:"Refresco andino sin azúcar",short:"Hidratación con electrolitos para calor",goal:"Hidratación con electrolitos sin elevar glucosa",
   objectives:["glucosa","digestión","energia"],meal:"cualquier",kcal:80,protein:0.5,carbs:18,fat:0,
   base:"kombucha",time:"3 días F2",tags:["calor","diabéticos","electrolitos"],
   contraindications:["no abusar en hipertensos"],
   f1:"250 ml kombucha de té verde 11 días",
   f2:[{i:"Mora andina machacada",q:"30 g",p:""},{i:"Jengibre rallado",q:"5 g",p:""},{i:"Hierba luisa",q:"3 hojas",p:""}],f2time:"3 días en botella swing-top",
   fresh:["200 ml agua de coco fresca","6 cubos de hielo","pizca de sal rosa","5 ml jarabe de yacón","1 rodaja de limón"],
   why:"En calor pierdes sodio, potasio, magnesio y cloro. El agua de coco es el 'Gatorade natural'. Kombucha aporta hidratación + probióticos. La sal repone sodio para prevenir hiponatremia.",
   shopping:{"Kombucha casera":250,"Mora andina":30,"Jengibre":5,"Agua de coco":200,"Jarabe de yacón":5}},

  {id:"O1",family:"O",name:"Vaso anti-cortisol",short:"Después de un día difícil",goal:"Reducir cortisol, regular sistema nervioso simpático",
   objectives:["ansiedad","sueño","cerebro"],meal:"cena",kcal:310,protein:20,carbs:30,fat:11,
   base:"yogur griego",time:"24h F2",tags:["estrés","cortisol","ansiedad"],contraindications:[],
   f1:"200 g yogur griego",
   f2:[{i:"Cacao puro",q:"5 g",p:""},{i:"Miel cruda",q:"3 g",p:""}],f2time:"24 h en nevera",
   fresh:["40 g plátano maduro","10 g semillas de zambo tostadas y molidas","30 ml infusión fría de toronjil + manzanilla","5 g almendras activadas picadas","pizca de canela Ceylon"],
   why:"Magnesio (semillas zambo + almendras): cofactor del eje HPA, su déficit aumenta cortisol. Triptófano → serotonina. Apigenina de manzanilla: ansiolítico suave. Cacao: anandamida y PEA mejoran ánimo.",
   shopping:{"Yogur griego":200,"Cacao puro":5,"Miel cruda":3,"Plátano maduro":40,"Semillas de zambo":10,"Toronjil":2,"Manzanilla":2,"Almendras":5}},

  {id:"O2",family:"O",name:"Bowl contra ansiedad anticipatoria",short:"Antes de un evento estresante",goal:"Estabilizar GABA y serotonina antes de evento estresante",
   objectives:["ansiedad","cerebro","enfoque"],meal:"desayuno",kcal:400,protein:24,carbs:40,fat:16,
   base:"yogur griego",time:"Sin F2",tags:["ansiedad","estrés","examen","entrevista"],contraindications:[],
   f1:"200 g yogur griego",f2:[],f2time:"Sin F2",
   fresh:["30 g quinua cocida fría","50 g mora andina","10 g nueces activadas picadas","5 g cacao puro","5 g miel cruda","30 ml infusión fría de toronjil"],
   why:"Proteína + carbohidrato lento + omega-3 + magnesio + adaptógenos suaves = soporte completo al sistema nervioso bajo estrés agudo previsto.",
   shopping:{"Yogur griego":200,"Quinua cocida":30,"Mora andina":50,"Nueces":10,"Cacao puro":5,"Miel cruda":5,"Toronjil":2}},

  {id:"P1",family:"P",name:"Anti-sarcopenia para encamados",short:"Prevenir pérdida muscular en reposo",goal:"Evitar pérdida muscular en reposo forzoso (3× al día)",
   objectives:["musculo","recuperación","huesos"],meal:"cualquier",kcal:480,protein:45,carbs:40,fat:10,
   base:"yogur griego",time:"Sin F2",tags:["encamados","sarcopenia","leucina"],
   contraindications:["combinar con ejercicios isométricos en cama"],
   f1:"200 g yogur griego",f2:[],f2time:"Sin F2",
   fresh:["15 g colágeno hidrolizado","1 cucharada proteína de suero whey isolate 20 g (opcional)","50 g plátano maduro","10 g chía hidratada","5 g miel cruda"],
   why:"Leucina ≥ 3 g por comida, 3 veces al día. Única estrategia que activa síntesis muscular en mayores con anabolic resistance. Asociado con menor pérdida de masa magra durante reposo prolongado.",
   shopping:{"Yogur griego":200,"Colágeno hidrolizado":15,"Whey protein":20,"Plátano maduro":50,"Chía":10,"Miel cruda":5}},

  {id:"Q1",family:"Q",name:"Romper el ayuno (16:8)",short:"Primer alimento tras ayuno intermitente",goal:"Romper ayuno sin disparar la insulina, mantener autofagia",
   objectives:["glucosa","peso","digestión"],meal:"desayuno",kcal:350,protein:15,carbs:18,fat:22,
   base:"kéfir",time:"Sin F2",tags:["ayuno intermitente","16:8","18:6"],
   contraindications:["SIN miel, SIN plátano, SIN cereales al romper el ayuno"],
   f1:"250 ml kéfir 24 h",f2:[],f2time:"Sin F2",
   fresh:["30 g chía hidratada","30 g mortiño","10 g nueces activadas","5 ml aceite de sacha inchi","SIN miel ni cereales"],
   why:"Romper ayuno con proteína + grasa + fibra sin carbohidratos rápidos mantiene la sensibilidad a la insulina ganada durante el ayuno. Azúcares al romper ayuno anulan el beneficio metabólico.",
   shopping:{"Kéfir (leche)":250,"Chía":30,"Mortiño":30,"Nueces":10,"Aceite de sacha inchi":5}},

  {id:"S1",family:"S",name:"Soporte hipotiroidismo",short:"Selenio y zinc para la tiroides",goal:"Apoyo nutricional en hipotiroidismo bien controlado",
   objectives:["hormonal","energia","inmunidad"],meal:"desayuno",kcal:360,protein:22,carbs:35,fat:14,
   base:"yogur griego",time:"Sin F2",tags:["hipotiroidismo","tiroides","selenio"],
   contraindications:["tomar AL MENOS 4 h después de la levotiroxina","no añadir crucíferas crudas","no soya en la misma comida que levotiroxina"],
   f1:"200 g yogur griego",f2:[],f2time:"Sin F2",
   fresh:["50 g mortiño","30 g quinua cocida fría","10 g semillas de zambo","5 g cacao puro","5 g miel cruda"],
   why:"Selenio (semillas zambo, quinua): cofactor de deiodinasa que convierte T4 → T3 activa. Zinc: necesario para receptores de tiroides. Cobre: equilibrio con zinc.",
   shopping:{"Yogur griego":200,"Mortiño":50,"Quinua cocida":30,"Semillas de zambo":10,"Cacao puro":5,"Miel cruda":5}},

  {id:"T1",family:"T",name:"Bowl para olvidos del día a día",short:"Soporte cognitivo en quejas de memoria",goal:"Soporte cognitivo en quejas subjetivas de memoria",
   objectives:["cerebro","memoria","enfoque"],meal:"desayuno",kcal:490,protein:26,carbs:38,fat:25,
   base:"yogur griego",time:"12h F2",tags:["memoria","cognición","BDNF","colina"],
   contraindications:["si los olvidos son frecuentes o progresivos → evaluación neurológica"],
   f1:"200 g yogur griego",
   f2:[{i:"Cacao puro",q:"5 g",p:""}],f2time:"12 h en nevera",
   fresh:["60 g mortiño","15 g nueces","1 yema de huevo cocida","5 ml aceite de sacha inchi","30 g arándanos o más mortiño","5 g miel cruda"],
   why:"Antocianinas del mortiño cruzan la barrera hematoencefálica y ↑ BDNF. Colina de la yema → acetilcolina (neurotransmisor de la memoria). Omega-3 de nueces y sacha inchi para membranas neuronales.",
   shopping:{"Yogur griego":200,"Cacao puro":5,"Mortiño":60,"Nueces":15,"Huevo":1,"Aceite de sacha inchi":5,"Arándanos":30,"Miel cruda":5}},
];

const OBJECTIVES = [
  {id:"energia",label:"Energía y enfoque",icon:"⚡"},
  {id:"huesos",label:"Huesos y articulaciones",icon:"🦴"},
  {id:"corazón",label:"Corazón y colesterol",icon:"❤️"},
  {id:"cerebro",label:"Cerebro y memoria",icon:"🧠"},
  {id:"musculo",label:"Músculo y fuerza",icon:"💪"},
  {id:"peso",label:"Ganancia de peso",icon:"⚖️"},
  {id:"glucosa",label:"Glucosa e insulina",icon:"🩸"},
  {id:"digestión",label:"Intestino y digestión",icon:"🌿"},
  {id:"sueño",label:"Sueño y descanso",icon:"🌙"},
  {id:"inmunidad",label:"Inmunidad",icon:"🛡️"},
  {id:"piel",label:"Piel y regeneración",icon:"✨"},
  {id:"ansiedad",label:"Estrés y ansiedad",icon:"🧘"},
  {id:"hormonal",label:"Soporte hormonal",icon:"⚗️"},
  {id:"recuperación",label:"Recuperación / Post-cirugía",icon:"🏥"},
  {id:"viaje",label:"Viaje y excursión",icon:"✈️"},
];

const EXERCISES = {
  energia:    [{name:"Caminata enérgica 30 min",freq:"5×/semana",note:"Mejora mitocondrias y energía sostenida"},{name:"Bailoterapia suave 20 min",freq:"3×/semana",note:"Activa endorfinas y coordinación"}],
  huesos:     [{name:"Caminata con bastones nórdicos",freq:"4×/semana",note:"Impacto óseo + core"},{name:"Sentadillas asistidas con silla",freq:"3×/semana",note:"Carga ósea en cadera y rodilla"},{name:"Ejercicios de equilibrio unipodal",freq:"Diario 5 min",note:"Prevención caídas"}],
  corazón:    [{name:"Caminata de ritmo moderado",freq:"5×/semana 30–45 min",note:"FC objetivo 50–70 % de la máxima"},{name:"Natación o aqua-aeróbicos",freq:"3×/semana",note:"Bajo impacto articular, alta carga cardiovascular"}],
  cerebro:    [{name:"Caminata al aire libre sin auriculares",freq:"Diario 30 min",note:"Novedad visual activa BDNF"},{name:"Tai chi o yoga",freq:"3×/semana",note:"Coordinación, equilibrio y flujo cerebral"}],
  musculo:    [{name:"Pesas ligeras o bandas elásticas",freq:"3×/semana",note:"Series de 8–12 repeticiones, descanso 60 s"},{name:"Caminata enérgica cuesta arriba",freq:"3×/semana",note:"Activa cuádriceps e isquiotibiales"}],
  peso:       [{name:"Pesas moderadas con supervisión",freq:"3×/semana",note:"Sin llegar al fallo muscular"},{name:"Yoga restaurativo",freq:"2×/semana",note:"Estimula apetito y reduce catabolismo"}],
  glucosa:    [{name:"Caminata 15 min post-comida",freq:"Después de cada comida principal",note:"Baja el pico glucémico hasta un 20 %"},{name:"Resistencia con bandas",freq:"3×/semana",note:"Aumenta captación de glucosa en músculo"}],
  digestión:  [{name:"Caminata suave 20 min post-desayuno",freq:"Diario",note:"Estimula peristaltismo"},{name:"Yoga digestivo (torsiones)",freq:"3×/semana",note:"Mejora motilidad intestinal"}],
  sueño:      [{name:"Caminata vespertina (no nocturna)",freq:"5×/semana",note:"Terminar antes de las 19:00"},{name:"Yoga nidra o meditación",freq:"Diario 10 min",note:"Antes de dormir, sin pantallas"}],
  inmunidad:  [{name:"Caminata al sol matinal 20 min",freq:"Diario",note:"Vitamina D + reactivación inmune"},{name:"Ejercicio moderado (no extenuante)",freq:"4×/semana",note:"El sobreentrenamiento deprime la inmunidad"}],
  piel:       [{name:"Caminata con exposición solar 15 min",freq:"Diario",note:"Síntesis de vitamina D para piel"},{name:"Yoga o pilates",freq:"3×/semana",note:"Mejora circulación periférica → piel"}],
  ansiedad:   [{name:"Caminata en la naturaleza",freq:"Diario 30 min",note:"Reduce cortisol mejor que correr en interiores"},{name:"Respiración diafragmática 4-7-8",freq:"3×/día",note:"Activa nervio vago → reduce ansiedad"}],
  hormonal:   [{name:"Pesas moderadas",freq:"3×/semana",note:"Estimula producción hormonal natural"},{name:"Caminata enérgica",freq:"4×/semana",note:"Mejora perfil hormonal general"}],
  recuperación:[{name:"Fisioterapia prescrita",freq:"Según médico",note:"No improvisar post-cirugía"},{name:"Isométricos en cama",freq:"3×/día 10 rep",note:"Contraer cuádriceps, glúteos, abdominales sin mover la articulación"}],
  viaje:      [{name:"Caminata exploratoria",freq:"Diario en destino",note:"Aprovechar el entorno nuevo"},{name:"Estiramientos de viaje",freq:"Cada 2 h en transporte",note:"Levantarse y caminar 5 min en vuelos/buses"}],
};

const SUPPLEMENTS = {
  energia:    ["Vitamina B12 (500 µg/día si > 65 años)","Magnesio glicinato 200 mg/noche","Coenzima Q10 100–200 mg/día (evidencia moderada)"],
  huesos:     ["Vitamina D3 2 000 UI/día (con médico)","Calcio citrato 500 mg/día si la dieta no llega a 1 200 mg","Colágeno hidrolizado tipo I+III 10 g/día"],
  corazón:    ["Omega-3 EPA+DHA 1–2 g/día (con médico si anticoagulantes)","Coenzima Q10 si tomas estatinas","Fitoesteroles 2 g/día (margarina enriquecida o cápsulas)"],
  cerebro:    ["Omega-3 DHA 500–1 000 mg/día","Vitamina B12 si hay déficit (> 65 años)","Colina 250–550 mg/día (en deficiencia)"],
  musculo:    ["Creatina monohidrato 3–5 g/día (evidencia alta en mayores)","Vitamina D3 2 000 UI/día","Proteína de suero (whey) 20 g post-ejercicio si la dieta no llega"],
  peso:       ["Proteína de suero (whey isolate) 20 g 2×/día","Vitamina D3 2 000 UI/día","Zinc 15 mg/día (estimula apetito)"],
  glucosa:    ["Berberina 500 mg 2×/día con comidas (consultar médico)","Cromo picolinato 200 µg/día","Magnesio 300 mg/día"],
  digestión:  ["Saccharomyces boulardii 250 mg/día en viajes","Fibra de psyllium 5–10 g/día si hay estreñimiento","Enzimas digestivas con comidas si hay mala absorción"],
  sueño:      ["Melatonina 0.3–0.5 mg (dosis fisiológica) 30 min antes de dormir","Magnesio glicinato 200–400 mg/noche","L-teanina 200 mg (de té verde)"],
  inmunidad:  ["Vitamina D3 2 000 UI/día","Zinc 15 mg/día en invierno","Vitamina C 500 mg/día (efecto preventivo modesto)"],
  piel:       ["Colágeno hidrolizado tipo I+III 10 g/día","Vitamina C 500 mg/día (cofactor síntesis colágeno)","Biotina 2 500 µg/día (cabello, uñas, piel)"],
  ansiedad:   ["Magnesio glicinato 200–400 mg/noche","L-teanina 200 mg (sin cafeína)","Ashwagandha 300–600 mg/día (adaptógeno, evidencia moderada)"],
  hormonal:   ["Vitamina D3 2 000 UI/día","Zinc 15 mg/día","Omega-3 1 g/día"],
  recuperación:["Vitamina C 500–1 000 mg/día (síntesis colágeno)","Zinc 15–30 mg/día (epitelización)","Proteína de suero 20–30 g 2–3×/día"],
  viaje:      ["Saccharomyces boulardii 250 mg/día (diarrea viajero, evidencia robusta)","Vitamina C 500 mg/día","Melatonina 0.3–0.5 mg para jet lag"],
};

const COMBINATIONS = [
  {label:"Lunes / Miércoles / Viernes",description:"Fórmulas de mayor carga (F2 completa, alta proteína)"},
  {label:"Martes / Jueves",description:"Fórmulas express o base simple para descansar el sistema digestivo"},
  {label:"Sábado",description:"Fórmula terapéutica si tienes objetivo activo (G1, K1, Q2)"},
  {label:"Domingo",description:"Reset suave — solo base fermentada sin añadidos o bowl express"},
];

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [plan, setPlan] = useState(null);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState("plan");
  const [planDays, setPlanDays] = useState(30);
  const [disruption, setDisruption] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [chatMessages, setChatMessages] = useState([{role:"assistant",text:"¡Hola! Soy tu asistente Kéfir BioSystem. Puedo ayudarte a elegir recetas, calcular ingredientes, resolver dudas o sugerirte combinaciones. ¿Qué necesitas hoy?"}]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  // ── SEARCH ENGINE ──────────────────────────────────────────────────────────
  const handleSearch = () => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    // Map keywords to objectives
    const keyMap = {
      "peso":"peso","engordar":"peso","ganar peso":"peso","bajo peso":"peso","flaco":"peso",
      "energía":"energia","energía":"energia","cansancio":"energia","fatiga":"energia","cansado":"energia",
      "hueso":"huesos","osteoporosis":"huesos","calcio":"huesos","articulación":"articulaciones","articulaciones":"huesos",
      "corazón":"corazón","colesterol":"corazón","presión":"corazón","hipertensión":"corazón",
      "cerebro":"cerebro","memoria":"memoria","olvido":"cerebro","concentración":"enfoque",
      "músculo":"musculo","musculo":"musculo","sarcopenia":"musculo","fuerza":"musculo",
      "glucosa":"glucosa","diabetes":"glucosa","insulina":"glucosa","azúcar":"glucosa",
      "digestión":"digestión","intestino":"digestión","barriga":"digestión","hinchazón":"digestión","gastritis":"digestión",
      "sueño":"sueño","dormir":"sueño","insomnio":"sueño","descanso":"sueño",
      "inmunidad":"inmunidad","gripe":"inmunidad","resfriado":"inmunidad","defensas":"inmunidad",
      "piel":"piel","acné":"piel","regeneración":"piel",
      "ansiedad":"ansiedad","estrés":"ansiedad","nervios":"ansiedad","cortisol":"ansiedad",
      "hormonal":"hormonal","menopausia":"hormonal","tiroides":"hormonal","próstata":"hormonal","testosterona":"hormonal",
      "cirugía":"recuperación","operación":"recuperación","convalecencia":"recuperación","post-cirugía":"recuperación",
      "viaje":"viaje","excursión":"viaje","jet lag":"viaje","avión":"viaje",
      "enfermo":"inmunidad","resfriado":"inmunidad",
    };
    let matchedObjective = null;
    for (const [kw, obj] of Object.entries(keyMap)) {
      if (q.includes(kw)) { matchedObjective = obj; break; }
    }
    let matched = RECIPES.filter(r =>
      r.objectives.includes(matchedObjective) ||
      r.name.toLowerCase().includes(q) ||
      r.short.toLowerCase().includes(q) ||
      r.goal.toLowerCase().includes(q) ||
      r.tags.some(t => q.includes(t.toLowerCase()))
    );
    if (!matched.length) matched = RECIPES.slice(0,6);
    // Build plan
    const morning = matched.filter(r => r.meal === "desayuno" || r.meal === "cualquier").slice(0,3);
    const lunch   = matched.filter(r => r.meal === "almuerzo" || r.meal === "cualquier").slice(0,2);
    const dinner  = matched.filter(r => r.meal === "cena" || r.meal === "cualquier").slice(0,2);
    const mainObj = matchedObjective || "energia";
    setResults({ objective: matchedObjective, recipes: matched, query });
    setPlan({ morning, lunch, dinner, mainObj, days: planDays });
    buildShoppingList(matched, planDays);
    setScreen("results");
    setActiveTab("plan");
  };

  // recipes + explicit days so the list recalculates correctly when days changes
  const buildShoppingList = (recipes, days) => {
    const d = days ?? planDays ?? 7;
    const perDay = {};
    recipes.forEach(r => {
      Object.entries(r.shopping || {}).forEach(([item, qty]) => {
        perDay[item] = (perDay[item] || 0) + qty;
      });
    });
    const BULK = ["Kéfir (leche)","Yogur griego","Kumis casero","Kombucha casera","Avena tostada","Máchica","Miel cruda","Cacao puro","Linaza","Chía","Sacha inchi","Colágeno hidrolizado"];
    const list = Object.entries(perDay).map(([item, qDay]) => ({
      item,
      qty:    Math.round(qDay * d),
      weekly: Math.round(qDay * 7),
      bulk:   BULK.includes(item),
    })).sort((a,b) => b.bulk - a.bulk);
    setShoppingList(list);
  };

  // ── DISRUPTION RECALC ──────────────────────────────────────────────────────
  const handleDisruption = (type) => {
    setDisruption(type);
    if (!plan) return;
    let newRecipes;
    if (type === "sick") {
      newRecipes = RECIPES.filter(r => r.objectives.includes("inmunidad") || r.objectives.includes("digestión") || r.objectives.includes("recuperación"));
    } else if (type === "travel") {
      newRecipes = RECIPES.filter(r => r.objectives.includes("viaje") || r.id === "M1" || r.id === "M2" || r.id === "J1" || r.id === "J2");
    } else if (type === "resume") {
      newRecipes = results?.recipes || RECIPES.slice(0,6);
      setDisruption(null);
    }
    const morning = newRecipes.filter(r => r.meal === "desayuno" || r.meal === "cualquier").slice(0,2);
    const dinner = newRecipes.filter(r => r.meal === "cena" || r.meal === "cualquier").slice(0,2);
    setPlan(p => ({ ...p, morning, dinner }));
    buildShoppingList(newRecipes, planDays);
  };

  // ── CHAT ──────────────────────────────────────────────────────────────────
  const GROQ_API_KEY = "TU_API_KEY_DE_GROQ"; // ← Reemplaza con tu clave de Groq

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(m => [...m, { role:"user", text: userMsg }]);
    setChatLoading(true);

    // Build system context with book data
    const systemPrompt = `Eres el asistente experto del sistema Kéfir BioSystem Andino 50+. Tienes acceso a todas las recetas, familias y conocimiento del libro.

Recetas disponibles (resumen):
${RECIPES.map(r=>`${r.id}: ${r.name} — Objetivo: ${r.goal} — ${r.kcal} kcal — Base: ${r.base}`).join("\n")}

Responde siempre en español. Sé específico, práctico y cálido. Si preguntan por una receta, da los ingredientes clave. Si preguntan por segunda fermentación con un ingrediente, di si es posible y cómo. Si hay contraindicaciones, menciónalas. Máximo 200 palabras. No uses markdown, solo texto plano con saltos de línea.`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 500,
          messages: [
            { role: "system", content: systemPrompt },
            ...chatMessages.map(m => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.text
            })),
            { role: "user", content: userMsg }
          ]
        })
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "No pude responder en este momento.";
      setChatMessages(m => [...m, { role:"assistant", text }]);
    } catch {
      setChatMessages(m => [...m, { role:"assistant", text:"Error de conexión. Intenta de nuevo." }]);
    }
    setChatLoading(false);
    setTimeout(()=>{ chatRef.current?.scrollTo({top:9999,behavior:"smooth"}); }, 100);
  };

  // Re-calculate shopping list whenever planDays changes
  useEffect(() => {
    if (results?.recipes) buildShoppingList(results.recipes, planDays);
  }, [planDays]); // eslint-disable-line

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages]);

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={styles.app}>
      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navLogo} onClick={()=>setScreen("home")}>
          <span style={styles.navLogoMark}>K</span>
          <span style={styles.navLogoText}>BioSystem</span>
        </div>
        <div style={styles.navTabs}>
          {[["home","Inicio"],["search","Buscar"],["recipes","Recetas"],["chat","Consulta"]].map(([s,l])=>(
            <button key={s} style={{...styles.navTab,...(screen===s||(!["home","search","recipes","chat"].includes(screen)&&s==="search")?styles.navTabActive:{})}}
              onClick={()=>{ setScreen(s); if(s==="search")setResults(null); }}>
              {l}
            </button>
          ))}
        </div>
      </nav>

      {/* HOME */}
      {screen==="home" && <HomeScreen setScreen={setScreen} setQuery={setQuery} handleSearch={handleSearch} query={query} />}

      {/* SEARCH / RESULTS */}
      {(screen==="search"||screen==="results") && (
        <SearchScreen
          query={query} setQuery={setQuery} handleSearch={handleSearch}
          results={results} plan={plan} activeTab={activeTab} setActiveTab={setActiveTab}
          planDays={planDays} setPlanDays={setPlanDays} disruption={disruption}
          handleDisruption={handleDisruption} shoppingList={shoppingList}
          setActiveRecipe={setActiveRecipe} setScreen={setScreen}
        />
      )}

      {/* RECIPE DETAIL */}
      {screen==="recipe" && activeRecipe && (
        <RecipeDetail recipe={activeRecipe} onBack={()=>setScreen(results?"results":"recipes")} />
      )}

      {/* ALL RECIPES */}
      {screen==="recipes" && (
        <RecipesGrid recipes={RECIPES} setActiveRecipe={r=>{setActiveRecipe(r);setScreen("recipe");}} />
      )}

      {/* CHAT */}
      {screen==="chat" && (
        <ChatScreen
          messages={chatMessages} input={chatInput} setInput={setChatInput}
          onSend={sendChat} loading={chatLoading} chatRef={chatRef} inputRef={inputRef}
        />
      )}
    </div>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
function HomeScreen({ setScreen, setQuery, handleSearch, query }) {
  const [localQ, setLocalQ] = useState("");
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroGlow} />
        <div style={styles.heroContent}>
          <p style={styles.heroEyebrow}>KÉFIR BIO-SYSTEM · ANDINO 50+</p>
          <h1 style={styles.heroTitle}>Tu plan<br />de fermentos<br />personalizado</h1>
          <p style={styles.heroSub}>Dime tu objetivo y te calculo el plan completo: recetas, ejercicio, suplementos, lista de compras y cronograma.</p>
          <div style={styles.heroSearch}>
            <input
              style={styles.heroInput}
              placeholder='¿Qué quieres lograr? Ej: "ganar peso", "dormir mejor"...'
              value={localQ}
              onChange={e=>setLocalQ(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"){ setQuery(localQ); setTimeout(handleSearch,50); }}}
            />
            <button style={styles.heroBtn} onClick={()=>{ setQuery(localQ); setTimeout(handleSearch,50); }}>Calcular plan →</button>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <p style={styles.sectionLabel}>OBJETIVOS RÁPIDOS</p>
        <div style={styles.pillGrid}>
          {OBJECTIVES.slice(0,10).map(o=>(
            <button key={o.id} style={styles.pill} onClick={()=>{ setQuery(o.label); setTimeout(handleSearch,50); }}>
              <span>{o.icon}</span> {o.label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.featGrid}>
        {[
          {icon:"🧪",title:"36 Recetas",sub:"Organizadas por objetivo, familia y momento del día"},
          {icon:"📅",title:"Cronograma 30 días",sub:"Rotación inteligente para no aburrirte"},
          {icon:"🛒",title:"Lista de compras",sub:"Ingredientes calculados para todo tu plan"},
          {icon:"💬",title:"Consulta IA",sub:"Pregunta dudas, recetas o combinaciones de ingredientes"},
        ].map(f=>(
          <div key={f.title} style={styles.featCard}>
            <span style={styles.featIcon}>{f.icon}</span>
            <p style={styles.featTitle}>{f.title}</p>
            <p style={styles.featSub}>{f.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SEARCH SCREEN ────────────────────────────────────────────────────────────
function SearchScreen({ query,setQuery,handleSearch,results,plan,activeTab,setActiveTab,planDays,setPlanDays,disruption,handleDisruption,shoppingList,setActiveRecipe,setScreen }) {
  const [localQ,setLocalQ] = useState(query);
  const tabs = ["plan","schedule","shopping","disruption"];
  const tabLabels = ["Mi Plan","Cronograma","Compras","¿Qué pasó?"];

  if (!results) return (
    <div style={styles.page}>
      <div style={styles.searchBox}>
        <p style={styles.sectionLabel}>CALCULADORA DE PLAN</p>
        <h2 style={styles.searchTitle}>¿Cuál es tu objetivo?</h2>
        <div style={styles.heroSearch}>
          <input style={styles.heroInput} placeholder='Ej: "ganancia de peso", "mejorar el sueño"...'
            value={localQ} onChange={e=>setLocalQ(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"){ setQuery(localQ); setTimeout(handleSearch,50); }}} />
          <button style={styles.heroBtn} onClick={()=>{ setQuery(localQ); setTimeout(handleSearch,50); }}>Calcular →</button>
        </div>
        <div style={styles.pillGrid}>
          {OBJECTIVES.map(o=>(
            <button key={o.id} style={styles.pill} onClick={()=>{ setQuery(o.label); setTimeout(handleSearch,50); }}>
              {o.icon} {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.resultsHeader}>
        <div>
          <p style={styles.sectionLabel}>RESULTADOS PARA</p>
          <h2 style={styles.resultsTitle}>"{results.query}"</h2>
        </div>
        <div style={styles.daySelector}>
          <span style={styles.daySelectorLabel}>Plan de</span>
          {[7,14,30].map(d=>(
            <button key={d} style={{...styles.dayBtn,...(planDays===d?styles.dayBtnActive:{})}} onClick={()=>setPlanDays(d)}>{d} días</button>
          ))}
        </div>
      </div>

      {disruption && (
        <div style={styles.disruptionBanner}>
          <span style={styles.disruptionIcon}>{disruption==="sick"?"🤒":"✈️"}</span>
          <span>Plan recalculado para {disruption==="sick"?"estar enfermo":"estar de viaje"}</span>
          <button style={styles.disruptionClose} onClick={()=>handleDisruption("resume")}>✕ Retomar plan original</button>
        </div>
      )}

      <div style={styles.tabBar}>
        {tabs.map((t,i)=>(
          <button key={t} style={{...styles.tabBtn,...(activeTab===t?styles.tabBtnActive:{})}} onClick={()=>setActiveTab(t)}>
            {tabLabels[i]}
          </button>
        ))}
      </div>

      {activeTab==="plan" && <PlanTab plan={plan} recipes={results.recipes} setActiveRecipe={r=>{setActiveRecipe(r);setScreen("recipe");}} />}
      {activeTab==="schedule" && <ScheduleTab plan={plan} days={planDays} results={results} shoppingList={shoppingList} />}
      {activeTab==="shopping" && <ShoppingTab list={shoppingList} days={planDays} />}
      {activeTab==="disruption" && <DisruptionTab handleDisruption={handleDisruption} disruption={disruption} />}
      <ExportBar plan={plan} days={planDays} shoppingList={shoppingList} />
    </div>
  );
}

// ─── PLAN TAB ─────────────────────────────────────────────────────────────────
function PlanTab({ plan, recipes, setActiveRecipe }) {
  if (!plan) return null;
  const obj = OBJECTIVES.find(o=>o.id===plan.mainObj)||OBJECTIVES[0];
  const exercises = EXERCISES[plan.mainObj]||EXERCISES.energia;
  const supps = SUPPLEMENTS[plan.mainObj]||SUPPLEMENTS.energia;

  return (
    <div style={styles.planWrap}>
      <div style={styles.objectiveBadge}>
        <span style={styles.objectiveIcon}>{obj.icon}</span>
        <div>
          <p style={styles.objectiveLabelSmall}>Objetivo detectado</p>
          <p style={styles.objectiveLabelBig}>{obj.label}</p>
        </div>
      </div>

      <SectionTitle>Combinaciones de comidas</SectionTitle>
      <div style={styles.mealGrid}>
        <MealSlot label="☀️ Desayuno" recipes={plan.morning} setActiveRecipe={setActiveRecipe} />
        <MealSlot label="🌤 Almuerzo / Merienda" recipes={plan.lunch?.length ? plan.lunch : plan.morning.slice(0,1)} setActiveRecipe={setActiveRecipe} />
        <MealSlot label="🌙 Cena / Noche" recipes={plan.dinner?.length ? plan.dinner : recipes.filter(r=>r.meal==="cena").slice(0,2)} setActiveRecipe={setActiveRecipe} />
      </div>

      <SectionTitle>Ejercicio recomendado</SectionTitle>
      <div style={styles.exerciseGrid}>
        {exercises.map((e,i)=>(
          <div key={i} style={styles.exerciseCard}>
            <p style={styles.exerciseName}>{e.name}</p>
            <p style={styles.exerciseFreq}>{e.freq}</p>
            <p style={styles.exerciseNote}>{e.note}</p>
          </div>
        ))}
      </div>

      <SectionTitle>Suplementos sugeridos</SectionTitle>
      <div style={styles.suppList}>
        {supps.map((s,i)=>(
          <div key={i} style={styles.suppItem}>
            <span style={styles.suppDot}/>
            <span style={styles.suppText}>{s}</span>
          </div>
        ))}
        <p style={styles.suppDisclaimer}>⚕️ Consulta a tu médico antes de iniciar suplementos, especialmente si tomas medicamentos.</p>
      </div>

      <SectionTitle>Cómo combinarlas sin cansarte</SectionTitle>
      <div style={styles.comboGrid}>
        {COMBINATIONS.map((c,i)=>(
          <div key={i} style={styles.comboCard}>
            <p style={styles.comboDay}>{c.label}</p>
            <p style={styles.comboDesc}>{c.description}</p>
          </div>
        ))}
      </div>

      <SectionTitle>Todas las recetas de tu plan</SectionTitle>
      <div style={styles.recipeGrid}>
        {recipes.map(r=>(
          <RecipeCard key={r.id} recipe={r} onClick={()=>setActiveRecipe(r)} />
        ))}
      </div>
    </div>
  );
}

function MealSlot({ label, recipes, setActiveRecipe }) {
  return (
    <div style={styles.mealSlot}>
      <p style={styles.mealLabel}>{label}</p>
      {recipes.map(r=>(
        <div key={r.id} style={styles.mealItem} onClick={()=>setActiveRecipe(r)}>
          <div>
            <p style={styles.mealItemName}>{r.name}</p>
            <p style={styles.mealItemShort}>{r.short}</p>
          </div>
          <div style={styles.mealItemKcal}>{r.kcal} kcal</div>
        </div>
      ))}
    </div>
  );
}

// ─── SCHEDULE TAB ─────────────────────────────────────────────────────────────
function ScheduleTab({ plan, days, results, shoppingList }) {
  if (!plan) return null;
  const allRecipes = [...(plan.morning||[]), ...(plan.dinner||[])];
  const DAYS_LABEL = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  // Build flat list of exactly `days` days
  const dayItems = Array.from({length: days}, (_, idx) => {
    const weekDay = idx % 7; // 0=Mon … 6=Sun
    const isReset   = weekDay === 6;
    const isTherapy = weekDay === 5;
    const recipe    = allRecipes[idx % Math.max(allRecipes.length, 1)];
    return { idx, dayNum: idx+1, label: DAYS_LABEL[weekDay], isReset, isTherapy, recipe };
  });
  // Group into weeks
  const weeks = [];
  for (let w = 0; w < Math.ceil(days/7); w++) {
    weeks.push(dayItems.slice(w*7, w*7+7));
  }

  const exportMD = () => {
    const obj   = plan.mainObj || "Mi objetivo";
    let md = "# Plan Kéfir BioSystem — " + days + " días\n";
    md += "**Objetivo:** " + obj + "\n\n";
    weeks.forEach((week, wi) => {
      md += "## Semana " + (wi+1) + "\n";
      week.forEach(d => {
        const rec = d.isReset ? "Reset base (solo fermento)"
          : d.isTherapy ? "Receta terapéutica"
          : d.recipe ? (d.recipe.id + " — " + d.recipe.name)
          : "Base fermentada";
        md += "- **" + d.label + " " + d.dayNum + ":** " + rec + "\n";
      });
      md += "\n";
    });
    if (shoppingList?.length) {
      md += "## Lista de compras (" + days + " días)\n";
      shoppingList.forEach(i => {
        const qty = i.qty > 1000 ? (i.qty/1000).toFixed(1)+"kg/L" : i.qty+"g/ml";
        md += "- " + i.item + ": **" + qty + "** (" + i.weekly + "g/semana)\n";
      });
    }
    const blob = new Blob([md], {type:"text/markdown"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download=`plan-kefir-${days}dias.md`; a.click();
  };

  const exportPDF = () => {
    const obj = plan.mainObj || "Mi objetivo";
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Plan Kéfir BioSystem</title>
<style>
  body{font-family:Georgia,serif;max-width:900px;margin:40px auto;color:#1f2937;line-height:1.6;padding:0 24px}
  h1{color:#1b4332;border-bottom:3px solid #22c55e;padding-bottom:8px}
  h2{color:#2d6a4f;margin-top:32px;font-size:16px;letter-spacing:1px;text-transform:uppercase}
  .week{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:20px}
  .day{border:1px solid #e5e7eb;border-radius:6px;padding:8px;font-size:11px;min-height:70px}
  .day.reset{background:#d8f3dc22;border-color:#22c55e44}
  .day.therapy{background:#fffbeb;border-color:#f59e0b44}
  .day-label{font-weight:700;font-size:10px;color:#6b7280;margin-bottom:4px}
  .day-recipe{color:#1f2937;font-size:11px}
  .shop-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-top:12px}
  .shop-item{border:1px solid #e5e7eb;border-radius:6px;padding:10px;font-size:12px}
  .shop-item.bulk{border-color:#22c55e;background:#d8f3dc22}
  .shop-qty{font-size:16px;font-weight:700;color:#16a34a}
  .shop-weekly{font-size:10px;color:#6b7280}
  .disclaimer{margin-top:40px;padding:12px;background:#f9fafb;border-radius:6px;font-size:11px;color:#6b7280}
  @media print{body{margin:20px}h1{font-size:22px}.week{gap:3px}}
</style></head><body>
<h1>Plan Kéfir BioSystem · ${days} días</h1>
<p><strong>Objetivo:</strong> ${obj} &nbsp;·&nbsp; Generado el ${new Date().toLocaleDateString('es-EC')}</p>
${weeks.map((week, wi) => `
<h2>Semana ${wi+1}</h2>
<div class="week">
${week.map(d => {
  const cls = d.isReset ? "day reset" : d.isTherapy ? "day therapy" : "day";
  const rec = d.isReset ? "🔄 Reset base" : d.isTherapy ? "🌿 Terapéutica" : d.recipe ? `<strong>${d.recipe.id}</strong><br>${d.recipe.name.split(" ").slice(0,4).join(" ")}` : "Base fermentada";
  return `<div class="${cls}"><div class="day-label">${d.label} ${d.dayNum}</div><div class="day-recipe">${rec}</div></div>`;
}).join("")}
</div>`).join("")}
${shoppingList?.length ? `
<h2>Lista de compras (${days} días)</h2>
<div class="shop-grid">
${shoppingList.map(i=>`<div class="shop-item${i.bulk?" bulk":""}">
  <div style="font-weight:700;font-size:12px;margin-bottom:4px">${i.item}</div>
  <div class="shop-qty">${i.qty>1000?(i.qty/1000).toFixed(1)+"kg/L":i.qty+"g"}</div>
  <div class="shop-weekly">${i.weekly}g/semana</div>
</div>`).join("")}
</div>` : ""}
<p class="disclaimer">⚕️ Este plan es educativo. Consulta a tu médico antes de iniciar cualquier protocolo nutricional o de suplementación.</p>
</body></html>`;
    const w = window.open("","_blank");
    w.document.write(html); w.document.close();
    setTimeout(()=>w.print(), 500);
  };

  return (
    <div style={styles.planWrap}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:16}}>
        <p style={styles.sectionLabel}>CRONOGRAMA {days} DÍAS</p>
        <div style={{display:"flex",gap:8}}>
          <button style={styles.exportBtn} onClick={exportMD}>⬇ Exportar .md</button>
          <button style={styles.exportBtn} onClick={exportPDF}>🖨 Imprimir / PDF</button>
        </div>
      </div>
      {weeks.map((week, wi)=>(
        <div key={wi} style={styles.weekBlock}>
          <p style={styles.weekLabel}>Semana {wi+1}</p>
          <div style={{...styles.weekGrid, gridTemplateColumns:`repeat(${week.length},1fr)`}}>
            {week.map(d=>(
              <div key={d.idx} style={{...styles.dayCell,...(d.isReset?styles.dayCellReset:{}),...(d.isTherapy&&!d.isReset?{borderColor:"#f59e0b44",background:"#1a1a0a"}:{})}}>
                <p style={styles.dayCellDay}>{d.label} {d.dayNum}</p>
                {d.isReset
                  ? <p style={{...styles.dayCellRecipe,color:"#22c55e88"}}>🔄 Reset base</p>
                  : d.isTherapy
                    ? <p style={{...styles.dayCellRecipe,color:"#f59e0b"}}>🌿 Terapéutica</p>
                    : d.recipe
                      ? <><p style={{...styles.dayCellRecipe,fontWeight:700,color:"#22c55e"}}>{d.recipe.id}</p>
                         <p style={styles.dayCellRecipe}>{d.recipe.name.split(" ").slice(0,3).join(" ")}</p></>
                      : <p style={styles.dayCellRecipe}>Base fermentada</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={styles.infoBox}>
        <p style={styles.infoBoxTitle}>Criterio para cambiar de fórmula</p>
        <p style={styles.infoBoxText}>Cuando a los 7 días consecutivos tengas: energía ≥ 4/5, digestión Bristol 3–4, sin brotes de piel, sueño igual o mejor. Si no se cumple, prueba la siguiente receta de tu lista.</p>
      </div>
    </div>
  );
}

// ─── SHOPPING TAB ─────────────────────────────────────────────────────────────
function ShoppingTab({ list, days }) {
  if (!list) return <div style={styles.planWrap}><p style={styles.emptyState}>Busca un objetivo primero para generar tu lista.</p></div>;
  const bulk = list.filter(i=>i.bulk);
  const fresh = list.filter(i=>!i.bulk);
  const exportShoppingMD = () => {
    if (!list) return;
    let md = `# Lista de compras Kéfir BioSystem — ${days} días\n\n`;
    const bulk = list.filter(i=>i.bulk); const fresh = list.filter(i=>!i.bulk);
    md += `## 📦 Comprar en cantidad y procesar\n`;
    bulk.forEach(i => { md += `- [ ] **${i.item}**: ${i.qty>1000?(i.qty/1000).toFixed(1)+"kg/L":i.qty+"g"} total (${i.weekly}g/semana)\n`; });
    md += `\n## 🛒 Frescos y complementos\n`;
    fresh.forEach(i => { md += `- [ ] **${i.item}**: ${i.qty>1000?(i.qty/1000).toFixed(1)+"kg":i.qty+"g"} total (${i.weekly}g/semana)\n`; });
    md += `\n---\n_Generado el ${new Date().toLocaleDateString('es-EC')}_\n`;
    const blob = new Blob([md], {type:"text/markdown"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download=`compras-kefir-${days}dias.md`; a.click();
  };

  const exportShoppingPDF = () => {
    if (!list) return;
    const bulk = list.filter(i=>i.bulk); const fresh = list.filter(i=>!i.bulk);
    const grid = (items) => items.map(i=>`
      <div class="item${i.bulk?" bulk":""}">
        <div class="item-name">${i.item}</div>
        <div class="item-qty">${i.qty>1000?(i.qty/1000).toFixed(1)+"kg/L":i.qty+"g"}</div>
        <div class="item-week">${i.weekly}g/semana</div>
        <div class="chk">☐</div>
      </div>`).join("");
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Lista de compras Kéfir</title>
<style>
  body{font-family:Georgia,serif;max-width:900px;margin:32px auto;color:#1f2937;padding:0 20px}
  h1{color:#1b4332;border-bottom:3px solid #22c55e;padding-bottom:8px;font-size:22px}
  h2{color:#2d6a4f;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin-top:28px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-top:10px}
  .item{border:1px solid #e5e7eb;border-radius:6px;padding:10px;position:relative}
  .item.bulk{border-color:#22c55e;background:#d8f3dc11}
  .item-name{font-weight:700;font-size:12px;margin-bottom:4px}
  .item-qty{font-size:18px;font-weight:800;color:#16a34a}
  .item-week{font-size:10px;color:#6b7280;margin-top:2px}
  .chk{position:absolute;top:8px;right:8px;font-size:16px;color:#9ca3af}
  @media print{body{margin:16px}.grid{gap:4px}}
</style></head><body>
<h1>🛒 Lista de compras — ${days} días</h1>
<p style="color:#6b7280;font-size:13px">Generado el ${new Date().toLocaleDateString('es-EC')} · Kéfir BioSystem Andino 50+</p>
<h2>📦 Comprar en cantidad y procesar (fermentar, tostar, hidratar)</h2>
<div class="grid">${grid(bulk)}</div>
<h2>🛒 Frescos y complementos</h2>
<div class="grid">${grid(fresh)}</div>
</body></html>`;
    const w = window.open("","_blank"); w.document.write(html); w.document.close();
    setTimeout(()=>w.print(), 400);
  };

  return (
    <div style={styles.planWrap}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:4}}>
        <p style={styles.sectionLabel}>LISTA DE COMPRAS — {days} DÍAS</p>
        <div style={{display:"flex",gap:8}}>
          <button style={styles.exportBtn} onClick={exportShoppingMD}>⬇ Exportar .md</button>
          <button style={styles.exportBtn} onClick={exportShoppingPDF}>🖨 Imprimir / PDF</button>
        </div>
      </div>
      <div style={styles.shoppingHint}>
        <span>📦</span>
        <p>Los artículos <strong>en verde</strong> conviene comprarlos en mayor cantidad y procesarlos (fermentar, tostar, hidratarlos) para tenerlos listos.</p>
      </div>

      <SectionTitle>Comprar y procesar en mayor cantidad</SectionTitle>
      <div style={styles.shoppingGrid}>
        {bulk.map(i=>(
          <div key={i.item} style={{...styles.shoppingItem,...styles.shoppingItemBulk}}>
            <p style={styles.shoppingItemName}>{i.item}</p>
            <p style={styles.shoppingItemQty}>{i.qty > 1000 ? (i.qty/1000).toFixed(1)+"L/kg" : i.qty+"g/ml"}</p>
            <p style={styles.shoppingItemWeekly}>{i.weekly}g/ml por semana</p>
          </div>
        ))}
      </div>

      <SectionTitle>Frescos y complementos</SectionTitle>
      <div style={styles.shoppingGrid}>
        {fresh.map(i=>(
          <div key={i.item} style={styles.shoppingItem}>
            <p style={styles.shoppingItemName}>{i.item}</p>
            <p style={styles.shoppingItemQty}>{i.qty > 1000 ? (i.qty/1000).toFixed(1)+"kg" : i.qty+"g"}</p>
            <p style={styles.shoppingItemWeekly}>{i.weekly}g por semana</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DISRUPTION TAB ──────────────────────────────────────────────────────────
function DisruptionTab({ handleDisruption, disruption }) {
  return (
    <div style={styles.planWrap}>
      <p style={styles.sectionLabel}>¿QUÉ PASÓ EN TU PLAN?</p>
      <h3 style={styles.sectionH3}>Recalcula automáticamente</h3>
      <div style={styles.disruptionGrid}>
        <div style={{...styles.disruptionCard,...(disruption==="sick"?styles.disruptionCardActive:{})}} onClick={()=>handleDisruption("sick")}>
          <span style={styles.disruptionCardIcon}>🤒</span>
          <p style={styles.disruptionCardTitle}>Me enfermé</p>
          <p style={styles.disruptionCardDesc}>Gripe, resfriado o malestar general. Cambia a recetas L1, L2, K1, H1 que apoyan la recuperación sin estresar la digestión.</p>
        </div>
        <div style={{...styles.disruptionCard,...(disruption==="travel"?styles.disruptionCardActive:{})}} onClick={()=>handleDisruption("travel")}>
          <span style={styles.disruptionCardIcon}>✈️</span>
          <p style={styles.disruptionCardTitle}>Estoy de viaje</p>
          <p style={styles.disruptionCardDesc}>Viaje o excursión. Activa las versiones portátiles M1, M2, J1, J2 adaptadas a menor refrigeración y movilidad.</p>
        </div>
      </div>
      {disruption && (
        <div style={styles.resumeBox}>
          <p style={styles.resumeTitle}>¿Cuándo retomar tu plan original?</p>
          <p style={styles.resumeText}>
            {disruption==="sick"?"Cuando hayas estado 24 h sin fiebre ni síntomas agudos. Empieza con las recetas más suaves (yogur griego base, G2 mucílago) antes de volver a las de tu objetivo."
            :"Al volver a casa, retoma desde donde dejaste. Añade M4 (recuperador post-diarrea) si tuviste problemas digestivos durante el viaje. 2–3 días de transición con recetas base."}
          </p>
          <button style={styles.heroBtn} onClick={()=>handleDisruption("resume")}>Retomar plan original</button>
        </div>
      )}
      <div style={styles.infoBox}>
        <p style={styles.infoBoxTitle}>Regla de los 7 días perdidos</p>
        <p style={styles.infoBoxText}>Si pierdes hasta 7 días de tu plan, continúa exactamente donde lo dejaste sin penalizarte. Si pierdes más de 7 días, vuelve a la semana de adaptación (solo base fermentada) durante 3 días antes de retomar las fórmulas de objetivo.</p>
      </div>
    </div>
  );
}

// ─── RECIPE DETAIL ────────────────────────────────────────────────────────────
function RecipeDetail({ recipe: r, onBack }) {
  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Volver</button>
      <div style={styles.recipeDetailHero}>
        <div style={styles.recipeDetailBadge}>{r.family} · {r.id}</div>
        <h2 style={styles.recipeDetailTitle}>{r.name}</h2>
        <p style={styles.recipeDetailGoal}>{r.goal}</p>
        <div style={styles.recipeDetailMacros}>
          {[["kcal",r.kcal],["Proteína",r.protein+"g"],["Carbos",r.carbs+"g"],["Grasa",r.fat+"g"]].map(([l,v])=>(
            <div key={l} style={styles.macroBox}><p style={styles.macroVal}>{v}</p><p style={styles.macroLbl}>{l}</p></div>
          ))}
        </div>
        <div style={styles.tagRow}>
          {r.tags.map(t=><span key={t} style={styles.tag}>{t}</span>)}
          <span style={{...styles.tag,...styles.tagBase}}>{r.base}</span>
        </div>
      </div>

      <div style={styles.recipeSteps}>
        <div style={styles.recipeStep}>
          <div style={styles.recipeStepNum}>F1</div>
          <div style={styles.recipeStepContent}>
            <p style={styles.recipeStepTitle}>Base fermentada</p>
            <p style={styles.recipeStepText}>{r.f1}</p>
          </div>
        </div>

        {r.f2 && r.f2.length > 0 && (
          <div style={styles.recipeStep}>
            <div style={{...styles.recipeStepNum,background:"#10b981"}}>F2</div>
            <div style={styles.recipeStepContent}>
              <p style={styles.recipeStepTitle}>Segunda fermentación · {r.f2time}</p>
              <div style={styles.f2Table}>
                <div style={styles.f2Header}>
                  {["Ingrediente","Cantidad","Preparación"].map(h=><div key={h} style={styles.f2HeaderCell}>{h}</div>)}
                </div>
                {r.f2.map((row,i)=>(
                  <div key={i} style={{...styles.f2Row,...(i%2?styles.f2RowAlt:{})}}>
                    {[row.i,row.q,row.p].map((v,j)=><div key={j} style={styles.f2Cell}>{v}</div>)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={styles.recipeStep}>
          <div style={{...styles.recipeStepNum,background:"#f59e0b"}}>🍽</div>
          <div style={styles.recipeStepContent}>
            <p style={styles.recipeStepTitle}>Fresco al servir</p>
            {r.fresh.map((f,i)=>(
              <p key={i} style={styles.freshItem}>· {f}</p>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.whyBox}>
        <p style={styles.whyTitle}>¿Por qué funciona?</p>
        <p style={styles.whyText}>{r.why}</p>
      </div>

      {r.contraindications && r.contraindications.length > 0 && (
        <div style={styles.contraBox}>
          <p style={styles.contraTitle}>⚠️ Precauciones</p>
          {r.contraindications.map((c,i)=><p key={i} style={styles.contraItem}>· {c}</p>)}
        </div>
      )}
    </div>
  );
}

// ─── RECIPES GRID ─────────────────────────────────────────────────────────────
function RecipesGrid({ recipes, setActiveRecipe }) {
  const [filter, setFilter] = useState("all");
  const families = ["all","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"];
  const familyNames = {A:"Energía",B:"Huesos",C:"Corazón",D:"Cerebro",E:"Músculo",F:"Glucosa",G:"Intestino",H:"Inmunidad",I:"Específicas",J:"Express",K:"Post-cirugía",L:"Gripe",M:"Viaje",N:"Calor",O:"Estrés",P:"Encamados",Q:"Ayuno",R:"Niños",S:"Hormonal",T:"Cognitivo"};
  const filtered = filter==="all" ? recipes : recipes.filter(r=>r.family===filter);
  return (
    <div style={styles.page}>
      <p style={styles.sectionLabel}>TODAS LAS RECETAS</p>
      <div style={styles.filterBar}>
        {families.map(f=>(
          <button key={f} style={{...styles.filterBtn,...(filter===f?styles.filterBtnActive:{})}} onClick={()=>setFilter(f)}>
            {f==="all"?"Todas":f+" – "+(familyNames[f]||f)}
          </button>
        ))}
      </div>
      <div style={styles.recipeGrid}>
        {filtered.map(r=><RecipeCard key={r.id} recipe={r} onClick={()=>setActiveRecipe(r)} />)}
      </div>
    </div>
  );
}

// ─── CHAT SCREEN ─────────────────────────────────────────────────────────────
function ChatScreen({ messages, input, setInput, onSend, loading, chatRef, inputRef }) {
  return (
    <div style={styles.chatWrap}>
      <div style={styles.chatHeader}>
        <span style={styles.chatHeaderDot}/>
        <p style={styles.chatHeaderTitle}>Asistente Kéfir BioSystem</p>
        <p style={styles.chatHeaderSub}>Pregunta recetas, combinaciones, tiempos, ingredientes...</p>
      </div>
      <div ref={chatRef} style={styles.chatMessages}>
        {messages.map((m,i)=>(
          <div key={i} style={{...styles.chatBubble,...(m.role==="user"?styles.chatBubbleUser:styles.chatBubbleBot)}}>
            <p style={styles.chatBubbleText}>{m.text}</p>
          </div>
        ))}
        {loading && (
          <div style={styles.chatBubble}>
            <div style={styles.typingDots}>
              <span style={styles.dot}/><span style={{...styles.dot,animationDelay:"0.2s"}}/><span style={{...styles.dot,animationDelay:"0.4s"}}/>
            </div>
          </div>
        )}
      </div>
      <div style={styles.chatInputBar}>
        <input ref={inputRef} style={styles.chatInput} value={input} onChange={e=>setInput(e.target.value)}
          placeholder="Escribe tu pregunta..." onKeyDown={e=>e.key==="Enter"&&onSend()} />
        <button style={styles.chatSendBtn} onClick={onSend} disabled={loading}>
          {loading ? "..." : "→"}
        </button>
      </div>
      <div style={styles.chatSuggestions}>
        {["¿Puedo agregar mango a la F2 del kéfir?","¿Cuánto tiempo debo usar la fórmula E2?","Tengo canela en casa, ¿qué recetas puedo hacer?","¿Cuál es la diferencia entre B1 y B2?"].map(s=>(
          <button key={s} style={styles.chatSugBtn} onClick={()=>{ setInput(s); }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function RecipeCard({ recipe: r, onClick }) {
  const objColors = {energia:"#f59e0b",huesos:"#6366f1",corazón:"#ef4444",cerebro:"#8b5cf6",musculo:"#10b981",peso:"#f97316",glucosa:"#06b6d4",digestión:"#84cc16",sueño:"#6366f1",inmunidad:"#14b8a6",piel:"#ec4899",ansiedad:"#a78bfa",hormonal:"#f59e0b",recuperación:"#10b981",viaje:"#3b82f6"};
  const col = objColors[r.objectives[0]]||"#52b788";
  return (
    <div style={styles.recipeCard} onClick={onClick}>
      <div style={{...styles.recipeCardTop, borderTop:`3px solid ${col}`}}>
        <span style={{...styles.recipeCardId, color:col}}>{r.id}</span>
        <span style={styles.recipeCardBase}>{r.base}</span>
      </div>
      <p style={styles.recipeCardName}>{r.name}</p>
      <p style={styles.recipeCardShort}>{r.short}</p>
      <div style={styles.recipeCardBottom}>
        <span style={styles.recipeCardKcal}>{r.kcal} kcal</span>
        <span style={styles.recipeCardTime}>{r.f2time}</span>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <p style={styles.sectionTitle}>{children}</p>;
}

// ─── EXPORT BAR ──────────────────────────────────────────────────────────────
function ExportBar({ plan, days, shoppingList }) {
  if (!plan) return null;

  const exportPlanMD = () => {
    const obj = plan.mainObj || "Mi objetivo";
    const NL = "\n";
    let md = "# Plan Kéfir BioSystem — " + days + " días" + NL;
    md += "**Objetivo:** " + obj + NL + NL;
    const allR = [...(plan.morning||[]), ...(plan.lunch||[]), ...(plan.dinner||[])];
    md += "## Recetas del plan" + NL;
    allR.forEach(r => {
      md += "### " + r.id + " — " + r.name + NL;
      md += "- **Objetivo:** " + r.goal + NL;
      md += "- **Base:** " + r.base + " · " + r.kcal + " kcal · " + r.protein + "g proteína" + NL;
      md += "- **F1:** " + r.f1 + NL;
      if (r.f2?.length) {
        md += "- **F2 (" + r.f2time + "):**" + NL;
        r.f2.forEach(f => { md += "  - " + f.i + ": " + f.q + (f.p?" — "+f.p:"") + NL; });
      }
      md += "- **Fresco al servir:**" + NL;
      r.fresh.forEach(f => { md += "  - " + f + NL; });
      md += "- **Por qué funciona:** " + r.why + NL + NL;
    });
    if (shoppingList?.length) {
      md += "## Lista de compras (" + days + " días)" + NL;
      const bulk = shoppingList.filter(i=>i.bulk);
      const fresh = shoppingList.filter(i=>!i.bulk);
      md += "### Comprar en cantidad" + NL;
      bulk.forEach(i => { md += "- [ ] **" + i.item + "**: " + (i.qty>1000?(i.qty/1000).toFixed(1)+"kg/L":i.qty+"g") + " (" + i.weekly + "g/sem)" + NL; });
      md += NL + "### Frescos" + NL;
      fresh.forEach(i => { md += "- [ ] **" + i.item + "**: " + (i.qty>1000?(i.qty/1000).toFixed(1)+"kg":i.qty+"g") + " (" + i.weekly + "g/sem)" + NL; });
    }
    const blob = new Blob([md], {type:"text/markdown"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "plan-kefir-" + days + "dias.md"; a.click();
  };

  const exportPlanPDF = () => {
    const obj = plan.mainObj || "Mi objetivo";
    const allR = [...(plan.morning||[]), ...(plan.lunch||[]), ...(plan.dinner||[])];
    const bulk = shoppingList?.filter(i=>i.bulk)||[];
    const fresh = shoppingList?.filter(i=>!i.bulk)||[];
    const recipeHTML = allR.map(r => `
      <div class="recipe">
        <div class="recipe-header">
          <span class="recipe-id">${r.id}</span>
          <span class="recipe-name">${r.name}</span>
          <span class="recipe-kcal">${r.kcal} kcal · ${r.protein}g prot</span>
        </div>
        <div class="recipe-goal">${r.goal}</div>
        <div class="recipe-cols">
          <div><strong>F1:</strong> ${r.f1}</div>
          ${r.f2?.length ? '<div><strong>F2 ('+r.f2time+'):</strong> '+r.f2.map(f=>f.i+' '+f.q).join(', ')+'</div>' : ''}
          <div><strong>Fresco:</strong> ${r.fresh.join(' · ')}</div>
        </div>
        <div class="recipe-why"><strong>¿Por qué funciona?</strong> ${r.why}</div>
      </div>`).join("");
    const shopHTML = (items, title) => items.length ? `
      <h3>${title}</h3>
      <div class="shop-grid">
        ${items.map(i=>'<div class="shop-item'+(i.bulk?' bulk':'')+'"><div class="chk">☐</div><strong>'+i.item+'</strong><div class="qty">'+(i.qty>1000?(i.qty/1000).toFixed(1)+'kg/L':i.qty+'g')+'</div><div class="week">'+i.weekly+'g/sem</div></div>').join('')}
      </div>` : '';
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Plan Kéfir BioSystem</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Georgia,serif;color:#1f2937;padding:32px;max-width:900px;margin:0 auto}
  h1{color:#1b4332;font-size:26px;border-bottom:3px solid #22c55e;padding-bottom:10px;margin-bottom:6px}
  h2{color:#2d6a4f;font-size:15px;text-transform:uppercase;letter-spacing:1px;margin:28px 0 12px}
  h3{color:#374151;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;margin:20px 0 8px}
  .meta{color:#6b7280;font-size:13px;margin-bottom:28px}
  .recipe{border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:14px;break-inside:avoid}
  .recipe-header{display:flex;align-items:baseline;gap:10px;margin-bottom:6px}
  .recipe-id{font-size:11px;font-weight:800;color:#16a34a;letter-spacing:1px;background:#d8f3dc;padding:2px 8px;border-radius:10px}
  .recipe-name{font-size:15px;font-weight:700;color:#1b4332;flex:1}
  .recipe-kcal{font-size:11px;color:#6b7280}
  .recipe-goal{font-size:12px;color:#6b7280;font-style:italic;margin-bottom:8px}
  .recipe-cols{font-size:12px;color:#374151;line-height:1.7;margin-bottom:8px}
  .recipe-why{font-size:11px;color:#6b7280;line-height:1.5;border-top:1px solid #f3f4f6;padding-top:8px;margin-top:4px}
  .shop-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px}
  .shop-item{border:1px solid #e5e7eb;border-radius:6px;padding:10px;font-size:12px;position:relative}
  .shop-item.bulk{border-color:#22c55e;background:#f0fdf4}
  .chk{font-size:14px;color:#9ca3af;margin-bottom:4px}
  .qty{font-size:17px;font-weight:700;color:#16a34a}
  .week{font-size:10px;color:#9ca3af;margin-top:2px}
  .disclaimer{margin-top:32px;padding:10px 14px;background:#f9fafb;border-radius:6px;font-size:11px;color:#6b7280;border-left:3px solid #22c55e}
  @media print{body{padding:16px}h1{font-size:20px}.recipe{break-inside:avoid;margin-bottom:10px}}
</style></head><body>
<h1>Plan Kéfir BioSystem · ${days} días</h1>
<p class="meta"><strong>Objetivo:</strong> ${obj} &nbsp;·&nbsp; <strong>Generado:</strong> ${new Date().toLocaleDateString('es-EC')}</p>
<h2>Recetas del plan</h2>
${recipeHTML}
${bulk.length||fresh.length ? '<h2>Lista de compras</h2>'+shopHTML(bulk,'📦 Comprar en cantidad (fermentar, tostar, hidratar)')+shopHTML(fresh,'🛒 Frescos y complementos') : ''}
<p class="disclaimer">⚕️ Este plan es educativo y no reemplaza el consejo médico profesional. Consulta a tu médico antes de iniciar cualquier protocolo.</p>
</body></html>`;
    const w = window.open("","_blank"); w.document.write(html); w.document.close();
    setTimeout(()=>w.print(), 500);
  };

  return (
    <div style={styles.exportBar}>
      <span style={styles.exportBarLabel}>Exportar plan completo</span>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button style={styles.exportBtnGreen} onClick={exportPlanMD}>⬇ Markdown (.md)</button>
        <button style={styles.exportBtnGreen} onClick={exportPlanPDF}>🖨 PDF / Imprimir</button>
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const BG   = "#0a0f0d";
const BG2  = "#0f1a14";
const BG3  = "#142018";
const GREEN = "#22c55e";
const GREEN2 = "#16a34a";
const GREENPALE = "#15803d22";
const AMBER = "#f59e0b";
const TXT  = "#e2e8f0";
const TXT2 = "#94a3b8";
const BORDER = "#1e3a28";

const styles = {
  app:{ minHeight:"100vh", background:BG, color:TXT, fontFamily:"'Georgia', serif", overflowX:"hidden" },
  nav:{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", height:56, background:BG2, borderBottom:`1px solid ${BORDER}`, position:"sticky", top:0, zIndex:100, backdropFilter:"blur(10px)" },
  navLogo:{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" },
  navLogoMark:{ width:32, height:32, background:"linear-gradient(135deg,#22c55e,#16a34a)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#fff" },
  navLogoText:{ fontSize:14, fontWeight:600, letterSpacing:1, color:TXT, fontFamily:"'Georgia', serif" },
  navTabs:{ display:"flex", gap:4 },
  navTab:{ background:"none", border:"none", color:TXT2, fontSize:13, padding:"6px 14px", borderRadius:6, cursor:"pointer", fontFamily:"'Georgia', serif", transition:"all 0.2s" },
  navTabActive:{ background:GREENPALE, color:GREEN, border:`1px solid ${GREEN}33` },
  page:{ maxWidth:900, margin:"0 auto", padding:"24px 16px 60px" },
  // HERO
  hero:{ background:`linear-gradient(160deg, ${BG3} 0%, ${BG} 100%)`, borderRadius:20, padding:"60px 40px", margin:"20px 16px", position:"relative", overflow:"hidden", border:`1px solid ${BORDER}` },
  heroGlow:{ position:"absolute", top:-60, right:-60, width:300, height:300, background:"radial-gradient(circle, #22c55e22 0%, transparent 70%)", pointerEvents:"none" },
  heroContent:{ position:"relative", zIndex:1 },
  heroEyebrow:{ fontSize:10, letterSpacing:3, color:GREEN, marginBottom:16, fontFamily:"'Georgia', serif" },
  heroTitle:{ fontSize:"clamp(32px,6vw,56px)", fontWeight:700, lineHeight:1.1, color:TXT, marginBottom:16, fontFamily:"'Georgia', serif" },
  heroSub:{ fontSize:15, color:TXT2, maxWidth:500, lineHeight:1.7, marginBottom:32 },
  heroSearch:{ display:"flex", gap:10, flexWrap:"wrap" },
  heroInput:{ flex:1, minWidth:200, padding:"14px 18px", borderRadius:10, border:`1px solid ${BORDER}`, background:BG2, color:TXT, fontSize:14, outline:"none", fontFamily:"'Georgia', serif" },
  heroBtn:{ padding:"14px 24px", borderRadius:10, background:`linear-gradient(135deg, ${GREEN}, ${GREEN2})`, border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" },
  section:{ maxWidth:900, margin:"32px auto 0", padding:"0 16px" },
  sectionLabel:{ fontSize:10, letterSpacing:3, color:GREEN, marginBottom:12, fontFamily:"'Georgia', serif" },
  pillGrid:{ display:"flex", flexWrap:"wrap", gap:8 },
  pill:{ padding:"8px 16px", borderRadius:20, border:`1px solid ${BORDER}`, background:BG2, color:TXT2, fontSize:12, cursor:"pointer", transition:"all 0.2s", fontFamily:"'Georgia', serif" },
  featGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16, maxWidth:900, margin:"32px auto 0", padding:"0 16px" },
  featCard:{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:14, padding:20 },
  featIcon:{ fontSize:28, display:"block", marginBottom:10 },
  featTitle:{ fontSize:15, fontWeight:700, color:TXT, marginBottom:6 },
  featSub:{ fontSize:12, color:TXT2, lineHeight:1.5 },
  // SEARCH
  searchBox:{ padding:"40px 16px" },
  searchTitle:{ fontSize:28, fontWeight:700, color:TXT, marginBottom:24 },
  // RESULTS
  resultsHeader:{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom:24 },
  resultsTitle:{ fontSize:22, fontWeight:700, color:TXT, marginTop:4 },
  daySelector:{ display:"flex", alignItems:"center", gap:8, background:BG2, borderRadius:10, padding:"8px 12px", border:`1px solid ${BORDER}` },
  daySelectorLabel:{ fontSize:12, color:TXT2, marginRight:4 },
  dayBtn:{ padding:"4px 12px", borderRadius:6, border:`1px solid ${BORDER}`, background:"none", color:TXT2, fontSize:12, cursor:"pointer" },
  dayBtnActive:{ background:GREEN, color:"#fff", border:`1px solid ${GREEN}` },
  tabBar:{ display:"flex", gap:4, marginBottom:24, borderBottom:`1px solid ${BORDER}`, paddingBottom:0, overflowX:"auto" },
  tabBtn:{ padding:"10px 20px", background:"none", border:"none", color:TXT2, fontSize:13, cursor:"pointer", borderBottom:"2px solid transparent", whiteSpace:"nowrap", fontFamily:"'Georgia', serif" },
  tabBtnActive:{ color:GREEN, borderBottom:`2px solid ${GREEN}` },
  disruptionBanner:{ display:"flex", alignItems:"center", gap:12, background:"#7c2d1222", border:"1px solid #dc262644", borderRadius:10, padding:"12px 16px", marginBottom:20, flexWrap:"wrap" },
  disruptionIcon:{ fontSize:20 },
  disruptionClose:{ marginLeft:"auto", background:"none", border:`1px solid ${BORDER}`, color:TXT2, fontSize:12, padding:"4px 10px", borderRadius:6, cursor:"pointer" },
  // PLAN
  planWrap:{ paddingBottom:40 },
  objectiveBadge:{ display:"flex", alignItems:"center", gap:16, background:GREENPALE, border:`1px solid ${GREEN}33`, borderRadius:12, padding:"16px 20px", marginBottom:28 },
  objectiveIcon:{ fontSize:32 },
  objectiveLabelSmall:{ fontSize:10, letterSpacing:2, color:GREEN },
  objectiveLabelBig:{ fontSize:18, fontWeight:700, color:TXT },
  sectionTitle:{ fontSize:11, letterSpacing:2, color:GREEN, marginTop:32, marginBottom:12 },
  sectionH3:{ fontSize:18, fontWeight:700, color:TXT, marginBottom:20 },
  mealGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 },
  mealSlot:{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:12, padding:16 },
  mealLabel:{ fontSize:12, fontWeight:700, color:TXT2, marginBottom:12, letterSpacing:1 },
  mealItem:{ display:"flex", justifyContent:"space-between", alignItems:"center", background:BG3, borderRadius:8, padding:"10px 12px", marginBottom:8, cursor:"pointer", border:`1px solid ${BORDER}`, transition:"all 0.2s" },
  mealItemName:{ fontSize:13, fontWeight:600, color:TXT, marginBottom:2 },
  mealItemShort:{ fontSize:11, color:TXT2 },
  mealItemKcal:{ fontSize:13, color:GREEN, fontWeight:700, whiteSpace:"nowrap", marginLeft:8 },
  exerciseGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 },
  exerciseCard:{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:10, padding:16 },
  exerciseName:{ fontSize:14, fontWeight:700, color:TXT, marginBottom:4 },
  exerciseFreq:{ fontSize:11, color:AMBER, fontWeight:600, marginBottom:6, letterSpacing:0.5 },
  exerciseNote:{ fontSize:11, color:TXT2, lineHeight:1.5 },
  suppList:{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:12, padding:16 },
  suppItem:{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:10 },
  suppDot:{ width:6, height:6, borderRadius:"50%", background:GREEN, marginTop:6, flexShrink:0 },
  suppText:{ fontSize:13, color:TXT, lineHeight:1.5 },
  suppDisclaimer:{ fontSize:11, color:TXT2, marginTop:14, borderTop:`1px solid ${BORDER}`, paddingTop:12, lineHeight:1.5 },
  comboGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 },
  comboCard:{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:10, padding:14 },
  comboDay:{ fontSize:12, fontWeight:700, color:GREEN, marginBottom:6 },
  comboDesc:{ fontSize:12, color:TXT2, lineHeight:1.5 },
  recipeGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 },
  // RECIPE CARD
  recipeCard:{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:12, padding:16, cursor:"pointer", transition:"all 0.2s" },
  recipeCardTop:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 },
  recipeCardId:{ fontSize:12, fontWeight:800, letterSpacing:1 },
  recipeCardBase:{ fontSize:10, color:TXT2, background:BG3, padding:"2px 8px", borderRadius:10 },
  recipeCardName:{ fontSize:14, fontWeight:700, color:TXT, marginBottom:4, lineHeight:1.3 },
  recipeCardShort:{ fontSize:11, color:TXT2, lineHeight:1.4, marginBottom:12 },
  recipeCardBottom:{ display:"flex", justifyContent:"space-between" },
  recipeCardKcal:{ fontSize:12, color:GREEN, fontWeight:700 },
  recipeCardTime:{ fontSize:10, color:TXT2 },
  // SCHEDULE
  weekBlock:{ marginBottom:24 },
  weekLabel:{ fontSize:11, letterSpacing:2, color:GREEN, marginBottom:10 },
  weekGrid:{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 },
  dayCell:{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:8, padding:10, minHeight:80 },
  dayCellReset:{ background:"#1a2f2222", border:`1px solid ${GREEN}22` },
  dayCellDay:{ fontSize:10, color:TXT2, marginBottom:6, fontWeight:700 },
  dayCellRecipe:{ fontSize:10, color:TXT, lineHeight:1.4 },
  infoBox:{ background:GREENPALE, border:`1px solid ${GREEN}33`, borderRadius:12, padding:"16px 20px", marginTop:24 },
  infoBoxTitle:{ fontSize:13, fontWeight:700, color:GREEN, marginBottom:8 },
  infoBoxText:{ fontSize:12, color:TXT2, lineHeight:1.6 },
  // SHOPPING
  shoppingHint:{ display:"flex", gap:12, background:"#1a2f3f22", border:"1px solid #3b82f633", borderRadius:10, padding:"12px 16px", marginBottom:20, alignItems:"flex-start", fontSize:13, color:TXT2, lineHeight:1.5 },
  shoppingGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 },
  shoppingItem:{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:10, padding:14 },
  shoppingItemBulk:{ background:"#0d2218", border:`1px solid ${GREEN}44` },
  shoppingItemName:{ fontSize:13, fontWeight:700, color:TXT, marginBottom:4 },
  shoppingItemQty:{ fontSize:16, fontWeight:800, color:GREEN, marginBottom:2 },
  shoppingItemWeekly:{ fontSize:10, color:TXT2 },
  // DISRUPTION
  disruptionGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16, marginBottom:24 },
  disruptionCard:{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:14, padding:24, cursor:"pointer", transition:"all 0.2s" },
  disruptionCardActive:{ background:GREENPALE, border:`1px solid ${GREEN}44` },
  disruptionCardIcon:{ fontSize:36, display:"block", marginBottom:12 },
  disruptionCardTitle:{ fontSize:16, fontWeight:700, color:TXT, marginBottom:8 },
  disruptionCardDesc:{ fontSize:12, color:TXT2, lineHeight:1.6 },
  resumeBox:{ background:GREENPALE, border:`1px solid ${GREEN}33`, borderRadius:12, padding:"20px 24px", marginTop:24 },
  resumeTitle:{ fontSize:14, fontWeight:700, color:GREEN, marginBottom:10 },
  resumeText:{ fontSize:13, color:TXT2, lineHeight:1.7, marginBottom:16 },
  // RECIPE DETAIL
  backBtn:{ background:"none", border:`1px solid ${BORDER}`, color:TXT2, padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, marginBottom:24, fontFamily:"'Georgia', serif" },
  recipeDetailHero:{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:16, padding:28, marginBottom:24 },
  recipeDetailBadge:{ fontSize:11, letterSpacing:2, color:GREEN, marginBottom:8 },
  recipeDetailTitle:{ fontSize:28, fontWeight:700, color:TXT, marginBottom:8, lineHeight:1.2 },
  recipeDetailGoal:{ fontSize:14, color:TXT2, marginBottom:20, lineHeight:1.5, fontStyle:"italic" },
  recipeDetailMacros:{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:16 },
  macroBox:{ textAlign:"center", background:BG3, borderRadius:8, padding:"10px 16px" },
  macroVal:{ fontSize:20, fontWeight:800, color:GREEN },
  macroLbl:{ fontSize:10, color:TXT2, letterSpacing:1 },
  tagRow:{ display:"flex", flexWrap:"wrap", gap:6 },
  tag:{ fontSize:10, padding:"3px 10px", borderRadius:10, background:BG3, color:TXT2, border:`1px solid ${BORDER}` },
  tagBase:{ color:GREEN, border:`1px solid ${GREEN}44` },
  recipeSteps:{ display:"flex", flexDirection:"column", gap:16, marginBottom:24 },
  recipeStep:{ display:"flex", gap:16, alignItems:"flex-start" },
  recipeStepNum:{ width:40, height:40, borderRadius:10, background:GREEN2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff", flexShrink:0 },
  recipeStepContent:{ flex:1, background:BG2, border:`1px solid ${BORDER}`, borderRadius:12, padding:18 },
  recipeStepTitle:{ fontSize:13, fontWeight:700, color:TXT, marginBottom:10, letterSpacing:0.5 },
  recipeStepText:{ fontSize:13, color:TXT2, lineHeight:1.6 },
  f2Table:{ borderRadius:8, overflow:"hidden", border:`1px solid ${BORDER}` },
  f2Header:{ display:"grid", gridTemplateColumns:"2fr 1fr 2fr", background:BG3 },
  f2HeaderCell:{ padding:"8px 12px", fontSize:11, fontWeight:700, color:GREEN, letterSpacing:1 },
  f2Row:{ display:"grid", gridTemplateColumns:"2fr 1fr 2fr", background:BG2 },
  f2RowAlt:{ background:BG3 },
  f2Cell:{ padding:"8px 12px", fontSize:12, color:TXT2 },
  freshItem:{ fontSize:13, color:TXT2, lineHeight:1.8, marginBottom:2 },
  whyBox:{ background:GREENPALE, border:`1px solid ${GREEN}33`, borderRadius:12, padding:"20px 24px", marginBottom:16 },
  whyTitle:{ fontSize:12, fontWeight:700, color:GREEN, marginBottom:10, letterSpacing:1 },
  whyText:{ fontSize:13, color:TXT2, lineHeight:1.8 },
  contraBox:{ background:"#7c2d1222", border:"1px solid #dc262633", borderRadius:12, padding:"18px 22px" },
  contraTitle:{ fontSize:13, fontWeight:700, color:"#fca5a5", marginBottom:10 },
  contraItem:{ fontSize:12, color:"#fca5a5", lineHeight:1.7, marginBottom:4 },
  // FILTER BAR
  filterBar:{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:24 },
  filterBtn:{ padding:"5px 12px", borderRadius:16, border:`1px solid ${BORDER}`, background:BG2, color:TXT2, fontSize:11, cursor:"pointer", fontFamily:"'Georgia', serif" },
  filterBtnActive:{ background:GREEN, color:"#fff", border:`1px solid ${GREEN}` },
  // CHAT
  chatWrap:{ display:"flex", flexDirection:"column", height:"calc(100vh - 57px)" },
  chatHeader:{ padding:"16px 20px", background:BG2, borderBottom:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:12 },
  chatHeaderDot:{ width:8, height:8, borderRadius:"50%", background:GREEN, flexShrink:0, boxShadow:`0 0 8px ${GREEN}` },
  chatHeaderTitle:{ fontSize:14, fontWeight:700, color:TXT },
  chatHeaderSub:{ fontSize:11, color:TXT2, marginLeft:"auto" },
  chatMessages:{ flex:1, overflowY:"auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:12 },
  chatBubble:{ maxWidth:"80%", borderRadius:14, padding:"12px 16px", lineHeight:1.6 },
  chatBubbleUser:{ alignSelf:"flex-end", background:GREEN2, marginLeft:"auto" },
  chatBubbleBot:{ alignSelf:"flex-start", background:BG2, border:`1px solid ${BORDER}` },
  chatBubbleText:{ fontSize:13, color:TXT, whiteSpace:"pre-wrap" },
  typingDots:{ display:"flex", gap:5, alignItems:"center", height:20 },
  dot:{ width:6, height:6, borderRadius:"50%", background:TXT2, animation:"bounce 1s infinite" },
  chatInputBar:{ display:"flex", gap:8, padding:"12px 16px", background:BG2, borderTop:`1px solid ${BORDER}` },
  chatInput:{ flex:1, padding:"12px 16px", borderRadius:10, border:`1px solid ${BORDER}`, background:BG3, color:TXT, fontSize:13, outline:"none", fontFamily:"'Georgia', serif" },
  chatSendBtn:{ padding:"12px 20px", borderRadius:10, background:GREEN, border:"none", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer" },
  chatSuggestions:{ display:"flex", flexWrap:"wrap", gap:6, padding:"10px 16px", background:BG2, borderTop:`1px solid ${BORDER}` },
  chatSugBtn:{ fontSize:11, padding:"5px 12px", borderRadius:16, border:`1px solid ${BORDER}`, background:BG3, color:TXT2, cursor:"pointer", fontFamily:"'Georgia', serif" },
  exportBtn:{ padding:"8px 16px", borderRadius:8, border:`1px solid ${GREEN}`, background:BG2, color:GREEN, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Georgia', serif", whiteSpace:"nowrap", display:"inline-flex", alignItems:"center", gap:5 },
  exportBar:{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12,
    background:`linear-gradient(135deg, ${BG3}, ${BG2})`, border:`1px solid ${GREEN}44`,
    borderRadius:12, padding:"14px 20px", marginTop:32, position:"sticky", bottom:16, zIndex:10,
    backdropFilter:"blur(8px)" },
  exportBarLabel:{ fontSize:11, letterSpacing:2, color:GREEN, fontWeight:600 },
  exportBtnGreen:{ padding:"9px 18px", borderRadius:8, border:`1px solid ${GREEN}`,
    background:`linear-gradient(135deg,${GREEN},${GREEN2})`, color:"#fff", fontSize:13,
    fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", display:"inline-flex", alignItems:"center", gap:6 },
  // EMPTY
  emptyState:{ textAlign:"center", color:TXT2, fontSize:14, padding:40 },
};
