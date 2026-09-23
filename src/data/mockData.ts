import { NewsItem, PromoCode, RewardPrize } from '../types';

export const INITIAL_FC_MOBILE_NEWS: NewsItem[] = [
  {
    id: 'fcm-1',
    game: 'fcmobile',
    title: 'Nueva Gran Actualización de Jugabilidad: Nerf a Centros Chetados y Rework de Regates',
    summary: '📌 RESUMEN CLAVE: 1) Reducción del 35% en la efectividad de centros aéreos y cabezazos teledirigidos. 2) Mejora de respuesta al botón de Disparo Potente y pases al hueco rasos. 3) Nuevo sistema de emparejamiento H2H para evitar rivales con lag en Cara a Cara. 4) Se recomienda cambiar la formación a 4-3-3 Ofensiva o 4-1-2-1-2 para aprovechar el juego por el centro.',
    content: `La última actualización de jugabilidad de FC Mobile transforma drásticamente el meta competitivo del juego. Si estabas acostumbrado a correr por la banda y centrar balones al área, notarás que los defensores centrales ahora interceptan con mayor prioridad y los cabezazos pierden precisión.
    
Análisis Táctico Exclusivo para la Comunidad:
• Nerf a los centros y cabezazos: Los extremos veloces ya no podrán definir partidos solo enviando centros aéreos. El balón ahora pierde comba y los porteros salen con mayor agresividad.
• Regates más ágiles: Filigranas como la Ruleta y el Cambio de Banda responden 0.2 segundos más rápido tras presionar el botón de sprint.
• Disparo Potente Ajustado: La animación de carga ahora es más compacta, permitiendo disparar desde fuera del área sin ser despojado fácilmente por el defensor rival.
• Formaciones Recomendadas: La 4-3-3 Ofensiva y la 4-1-2-1-2 Estrecha pasan a ser las reinas del modo Cara a Cara (H2H) gracias a la superioridad numérica en la creación de juego interior.`,
    category: 'Actualización Gameplay',
    date: '2026-09-22',
    author: 'Análisis Táctico Olvis Bolt',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    sourceUrl: '#informe-exclusivo-fcm-1',
    featured: true,
    tags: ['Gameplay 2026', 'Meta H2H', 'Nerf Centros', 'Tácticas'],
    commentsCount: 42,
  },
  {
    id: 'fcm-2',
    game: 'fcmobile',
    title: 'Filtración del Mercado de Fichajes: Jugadores que Multiplicarán su Valor este Jueves',
    summary: '📌 RESUMEN CLAVE: 1) Los intercambios del fin de semana requerirán cartas delanteras de 96 a 99 OVR de ligas europeas principales. 2) Consejos de inversión: Comprar extremos baratos antes del reseteo del jueves para venderlos con 40% de margen. 3) Mascherano Comodín de Rango: No gastarlo hasta desbloquear los Iconos Prime filtrados de 103 OVR.',
    content: `A través de las listas de requisitos de los próximos intercambios del juego, hemos identificado qué cartas van a disparar su precio en el Mercado de Transferencias antes de que suban.
    
Guía de Inversión y Mercado:
• Cartas para tradear hoy mismo: Compra jugadores de 96 a 98 OVR que estén rondando el precio mínimo del mercado. El jueves se activará un intercambio de 3 cartas 96+ por un sobre garantizado de 100+, disparando la demanda instantánea.
• No vendas tus monedas ahora: Guarda tus millones para el reseteo semanal. El precio de los defensas centrales bajará un 15% por la apertura masiva de sobres del pase.
• Alerta de Rango Mascherano: Se filtraron cartas de Iconos con 103 OVR (Zidane y Ronaldo Nazário). No utilices tus comodines de rango en cartas inferiores a 101 OVR para evitar arrepentimientos.`,
    category: 'Mercado y Tradéos',
    date: '2026-09-21',
    author: 'Inversiones Olvis Bolt',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop',
    sourceUrl: '#informe-exclusivo-fcm-2',
    featured: true,
    tags: ['Mercado', 'Tradéos', 'Subida Monedas', 'Filtraciones'],
    commentsCount: 38,
  },
  {
    id: 'fcm-3',
    game: 'fcmobile',
    title: 'Evento Retro Stars y Pase Estelar: Misiones Ocultas para Conseguir Jugadores 102+ Gratis',
    summary: '📌 RESUMEN CLAVE: 1) El evento Retro Stars incluye 4 capítulos temáticos con cartas clásicas de todas las temporadas. 2) Recompensa gratuita garantizada: Completando 15 partidos de habilidad se desbloquea un sobre 100-103 intransferible. 3) Truco del pase: Jugar en Modo Entrenador en segundo plano para completar los 300 puntos diarios sin gastar energía.',
    content: `El evento Retro Stars llega como el evento más generoso del mes. Con cartas icónicas con estadísticas nostálgicas y medias de hasta 104 OVR, todos los usuarios pueden mejorar su plantilla sin gastar dinero real.
    
Paso a Paso para Conseguir las Recompensas Gratis:
• Capítulo Habilidades Diarias: Completa los 3 minijuegos cada mañana. Otorgan 120 Fichas Retro Stars diarias.
• Modo Entrenador Automatizado: Deja corriendo 5 partidos en Modo Entrenador mientras estudias o descansas; esto completa los objetivos del Pase Estelar sin esfuerzo.
• Intercambio 101 OVR: Entrega 2 cartas 98 repetidas del evento para obtener el sobre con probabilidad de cartas Prime. No entregues cartas transferibles.`,
    category: 'Eventos del Juego',
    date: '2026-09-20',
    author: 'Estrategias FC Mobile',
    imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop',
    sourceUrl: '#informe-exclusivo-fcm-3',
    featured: false,
    tags: ['Retro Stars', 'Cartas Gratis', 'Pase Estelar', 'OVR 104'],
    commentsCount: 29,
  },
  {
    id: 'fcm-4',
    game: 'fcmobile',
    title: 'Matemática de Rangos con Dudek y Mascherano: Cómo Subir al Rango Rojo al 100% Seguro',
    summary: '📌 RESUMEN CLAVE: 1) Nunca subas rango con 50% de probabilidad; el juego penaliza el fallo perdiendo la carta. 2) Subida Óptima: Usa 1 Mascherano para Rango Verde (100%), 1 para Rango Azul (100%), 2 para Rango Morado (100%) y 5 para Rango Rojo (100%). 3) Las cartas en Rango Rojo desbloquean 15 puntos de habilidad y +12 en atributos acelerados.',
    content: `Muchos jugadores cometen el error de arriesgar cartas Mascherano con un 40% o 50% de probabilidad de éxito. La probabilidad acumulada en el código del juego hace que más del 65% de los intentos fallen cuando no se alcanza el 100%.
    
Estrategia Matemática de Rangos:
• Rango Verde (Nivel 5): Requiere 1 Mascherano (100% de éxito). Asigna +5 a ritmo o tiro.
• Rango Azul (Nivel 10): Requiere 1 Mascherano adicional (100% de éxito). Desbloquea habilidad secundaria.
• Rango Morado (Nivel 15): Requiere 2 Mascheranos (100% de éxito). No uses solo 1 (es 50% de fracaso).
• Rango Rojo (Nivel 20): Requiere 5 Mascheranos asegurados. Esta es la diferencia entre competir en Campeón FC o quedarse estancado en Clase Mundial.`,
    category: 'Guías de Rendimiento',
    date: '2026-09-18',
    author: 'Laboratorio de Jugadores Bolt',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop',
    sourceUrl: '#informe-exclusivo-fcm-4',
    featured: false,
    tags: ['Rangos', 'Mascherano', 'Porcentajes', 'Entrenamiento'],
    commentsCount: 31,
  },
];

export const INITIAL_ROBLOX_NEWS: NewsItem[] = [
  {
    id: 'rbx-1',
    game: 'roblox',
    title: 'The Hunt 2026 & Innovation Games: Lista Secreta de Objetos y Accesorios Gratis para tu Avatar',
    summary: '📌 RESUMEN CLAVE: 1) 25 experiencias oficiales participan otorgando insignias y cosméticos 3D gratis. 2) Objeto principal: Las Alas Holográficas y la Corona de Cristal Cibernética no cuestan Robux. 3) Ruta rápida: En nuestra comunidad publicamos el orden óptimo de juegos para completar todas las insignias en menos de 45 minutos.',
    content: `Ha comenzado la nueva edición del mega-evento global de Roblox. En lugar de gastar Robux en la tienda de avatares, los usuarios pueden desbloquear accesorios de rareza mítica completando misiones secretas en juegos seleccionados.
    
Cómo Desbloquear los Accesorios Gratis Hoy:
• Alas Holográficas: Completa el circuito de parkour en la sala central del evento interactuando con el pedestal dorado.
• Corona Cibernética: Reúne 10 insignias en experiencias como Pet Simulator 99, Arsenal y Dress to Impress.
• Efectos de Chat Exclusivos: Canjea el código del evento en el portal de recompensas de tu cuenta.
• Juega en Clan: Los fines de semana abrimos servidores VIP sin costo para que todos consigamos los ítems juntos.`,
    category: 'Eventos Globales',
    date: '2026-09-22',
    author: 'Comunidad Roblox Olvis Bolt',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    sourceUrl: '#informe-exclusivo-rbx-1',
    featured: true,
    tags: ['The Hunt', 'Accesorios Gratis', 'Avatares', 'Insignias'],
    commentsCount: 52,
  },
  {
    id: 'rbx-2',
    game: 'roblox',
    title: 'Blox Fruits Actualización Dragón y Rework de Espadas: Guía de Misiones del Mar 3',
    summary: '📌 RESUMEN CLAVE: 1) Llegada de la Fruta del Dragón Despertada con ataques masivos de área y vuelo libre. 2) Nuevos códigos de reinicio de estadísticas y x2 de experiencia activos durante 72 horas. 3) Cuidado con estafas: No aceptes intercambios con enlaces sospechosos fuera de la plataforma oficial.',
    content: `La actualización más esperada del juego estrella de Roblox ya está disponible con contenido renovado en el Tercer Mar (Sea 3).
    
Detalles del Rework de Blox Fruits:
• Fruta del Dragón Renovada: La transformación ahora resiste un 20% más de daño contra ataques tipo espada y añade una ráfaga ígnea teledirigida.
• Nuevos Jefes de Incursión: Derrota al Capitán Marino Legendario para obtener fragmentos dorados y materiales de forja.
• Balanceo de PVP: Se eliminó el combo infinito con la espada CDK para dar oportunidades de respuesta a los jugadores que no tienen ping bajo.
• Revisa nuestra pestaña de Códigos en este panel para activar los multiplicadores de maestría al instante.`,
    category: 'Juegos Populares',
    date: '2026-09-21',
    author: 'Cazador de Frutas Bolt',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop',
    sourceUrl: '#informe-exclusivo-rbx-2',
    featured: true,
    tags: ['Blox Fruits', 'Dragón', 'Mar 3', 'Códigos 2X'],
    commentsCount: 44,
  },
  {
    id: 'rbx-3',
    game: 'roblox',
    title: 'Nueva Economía de Robux 2026: Reducción de Comisiones y Servidores VIP Accesibles',
    summary: '📌 RESUMEN CLAVE: 1) Roblox redujo la comisión en pases de creadores pequeños para fomentar los servidores comunitarios. 2) Seguridad reforzada: Verificación de correo y protección de dos factores activada por defecto. 3) Nuestro clan proporciona servidores privados gratuitos para evitar hackers en partidas públicas.',
    content: `Roblox ha actualizado su modelo de economía para creadores independientes y dueños de comunidades. Ahora es mucho más fácil mantener servidores VIP gratuitos para comunidades como Olvis Bolt.
    
Novedades Importantes para los Jugadores:
• Servidores VIP Comunitarios: Ya no es necesario pagar 100 Robux mensuales para jugar tranquilamente con amigos en juegos competitivos.
• Protección contra pérdidas: Nuevos límites de seguridad impiden que usuarios maliciosos accedan a tus ítems limitados sin confirmación vía aplicación de autenticación.
• Monedas de clan: Recuerda que en nuestro panel puedes juntar Rayos Bolt haciendo tareas para canjear tus tarjetas de regalo oficiales.`,
    category: 'Economía y Seguridad',
    date: '2026-09-19',
    author: 'Seguridad y Comunidad Bolt',
    imageUrl: 'https://images.unsplash.com/photo-1612287233215-680455799793?q=80&w=1200&auto=format&fit=crop',
    sourceUrl: '#informe-exclusivo-rbx-3',
    featured: false,
    tags: ['Robux', 'Servidores VIP', 'Seguridad', 'Clan Bolt'],
    commentsCount: 36,
  },
  {
    id: 'rbx-4',
    game: 'roblox',
    title: 'Juegos Tendencia: Guía Secreta de Blade Ball y Fisch para Ganar Monedas Rápido',
    summary: '📌 RESUMEN CLAVE: 1) En Blade Ball: Cómo calibrar la tecla de desvío para responder bolas a más de 120 km/h sin habilidades pagas. 2) En Fisch: Ubicación del Lago Encantado y cómo sacar peces míticos de 10.000 monedas con cañas básicas. 3) Códigos de monedas y fichas disponibles en la pestaña de códigos.',
    content: `Las experiencias de reflejos y pesca interactiva dominan la tabla de popularidad esta semana. Te compartimos los trucos que los mejores jugadores guardan para mantenerse en el Top 100.
    
Consejos Pro para Blade Ball y Fisch:
• Blade Ball - Control de Cámara: Ajusta la sensibilidad de giro al 45% y desvía la bola en el último milisegundo en lugar de spamear el botón. Esto engaña el bloqueo del rival.
• Fisch - Caña de Fibra de Carbono: No compres cebos caros en las tiendas iniciales. Ahorra para la caña de fibra y pesca exclusivamente durante la noche en el muelle este.
• Canjea los códigos activos de este mes antes de que caduquen con la siguiente actualización.`,
    category: 'Juegos en Tendencia',
    date: '2026-09-18',
    author: 'Guías Gaming Bolt',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
    sourceUrl: '#informe-exclusivo-rbx-4',
    featured: false,
    tags: ['Blade Ball', 'Fisch', 'Monedas', 'Trucos Pro'],
    commentsCount: 27,
  },
];

export const PROMO_CODES: PromoCode[] = [
  // FC Mobile
  {
    id: 'c-fcm-1',
    code: 'FCMOBILE2026PACK',
    game: 'fcmobile',
    reward: 'Sobre Oro Garantizado + 1.000 Gemas',
    status: 'active',
    expiryDate: '30 Oct 2026',
    verifiedDate: 'Hoy',
    instructions: 'Canjear en la app: Ajustes > Códigos promocionales o en redeem.fcmobile.ea.com',
  },
  {
    id: 'c-fcm-2',
    code: 'BOLTVIPFCM',
    game: 'fcmobile',
    reward: '500.000 Monedas + Potenciador de Rango',
    status: 'exclusive',
    expiryDate: '15 Nov 2026',
    verifiedDate: 'Hoy',
    instructions: 'Exclusivo para miembros activos de la Comunidad Olvis Bolt.',
  },
  {
    id: 'c-fcm-3',
    code: 'TOTYSUPERSTAR',
    game: 'fcmobile',
    reward: 'Jugador OVR 89+ Intransferible',
    status: 'active',
    expiryDate: '28 Oct 2026',
    verifiedDate: 'Ayer',
    instructions: 'Canjeable en el portal de EA con tu cuenta vinculada.',
  },
  // Roblox
  {
    id: 'c-rbx-1',
    code: 'SPIDERCOLA',
    game: 'roblox',
    reward: 'Mascota de hombro Araña Lata de Cola (Accesorio Gratis)',
    status: 'active',
    expiryDate: 'Permanente',
    verifiedDate: 'Hoy',
    instructions: 'Canjear en roblox.com/redeem',
  },
  {
    id: 'c-rbx-2',
    code: 'TWEETROBLOX',
    game: 'roblox',
    reward: 'Pajarito azul parlanchín de hombro',
    status: 'active',
    expiryDate: 'Permanente',
    verifiedDate: 'Hoy',
    instructions: 'Canjear en roblox.com/redeem',
  },
  {
    id: 'c-rbx-3',
    code: 'STRIKEAPOSE',
    game: 'roblox',
    reward: 'Sombrero Island of Move para avatar',
    status: 'active',
    expiryDate: 'Válido este mes',
    verifiedDate: 'Hoy',
    instructions: 'Canjear dentro del juego Island of Move en el podio.',
  },
  {
    id: 'c-rbx-4',
    code: 'DIY',
    game: 'roblox',
    reward: 'Bastón cinético de espalda (Island of Move)',
    status: 'active',
    expiryDate: 'Válido este mes',
    verifiedDate: 'Esta semana',
    instructions: 'Canjear dentro de la experiencia Island of Move.',
  },
];

export const REWARD_PRIZES: RewardPrize[] = [
  {
    id: 'prz-fcm-1',
    title: 'Paquete de Draft 5 tickets',
    costBolts: 50000,
    category: 'FC Mobile',
    icon: '🎟️',
    stock: 10,
    deliveryTime: 'Verificación 24h (Máx 1 al día)',
    instructions: 'Olvis validará tus tareas del Muro de Desafíos y enviará los tickets a tu cuenta de FC Mobile.',
  },
  {
    id: 'prz-fcm-2',
    title: 'Paquete de Draft 10 tickets',
    costBolts: 120000,
    category: 'FC Mobile',
    icon: '🎫',
    stock: 5,
    deliveryTime: 'Verificación 24h (Máx 1 al día)',
    instructions: 'Pack prémium de 10 tickets de Draft verificado y acreditado por Olvis Bolt.',
  },
  {
    id: 'prz-fcm-3',
    title: 'Jugador de los más vendidos',
    costBolts: 150000,
    category: 'FC Mobile',
    icon: '⭐',
    stock: 3,
    deliveryTime: 'Verificación 24h (Máx 1 al día)',
    instructions: 'Carta codiciada del mercado de fichajes de FC Mobile entregada para tu plantilla.',
  },
  {
    id: 'prz-fcm-4',
    title: 'Pase Estelar de Temporada',
    costBolts: 200000,
    category: 'FC Mobile',
    icon: '🌟',
    stock: 2,
    deliveryTime: 'Verificación 24h (Máx 1 al día)',
    instructions: 'Pase Estelar VIP oficial con gemas, FC Points y jugadores transferido a tu cuenta.',
  },
  {
    id: 'prz-rbx-1',
    title: 'Paquete de 1000 Robux',
    costBolts: 200000,
    category: 'Robux',
    icon: '💎',
    stock: 5,
    deliveryTime: 'Verificación 24h (Máx 1 al día)',
    instructions: 'Código digital oficial de 1000 Robux o transferencia directa a tu cuenta de Roblox verificada por Olvis Bolt.',
  },
  {
    id: 'prz-rbx-2',
    title: 'Paquete de 2000 Robux',
    costBolts: 300000,
    category: 'Robux',
    icon: '💎',
    stock: 5,
    deliveryTime: 'Verificación 24h (Máx 1 al día)',
    instructions: 'Código digital oficial de 2000 Robux o transferencia directa a tu cuenta de Roblox verificada por Olvis Bolt.',
  },
];
