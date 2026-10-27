// APP.JS - LÓGICA COMPLETA Y FUNCIONAL DE EDUCSEX

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. MODO CLARO / MODO OSCURO
  // ==========================================
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const htmlElem = document.documentElement;

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      const currentTheme = htmlElem.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElem.setAttribute('data-bs-theme', newTheme);

      btnThemeToggle.innerHTML = newTheme === 'dark'
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    });
  }

  // ==========================================
  // 2. SIMULADOR DE MÉTODOS ANTICONCEPTIVOS
  // ==========================================
  const methodSelect = document.getElementById('methodSelect');
  const methodTitle = document.getElementById('methodTitle');
  const methodDesc = document.getElementById('methodDesc');
  const effectivenessRate = document.getElementById('effectivenessRate');
  const effectivenessBar = document.getElementById('effectivenessBar');
  const itsBadge = document.getElementById('itsBadge');
  const methodTip = document.getElementById('methodTip');

  const methodData = {
    condon: {
      title: "Condón Masculino / Femenino",
      desc: "Funda de látex que impide el paso de espermatozoides y microorganismos. Es el único método de barrera con doble protección.",
      rate: "98%",
      barWidth: "98%",
      barColor: "bg-success",
      itsText: "SÍ PREVIENE ITS",
      itsClass: "bg-success",
      tip: "Se debe colocar antes de cualquier contacto genital y revisar siempre la fecha de caducidad."
    },
    implante: {
      title: "Implante Subdérmico",
      desc: "Varilla flexible colocada bajo la piel del brazo que libera hormonas para evitar la ovulación de forma continua.",
      rate: "99.9%",
      barWidth: "99.9%",
      barColor: "bg-success",
      itsText: "NO PREVIENE ITS",
      itsClass: "bg-danger",
      tip: "Altamente eficaz contra embarazos, pero debe combinarse con condón para prevenir infecciones de transmisión sexual."
    },
    pildora: {
      title: "Pastillas Anticonceptivas (Diarias)",
      desc: "Tratamiento hormonal diario que inhibe la ovulación si se toma exactamente a la misma hora todos los días.",
      rate: "91%",
      barWidth: "91%",
      barColor: "bg-primary",
      itsText: "NO PREVIENE ITS",
      itsClass: "bg-danger",
      tip: "Requiere disciplina estricta de horario para mantener su nivel óptimo de protección."
    },
    ritmo: {
      title: "Método del Ritmo (Calendario)",
      desc: "Intento de calcular los días fértiles basándose en el calendario menstrual. Muy inestable e inseguro en jóvenes.",
      rate: "76%",
      barWidth: "76%",
      barColor: "bg-warning",
      itsText: "NO PREVIENE ITS",
      itsClass: "bg-danger",
      tip: "No es confiable en la adolescencia debido a las irregularidades naturales del ciclo menstrual."
    }
  };

  if (methodSelect) {
    methodSelect.addEventListener('change', (e) => {
      const data = methodData[e.target.value];
      if (!data) return;

      methodTitle.textContent = data.title;
      methodDesc.textContent = data.desc;
      effectivenessRate.textContent = data.rate;
      effectivenessBar.style.width = data.barWidth;
      effectivenessBar.className = `progress-bar progress-bar-striped progress-bar-animated ${data.barColor}`;

      itsBadge.textContent = data.itsText;
      itsBadge.className = `badge ${data.itsClass} fs-6`;
      methodTip.textContent = data.tip;
    });
  }

  // ==========================================
  // 3. DESPLEGABLE DE TARJETAS DE MITOS
  // ==========================================
  const mythCards = document.querySelectorAll('.myth-card');
  mythCards.forEach(card => {
    card.addEventListener('click', () => {
      const answer = card.querySelector('.myth-answer');
      if (answer) {
        answer.classList.toggle('d-none');
      }
    });
  });

  // ==========================================
  // 4. QUIZ INTERACTIVO MULTI-PREGUNTA
  // ==========================================
  const questionBlocks = document.querySelectorAll('.quiz-question-block');
  const scoreBadge = document.getElementById('scoreBadge');

  let questionResults = { 1: false, 2: false, 3: false, 4: false };

  questionBlocks.forEach(block => {
    const options = block.querySelectorAll('.quiz-opt');
    const feedback = block.querySelector('.quiz-feedback');
    const optionsContainer = block.querySelector('.quiz-options');
    const qIndex = optionsContainer ? optionsContainer.getAttribute('data-qindex') : null;

    options.forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';

        options.forEach(b => {
          b.classList.remove('btn-success', 'btn-danger', 'btn-outline-secondary');
          b.classList.add('btn-outline-secondary');
        });

        if (isCorrect) {
          btn.classList.remove('btn-outline-secondary');
          btn.classList.add('btn-success');
          feedback.className = 'quiz-feedback mt-2 p-2 rounded-3 alert alert-success d-block small';
          feedback.innerHTML = '<i class="fa-solid fa-circle-check me-1"></i><strong>¡Respuesta Correcta!</strong>';
          if (qIndex) questionResults[qIndex] = true;
        } else {
          btn.classList.remove('btn-outline-secondary');
          btn.classList.add('btn-danger');
          feedback.className = 'quiz-feedback mt-2 p-2 rounded-3 alert alert-danger d-block small';
          feedback.innerHTML = '<i class="fa-solid fa-circle-xmark me-1"></i><strong>Incorrecta.</strong> Revisa la guía previa.';
          if (qIndex) questionResults[qIndex] = false;
        }

        // Actualizar la puntuación global (X de 4)
        const totalCorrect = Object.values(questionResults).filter(v => v === true).length;
        if (scoreBadge) {
          scoreBadge.textContent = `Puntuación: ${totalCorrect} / 4`;
          scoreBadge.className = totalCorrect >= 3
            ? 'badge bg-success rounded-pill fs-6'
            : 'badge bg-warning text-dark rounded-pill fs-6';
        }
      });
    });
  });

  // ==========================================
  // 5. CECYAYUDANDO: chatbot con Gemini mediante backend seguro
  const chatDrawer = document.getElementById('chatDrawer');
  const btnFabChat = document.getElementById('btnFabChat');
  const btnOpenChat = document.getElementById('btnOpenChat');
  const btnCloseChat = document.getElementById('btnCloseChat');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const chatHistory = [];
  function toggleChat() { if (!chatDrawer) return; chatDrawer.classList.toggle('open'); if (chatDrawer.classList.contains('open')) setTimeout(() => chatInput?.focus(), 150); }
  if (btnFabChat) btnFabChat.addEventListener('click', toggleChat);
  if (btnOpenChat) btnOpenChat.addEventListener('click', toggleChat);
  if (btnCloseChat) btnCloseChat.addEventListener('click', toggleChat);
  function appendMessage(text, who='bot') {
    const div=document.createElement('div');
    div.className=who==='user'?'chat-msg user-msg bg-success text-white p-3 rounded-3 small align-self-end ms-auto shadow-sm':'chat-msg bot-msg bg-body-tertiary border p-3 rounded-3 small shadow-sm';
    div.style.maxWidth='90%'; div.textContent=text; chatMessages.appendChild(div); chatMessages.scrollTop=chatMessages.scrollHeight; return div;
  }
  function localGuidance(text) {
    const q = text.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const has = (...terms) => terms.some(term => q.includes(term));
    if (/\b(hola|buenos dias|buenas tardes|buenas noches|que onda|hey)\b/.test(q))
      return '¡Hola! 💚 Soy CecyAyudando. Puedo explicarte opciones anticonceptivas, cómo se usan, qué previenen, efectos secundarios, ITS, consentimiento y qué hacer si falló un método. Dime tu duda y te responderé directamente.';

    if (has('metodos anticonceptivos','métodos anticonceptivos','que metodos','tipos de anticonceptivos','cual metodo','cuál método','comparar metodos','comparar métodos'))
      return 'MÉTODOS ANTICONCEPTIVOS: ¿cuáles existen y qué hace cada uno?\n\n• IMPLANTE: una varilla que coloca personal capacitado bajo la piel del brazo. Es de los métodos más eficaces y dura varios años, según el producto. Puede cambiar el sangrado. No protege contra ITS.\n\n• DIU: hay DIU de cobre (sin hormonas) y hormonales. Son muy eficaces y de larga duración; requieren colocación y retiro por personal capacitado. No protegen contra ITS.\n\n• INYECCIÓN: se aplica con la periodicidad indicada por el servicio de salud. Puede cambiar el sangrado y, al suspenderla, el regreso de la fertilidad puede tardar en algunas personas. No protege contra ITS.\n\n• PASTILLAS, PARCHE O ANILLO: contienen hormonas y necesitan seguir instrucciones de uso. Algunas condiciones y medicamentos influyen en cuál es adecuado; consulta antes de elegir. No protegen contra ITS.\n\n• CONDÓN EXTERNO O INTERNO: método de barrera; debe usarse correctamente en cada relación. Es el método anticonceptivo que también reduce el riesgo de muchas ITS.\n\n• MÉTODOS DE CONOCIMIENTO DE LA FERTILIDAD: requieren seguimiento cuidadoso del ciclo y son más sensibles a errores.\n\nIDEA CLAVE: implante y DIU suelen ser más eficaces en uso habitual porque no dependen de recordar algo cada día. Para reducir riesgo de ITS, usa condón además de otro método. No hay un método ideal para todas las personas: influyen salud, preferencias, acceso y comodidad. Si me dices qué te importa más (larga duración, sin hormonas, evitar olvidos o doble protección), comparo las opciones.';

    if (has('anticoncepcion de emergencia','anticoncepción de emergencia','pastilla del dia','pastilla del día','sexo sin proteccion','sexo sin protección','se rompio el condon','se rompió el condón','condon se rompio','condón se rompió','olvido pastilla','olvidé la pastilla'))
      return 'ANTICONCEPCIÓN DE EMERGENCIA\n\nSi hubo sexo sin protección o falló el método, actúa cuanto antes: la anticoncepción de emergencia funciona mejor mientras más pronto se use. Según la opción disponible, puede utilizarse una pastilla de emergencia o un DIU de cobre colocado por personal de salud; algunas opciones pueden utilizarse hasta 5 días después, pero no todas tienen las mismas indicaciones. No esperes a tener síntomas.\n\nLa pastilla de emergencia no interrumpe un embarazo ya establecido y no protege las relaciones sexuales posteriores ni contra ITS. Hazte una prueba de embarazo si tu periodo se retrasa o aproximadamente 3 semanas después de la relación de riesgo. Busca hoy mismo una farmacia o centro de salud para que te indiquen la opción y el tiempo adecuados. Si hubo agresión o no fue consensuado, busca apoyo de una persona de confianza y atención médica.';

    if (has('efectos secundarios','efectos adversos','me puede hacer daño','daños del implante','efectos de la pastilla','engordar','sangrado'))
      return 'EFECTOS SECUNDARIOS: dependen del método y de cada persona. Con métodos hormonales pueden presentarse cambios en el sangrado, dolor de cabeza, náusea o sensibilidad mamaria; con el implante o DIU hormonal puede haber manchado o periodos irregulares. El DIU de cobre puede hacer la menstruación más abundante o dolorosa al principio. No todas las personas presentan efectos y estos datos no permiten predecir tu caso.\n\nConsulta a personal de salud si los síntomas son intensos, persisten o te preocupan. Busca atención urgente ante dolor fuerte, desmayo, dificultad para respirar o sangrado muy abundante. No suspendas ni cambies un medicamento prescrito sin orientación.';

    if (has('condon','preservativo','its','infeccion de transmision','infección de transmisión','vih','sida','clamidia','gonorrea','herpes','vph'))
      return 'CONDÓN E ITS\n\nEl condón externo o interno reduce el riesgo de embarazo y de muchas infecciones de transmisión sexual cuando se usa correctamente durante toda la relación. No elimina totalmente el riesgo, especialmente para infecciones que se transmiten por contacto de piel no cubierta.\n\nUsa uno nuevo cada vez, revisa la fecha y el empaque, colócalo antes del contacto genital y no uses dos condones a la vez. Los lubricantes a base de agua o silicona suelen ser compatibles con condones de látex; los aceites pueden dañarlos. Si hubo exposición, rotura o síntomas, consulta sobre pruebas y atención. Muchos ITS pueden no dar síntomas.';

    if (has('implante','diu','pastillas','pildoras','píldoras','inyeccion','inyección','parche','anillo'))
      return 'Sobre ese método: la eficacia depende del tipo y del uso. El implante y los DIU son opciones de larga duración y muy eficaces; las pastillas, el parche y el anillo requieren seguir sus instrucciones; la inyección debe repetirse en el intervalo indicado. Estos métodos no previenen ITS, así que considera condón para protección adicional.\n\nPara decirte cómo funciona en concreto, qué tan eficaz es y cuáles son sus posibles efectos, dime cuál método quieres conocer. La elección más segura depende de tu salud y debe confirmarse con personal de salud.';

    if (has('consentimiento','presion','presión','obligar','no quiero','violencia','abuso','me insiste','me obliga'))
      return 'El consentimiento debe ser libre, claro, informado y puede retirarse en cualquier momento. Decir que sí por miedo, presión, amenazas o porque la otra persona insiste no es consentimiento. Nadie tiene derecho a tocarte o forzarte. Si estás en peligro inmediato, busca un lugar seguro y contacta servicios de emergencia o una persona adulta de confianza. No tienes que contarme detalles personales para recibir orientación.';

    if (has('embarazo','prueba de embarazo','retraso','retraso menstrual'))
      return 'Si te preocupa un embarazo, una prueba de orina suele ser más fiable desde el primer día de retraso menstrual; si no sabes cuándo debía llegar tu periodo, hazla alrededor de 3 semanas después de la relación de riesgo. Si sale negativa pero sigue el retraso, repítela o consulta a personal de salud. Si la relación sin protección fue reciente, pregunta cuanto antes por anticoncepción de emergencia. No se puede confirmar un embarazo solo por síntomas.';

    if (has('centro de salud','clinica','clínica','medico','médico','donde ir','dónde ir','villa victoria'))
      return 'Puedes acudir al centro de salud público más cercano y preguntar por servicios amigables para adolescentes, anticoncepción, anticoncepción de emergencia y pruebas de ITS. Los horarios y servicios pueden cambiar, por eso conviene confirmarlos directamente. No voy a inventar direcciones ni teléfonos. Puedes preparar estas preguntas: ¿qué métodos ofrecen?, ¿cuál es gratuito?, ¿necesito cita?, ¿cómo manejan la privacidad de adolescentes?';

    if (has('secreto','anonimo','anónimo','privacidad','guardan','datos personales'))
      return 'Para cuidar tu privacidad, evita escribir nombres completos, dirección, teléfono, escuela, contraseñas o datos que te identifiquen. Si el chat está conectado a Gemini, el mensaje se envía al servicio para generar la respuesta y puede estar sujeto a sus políticas. No puedo prometer confidencialidad absoluta ni sustituir los avisos de privacidad del servicio.';

    return 'Quiero responder exactamente lo que preguntas. Puedo ayudarte con métodos anticonceptivos, cómo se usan, eficacia, efectos secundarios, anticoncepción de emergencia, ITS, pruebas, consentimiento y relaciones sanas. Escribe tu pregunta con un poco más de detalle —sin incluir nombres ni datos personales— y te daré una explicación concreta, con opciones y próximos pasos.';
  }
  async function getBotResponse(text) {
    try { const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,history:chatHistory.slice(0,-1).slice(-8)})});
      if(!response.ok) throw new Error('IA no disponible'); const data=await response.json(); if(data&&typeof data.reply==='string'&&data.reply.trim()) return data.reply.trim(); throw new Error('Respuesta vacía');
    } catch (_) { return localGuidance(text)+'\n\n(Modo de orientación local: para respuestas ampliadas con IA, inicia el servidor y configura Gemini.)'; }
  }
  async function sendChatMessage(text) {
    if(!text||!chatMessages||!chatInput) return; appendMessage(text,'user'); chatHistory.push({role:'user',content:text}); chatInput.value=''; chatInput.disabled=true;
    const typing=document.createElement('div'); typing.className='chat-msg bot-msg bg-body-tertiary border p-3 rounded-3 small chat-typing'; typing.setAttribute('aria-label','CecyAyudando está escribiendo'); typing.innerHTML='<span></span><span></span><span></span>'; chatMessages.appendChild(typing); chatMessages.scrollTop=chatMessages.scrollHeight;
    const reply=await getBotResponse(text); typing.remove(); appendMessage(reply); chatHistory.push({role:'assistant',content:reply}); chatInput.disabled=false; chatInput.focus();
  }
  if(chatForm) chatForm.addEventListener('submit',e=>{e.preventDefault();const text=chatInput.value.trim();if(text) sendChatMessage(text);});
  document.querySelectorAll('.chat-prompt').forEach(button=>button.addEventListener('click',()=>sendChatMessage(button.textContent.trim())));

  // Guía interactiva de orientación inicial: no diagnostica ni elige por la persona.
  const routePriority = document.getElementById('routePriority');
  const routeRoutine = document.getElementById('routeRoutine');
  const routeSupport = document.getElementById('routeSupport');
  const routeResult = document.getElementById('routeResult');
  const btnRouteAdvice = document.getElementById('btnRouteAdvice');
  const btnRouteChat = document.getElementById('btnRouteChat');
  function buildRouteAdvice() {
    if (!routeResult) return;
    const priority = routePriority?.value || 'both';
    const routine = routeRoutine?.value || 'unsure';
    const support = routeSupport?.value || 'learn';
    let title = 'Tu siguiente paso';
    let details = [];
    if (priority === 'both') {
      title = 'Prioridad: doble protección';
      details.push('Aprende a usar correctamente el condón externo o interno para reducir el riesgo de embarazo y de muchas ITS.');
      details.push('Si también deseas mayor eficacia anticonceptiva, pregunta en un centro de salud por implante, DIU, pastillas o inyección y considera combinarlos con condón.');
    } else if (priority === 'pregnancy') {
      title = 'Prioridad: prevenir embarazo';
      details.push('El implante y los DIU suelen ser de las opciones más eficaces en uso habitual porque no requieren recordar una dosis diaria.');
      details.push('Un profesional puede revisar tus preferencias, antecedentes y posibles interacciones antes de elegir. Estos métodos no protegen contra ITS.');
    } else if (priority === 'hormonefree') {
      title = 'Prioridad: opciones sin hormonas';
      details.push('Pregunta por el DIU de cobre y los métodos de barrera. El DIU de cobre es muy eficaz y de larga duración; el condón también reduce el riesgo de muchas ITS.');
      details.push('Los métodos de conocimiento de la fertilidad requieren aprendizaje y seguimiento cuidadoso y son más sensibles a errores.');
    } else {
      title = 'Prioridad: actuar pronto';
      details.push('Si hubo sexo sin protección o falló el método, busca hoy orientación sobre anticoncepción de emergencia: cuanto antes, mejor. Algunas opciones tienen ventanas de hasta 5 días y no todas son iguales.');
      details.push('La anticoncepción de emergencia no protege contra ITS ni las relaciones posteriores. Consulta también si necesitas pruebas o atención por una exposición.');
    }
    if (routine === 'long') details.push('Por tu preferencia de larga duración, infórmate sobre implante y DIU (de cobre u hormonal).');
    if (routine === 'daily') details.push('Si puedes mantener una rutina diaria, puedes preguntar por pastillas; también compara parche, anillo o inyección según disponibilidad e indicación.');
    if (routine === 'simple') details.push('Si prefieres algo que se usa en cada relación, aprende sobre condón externo o interno y practica cómo colocarlo correctamente.');
    if (support === 'provider') details.push('Pregunta en consulta: eficacia en uso habitual, efectos secundarios, interacciones con medicamentos, costo, disponibilidad y qué hacer si olvidas una dosis.');
    if (support === 'urgent' && priority !== 'emergency') details.push('Como necesitas orientación por algo reciente, no esperes a que aparezcan síntomas: contacta pronto a un servicio de salud.');
    routeResult.innerHTML = `<h3>${title}</h3><ul>${details.map(item => `<li>${item}</li>`).join('')}</ul><p class="small mb-0 text-muted"><strong>Importante:</strong> esta guía es educativa, no es diagnóstico ni prescripción. La mejor opción depende de tu salud y preferencias. El condón es el método que también reduce el riesgo de muchas ITS.</p>`;
    routeResult.classList.remove('d-none');
  }
  btnRouteAdvice?.addEventListener('click', buildRouteAdvice);
  btnRouteChat?.addEventListener('click', () => {
    if (chatDrawer && !chatDrawer.classList.contains('open')) chatDrawer.classList.add('open');
    const prompt = `Ayúdame a comparar métodos anticonceptivos. Mi prioridad es ${routePriority?.selectedOptions[0]?.text || 'conocer opciones'}, prefiero ${routeRoutine?.selectedOptions[0]?.text || 'aún no sé'} y necesito ${routeSupport?.selectedOptions[0]?.text || 'información general'}. Explica opciones, eficacia relativa, protección contra ITS y qué preguntar en un centro de salud.`;
    sendChatMessage(prompt);
  });
  const btnClearChat = document.getElementById('btnClearChat');
  btnClearChat?.addEventListener('click', () => {
    chatHistory.length = 0;
    if (chatMessages) chatMessages.innerHTML = '<div class="chat-msg bot-msg bg-body-tertiary border p-3 rounded-3 small">Chat limpio. ¡Hola de nuevo! Pregúntame lo que necesites sobre salud sexual, métodos anticonceptivos o prevención.</div>';
  });

});
