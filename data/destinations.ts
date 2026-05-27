import { Destination, Review } from "@/types"

export const destinations: Destination[] = [
  {
    id: "suborbital-01",
    name: "Voo Suborbital Aurora",
    slug: "voo-suborbital-aurora",
    tagline: "Sua primeira experiência além da atmosfera",
    description: "Experimente a ausência de gravidade e veja a curvatura da Terra em um voo suborbital de 90 minutos.",
    longDescription: `O Voo Suborbital Aurora é a porta de entrada perfeita para o turismo espacial. Durante esta experiência única de 90 minutos, você ascenderá além da linha de Kármán (100km), oficialmente entrando no espaço.

Sinta a emoção do lançamento vertical, experimente aproximadamente 4 minutos de microgravidade enquanto flutua livremente na cabine, e contemple a vista mais espetacular possível: a curvatura da Terra contra a escuridão infinita do espaço.

A cápsula foi projetada com janelas panorâmicas de última geração, garantindo que cada passageiro tenha uma vista perfeita deste momento transformador. Nossos pilotos astronautas certificados guiarão você através de cada etapa desta jornada inesquecível.`,
    price: 450000,
    currency: "USD",
    duration: "90 minutos",
    durationDays: 1,
    distance: "100+ km",
    riskLevel: "Baixo",
    operator: "Stellar Dynamics",
    operatorLogo: "/operators/stellar-dynamics.svg",
    rating: 4.9,
    reviewCount: 847,
    availability: 12,
    maxCapacity: 6,
    category: "suborbital",
    badges: [
      { type: "popular", label: "Mais Popular" },
      { type: "promoted", label: "Destaque" }
    ],
    requirements: [
      "Idade mínima: 18 anos",
      "Altura: 1.52m - 1.93m",
      "Peso: até 100kg",
      "Atestado médico aprovado",
      "2 dias de treinamento pré-voo"
    ],
    highlights: [
      "4 minutos de microgravidade",
      "Vista da curvatura terrestre",
      "Janelas panorâmicas 360°",
      "Certificado oficial de astronauta"
    ],
    included: [
      "Treinamento completo de 2 dias",
      "Hospedagem no Spaceport Hotel",
      "Traje espacial personalizado",
      "Transmissão ao vivo para família",
      "Certificado e medalha de astronauta",
      "Vídeo profissional da experiência"
    ],
    notIncluded: [
      "Passagem aérea até o spaceport",
      "Seguro de viagem espacial (opcional)",
      "Itens pessoais adicionais"
    ],
    technicalSpecs: [
      { label: "Altitude máxima", value: "106 km" },
      { label: "Velocidade máxima", value: "Mach 3.5" },
      { label: "Tempo em microgravidade", value: "4 minutos" },
      { label: "Força G no lançamento", value: "3.5 G" },
      { label: "Capacidade", value: "6 passageiros" },
      { label: "Tipo de veículo", value: "Cápsula reutilizável" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200",
      "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1200",
      "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200",
      "https://images.unsplash.com/photo-1457364559154-aa2644600ebb?w=1200"
    ],
    heroImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920",
    launchSite: "Spaceport America, Novo México",
    nextLaunch: "2026-07-15",
    featured: true
  },
  {
    id: "leo-station-01",
    name: "Estação Orbital Horizon",
    slug: "estacao-orbital-horizon",
    tagline: "Viva como astronauta por 5 dias",
    description: "Passe 5 dias na estação espacial comercial Horizon, orbitando a Terra a 400km de altitude.",
    longDescription: `A Estação Orbital Horizon representa o ápice da hospitalidade espacial. Durante 5 dias inesquecíveis, você viverá como um verdadeiro astronauta, orbitando a Terra a cada 90 minutos.

Sua suíte privativa com cúpula de observação oferece vistas contínuas do nosso planeta azul, auroras boreais, e o nascer do sol 16 vezes por dia. Participe de atividades exclusivas como caminhadas espaciais virtuais, experimentos científicos, e comunicação em tempo real com escolas ao redor do mundo.

A culinária espacial gourmet, desenvolvida por chefs estrelados, transformará suas refeições em experiências gastronômicas únicas adaptadas para microgravidade. Cada detalhe foi pensado para combinar a aventura do espaço com o conforto que você merece.`,
    price: 12500000,
    currency: "USD",
    duration: "5 dias",
    durationDays: 5,
    distance: "400 km",
    riskLevel: "Moderado",
    operator: "Orbital Horizons",
    operatorLogo: "/operators/orbital-horizons.svg",
    rating: 4.8,
    reviewCount: 156,
    availability: 4,
    maxCapacity: 4,
    category: "leo",
    badges: [
      { type: "exclusive", label: "OrbitPass Exclusive" },
      { type: "new", label: "Novo" }
    ],
    requirements: [
      "Idade mínima: 21 anos",
      "Excelente condição física",
      "Aprovação médica rigorosa",
      "14 dias de treinamento intensivo",
      "Certificação em procedimentos de emergência"
    ],
    highlights: [
      "Suíte privativa com cúpola",
      "16 nasceres do sol por dia",
      "Culinária espacial gourmet",
      "Atividades científicas reais"
    ],
    included: [
      "Treinamento de 14 dias",
      "Transporte Terra-órbita-Terra",
      "Acomodação em suíte privativa",
      "Todas as refeições gourmet",
      "Kit de astronauta completo",
      "Seguro espacial premium"
    ],
    notIncluded: [
      "Passagem aérea até centro de treinamento",
      "Hospedagem pré-treinamento",
      "Comunicações pessoais extras"
    ],
    technicalSpecs: [
      { label: "Altitude orbital", value: "400 km" },
      { label: "Período orbital", value: "90 minutos" },
      { label: "Velocidade orbital", value: "28.000 km/h" },
      { label: "Duração da missão", value: "5 dias" },
      { label: "Capacidade da estação", value: "8 pessoas" },
      { label: "Volume habitável", value: "450 m³" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1200",
      "https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=1200",
      "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200"
    ],
    heroImage: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1920",
    launchSite: "Kennedy Space Center, Flórida",
    nextLaunch: "2026-09-20",
    featured: true
  },
  {
    id: "lunar-01",
    name: "Circuito Lunar Artemis",
    slug: "circuito-lunar-artemis",
    tagline: "Orbite a Lua e toque a história",
    description: "Uma jornada de 8 dias ao redor da Lua, passando a apenas 100km da superfície lunar.",
    longDescription: `O Circuito Lunar Artemis é a expedição mais exclusiva disponível para civis. Esta jornada épica de 8 dias levará você além da órbita terrestre em uma trajetória ao redor da Lua.

Passe a apenas 100 quilômetros da superfície lunar, observando crateras, mares de basalto, e locais históricos de pouso com uma clareza impossível da Terra. No ponto mais distante, você estará a 400.000 km de casa - mais longe do que qualquer turista já esteve.

A nave Artemis IV foi especialmente projetada para esta missão, com sistemas de suporte de vida redundantes, proteção contra radiação cósmica, e uma sala de observação com as maiores janelas já construídas para viagem espacial.`,
    price: 75000000,
    currency: "USD",
    duration: "8 dias",
    durationDays: 8,
    distance: "400.000 km",
    riskLevel: "Alto",
    operator: "Lunar Voyages",
    operatorLogo: "/operators/lunar-voyages.svg",
    rating: 5.0,
    reviewCount: 12,
    availability: 2,
    maxCapacity: 3,
    category: "lunar",
    badges: [
      { type: "exclusive", label: "OrbitPass Exclusive" },
      { type: "lastSeats", label: "Últimas Vagas" }
    ],
    requirements: [
      "Idade: 25-65 anos",
      "Excelente condição física e mental",
      "Aprovação médica nível 3",
      "30 dias de treinamento",
      "Experiência prévia em voo espacial recomendada"
    ],
    highlights: [
      "Passagem a 100km da Lua",
      "Vista do lado oculto lunar",
      "Foto da Terra como 'bola de gude'",
      "Comunicação em tempo real"
    ],
    included: [
      "Treinamento completo de 30 dias",
      "Nave exclusiva Artemis IV",
      "Suíte lunar com vista panorâmica",
      "Chef pessoal a bordo",
      "Médico espacial dedicado",
      "Documentário exclusivo da missão"
    ],
    notIncluded: [
      "Seguro de vida adicional",
      "Itens pessoais de luxo"
    ],
    technicalSpecs: [
      { label: "Distância máxima", value: "400.000 km" },
      { label: "Aproximação lunar", value: "100 km" },
      { label: "Duração total", value: "8 dias" },
      { label: "Velocidade de escape", value: "40.000 km/h" },
      { label: "Capacidade", value: "3 passageiros" },
      { label: "Proteção radiação", value: "Nível máximo" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=1200",
      "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=1200",
      "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=1200",
      "https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=1200"
    ],
    heroImage: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=1920",
    launchSite: "Starbase, Texas",
    nextLaunch: "2027-03-15",
    featured: true
  },
  {
    id: "mars-01",
    name: "Expedição Marte Pioneer",
    slug: "expedicao-marte-pioneer",
    tagline: "Seja um dos primeiros colonizadores",
    description: "Missão histórica de 2 anos para estabelecer presença humana permanente em Marte.",
    longDescription: `A Expedição Marte Pioneer não é apenas uma viagem - é uma oportunidade de fazer parte da história da humanidade. Esta missão de 2 anos estabelecerá a primeira presença humana de longo prazo no Planeta Vermelho.

Você será parte de uma equipe de 12 pioneiros cuidadosamente selecionados, vivendo e trabalhando na base Mars Alpha. Participe de pesquisas científicas revolucionárias, explore a superfície marciana, e ajude a construir o futuro da humanidade como espécie multiplanetária.

Esta não é uma viagem para todos - requer compromisso total, coragem excepcional, e a disposição de se tornar um verdadeiro pioneiro. Em troca, você receberá a experiência mais transformadora possível e seu nome estará para sempre nos livros de história.`,
    price: 250000000,
    currency: "USD",
    duration: "2 anos",
    durationDays: 730,
    distance: "225 milhões km",
    riskLevel: "Extremo",
    operator: "Red Planet Ventures",
    operatorLogo: "/operators/red-planet.svg",
    rating: 5.0,
    reviewCount: 0,
    availability: 8,
    maxCapacity: 12,
    category: "mars",
    badges: [
      { type: "exclusive", label: "OrbitPass Exclusive" },
      { type: "new", label: "Missão Inaugural" }
    ],
    requirements: [
      "Idade: 25-50 anos",
      "Condição física excepcional",
      "Habilidades técnicas específicas",
      "Avaliação psicológica rigorosa",
      "1 ano de treinamento",
      "Compromisso de 2 anos mínimo"
    ],
    highlights: [
      "Primeira missão civil a Marte",
      "Construção da base Mars Alpha",
      "Exploração da superfície marciana",
      "Pesquisas científicas históricas"
    ],
    included: [
      "Treinamento de 1 ano completo",
      "Transporte Terra-Marte-Terra",
      "Acomodação na base Mars Alpha",
      "Equipamento de exploração completo",
      "Suporte médico e psicológico",
      "Salário durante a missão",
      "Fundo de retorno garantido"
    ],
    notIncluded: [
      "Seguro de vida pessoal adicional",
      "Compensação para dependentes"
    ],
    technicalSpecs: [
      { label: "Distância média", value: "225M km" },
      { label: "Tempo de viagem", value: "7 meses" },
      { label: "Duração na superfície", value: "500 dias" },
      { label: "Gravidade marciana", value: "0.38 G" },
      { label: "Tamanho da equipe", value: "12 pessoas" },
      { label: "Área da base", value: "2.000 m²" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200",
      "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=1200",
      "https://images.unsplash.com/photo-1630694093867-4b947d812bf0?w=1200",
      "https://images.unsplash.com/photo-1612892483236-52d32a0e0ac1?w=1200"
    ],
    heroImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1920",
    launchSite: "Starbase, Texas",
    nextLaunch: "2028-11-01",
    featured: true
  },
  {
    id: "suborbital-02",
    name: "Eclipse Solar Orbital",
    slug: "eclipse-solar-orbital",
    tagline: "Testemunhe o eclipse do espaço",
    description: "Voo suborbital especial sincronizado com eclipse solar total - vista impossível da Terra.",
    longDescription: `O Eclipse Solar Orbital é uma experiência única que combina a emoção do voo espacial com o espetáculo astronômico mais impressionante: um eclipse solar total visto do espaço.

Este voo especial é cronometrado precisamente para posicioná-lo acima das nuvens e da atmosfera durante o eclipse, oferecendo uma vista que nenhum observador terrestre pode ter. Veja a coroa solar em toda sua glória, observe a sombra da Lua correndo pela superfície terrestre abaixo, e experimente a microgravidade enquanto testemunha este evento cósmico.

Apenas 6 assentos disponíveis para cada eclipse - esta é verdadeiramente uma experiência para poucos privilegiados.`,
    price: 650000,
    currency: "USD",
    duration: "2 horas",
    durationDays: 1,
    distance: "110 km",
    riskLevel: "Baixo",
    operator: "Stellar Dynamics",
    operatorLogo: "/operators/stellar-dynamics.svg",
    rating: 5.0,
    reviewCount: 23,
    availability: 6,
    maxCapacity: 6,
    category: "suborbital",
    badges: [
      { type: "exclusive", label: "Evento Especial" },
      { type: "lastSeats", label: "Últimas Vagas" }
    ],
    requirements: [
      "Idade mínima: 18 anos",
      "Altura: 1.52m - 1.93m",
      "Peso: até 100kg",
      "Atestado médico aprovado",
      "2 dias de treinamento pré-voo"
    ],
    highlights: [
      "Eclipse total visto do espaço",
      "Sombra lunar na Terra",
      "Coroa solar completa",
      "Experiência única na vida"
    ],
    included: [
      "Treinamento completo de 2 dias",
      "Hospedagem premium no Spaceport",
      "Traje espacial personalizado",
      "Equipamento fotográfico especial",
      "Certificado de evento astronômico",
      "Jantar de gala pré-voo"
    ],
    notIncluded: [
      "Passagem aérea até o spaceport",
      "Seguro de viagem espacial"
    ],
    technicalSpecs: [
      { label: "Altitude do eclipse", value: "110 km" },
      { label: "Duração do eclipse", value: "6 min 23s" },
      { label: "Tempo em microgravidade", value: "5 minutos" },
      { label: "Data do próximo eclipse", value: "12 Ago 2027" },
      { label: "Capacidade", value: "6 passageiros" },
      { label: "Janelas especiais", value: "Filtro solar integrado" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
      "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1200",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200"
    ],
    heroImage: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1920",
    launchSite: "Spaceport America, Novo México",
    nextLaunch: "2027-08-12",
    featured: false
  },
  {
    id: "leo-02",
    name: "Zero-G Lab Experience",
    slug: "zero-g-lab-experience",
    tagline: "Ciência e aventura em órbita",
    description: "3 dias de experimentos científicos reais na estação orbital - seja um cientista espacial.",
    longDescription: `O Zero-G Lab Experience é perfeito para quem quer mais do que apenas observar o espaço - quer fazer parte da ciência espacial. Durante 3 dias intensos na Estação Horizon, você participará de experimentos científicos reais em microgravidade.

Trabalhe lado a lado com cientistas espaciais em projetos de biologia, física e ciência de materiais que só são possíveis em ambiente de microgravidade. Seus experimentos contribuirão para pesquisas reais publicadas em revistas científicas.

Esta experiência é ideal para profissionais de ciência, educadores, e qualquer pessoa fascinada pela fronteira do conhecimento humano.`,
    price: 8500000,
    currency: "USD",
    duration: "3 dias",
    durationDays: 3,
    distance: "400 km",
    riskLevel: "Moderado",
    operator: "Orbital Horizons",
    operatorLogo: "/operators/orbital-horizons.svg",
    rating: 4.9,
    reviewCount: 67,
    availability: 3,
    maxCapacity: 4,
    category: "leo",
    badges: [
      { type: "new", label: "Novo" }
    ],
    requirements: [
      "Idade mínima: 21 anos",
      "Boa condição física",
      "Interesse em ciência",
      "10 dias de treinamento",
      "Aprovação médica"
    ],
    highlights: [
      "Experimentos científicos reais",
      "Publicação em revista científica",
      "Trabalho com cientistas espaciais",
      "Contribuição para a ciência"
    ],
    included: [
      "Treinamento científico de 10 dias",
      "Transporte orbital",
      "Acomodação compartilhada",
      "Materiais de experimento",
      "Certificado científico",
      "Co-autoria em publicação"
    ],
    notIncluded: [
      "Passagem aérea",
      "Hospedagem pré-treinamento"
    ],
    technicalSpecs: [
      { label: "Altitude orbital", value: "400 km" },
      { label: "Laboratórios disponíveis", value: "3" },
      { label: "Horas de experimento", value: "40+" },
      { label: "Duração", value: "3 dias" },
      { label: "Participantes", value: "4 por missão" },
      { label: "Projetos científicos", value: "12 disponíveis" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1200",
      "https://images.unsplash.com/photo-1457364559154-aa2644600ebb?w=1200",
      "https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=1200"
    ],
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920",
    launchSite: "Kennedy Space Center, Flórida",
    nextLaunch: "2026-11-05",
    featured: false
  }
]

export const reviews: Review[] = [
  {
    id: "review-01",
    destinationId: "suborbital-01",
    userName: "Carlos Mendes",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    rating: 5,
    date: "2026-03-15",
    title: "A experiência mais transformadora da minha vida",
    content: "Não existem palavras para descrever o que é ver a Terra do espaço. Aqueles 4 minutos de microgravidade passaram voando, mas a sensação ficará comigo para sempre. A equipe da Stellar Dynamics foi impecável do início ao fim.",
    verified: true,
    tripDate: "2026-03-10"
  },
  {
    id: "review-02",
    destinationId: "suborbital-01",
    userName: "Ana Paula Silva",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    rating: 5,
    date: "2026-02-28",
    title: "Vale cada centavo",
    content: "O treinamento foi desafiador mas incrivelmente bem estruturado. A equipe me preparou perfeitamente para cada momento do voo. Ver a curvatura da Terra e a fina linha azul da atmosfera mudou minha perspectiva sobre nosso planeta.",
    verified: true,
    tripDate: "2026-02-20"
  },
  {
    id: "review-03",
    destinationId: "leo-station-01",
    userName: "Ricardo Oliveira",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    rating: 5,
    date: "2026-01-20",
    title: "5 dias que mudaram minha vida",
    content: "A Estação Horizon superou todas as minhas expectativas. A suíte com cúpola de observação é simplesmente surreal - passei horas apenas olhando a Terra passar. A comida gourmet em microgravidade é uma experiência à parte!",
    verified: true,
    tripDate: "2026-01-10"
  },
  {
    id: "review-04",
    destinationId: "suborbital-01",
    userName: "Marina Costa",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    rating: 4,
    date: "2026-03-01",
    title: "Incrível, mas passou rápido demais",
    content: "A experiência em si é indescritível - flutuar no espaço e ver nosso planeta lá embaixo é mágico. Minha única crítica é que gostaria de mais tempo em microgravidade. Definitivamente voltarei para uma experiência mais longa.",
    verified: true,
    tripDate: "2026-02-25"
  },
  {
    id: "review-05",
    destinationId: "leo-station-01",
    userName: "Fernando Almeida",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    rating: 5,
    date: "2025-12-15",
    title: "O ápice do luxo espacial",
    content: "A Orbital Horizons redefiniu o que significa hospitalidade. Cada detalhe foi pensado para nosso conforto, desde os quartos até as refeições elaboradas pelo chef. Ver 16 nasceres do sol em um dia é algo que nunca vou esquecer.",
    verified: true,
    tripDate: "2025-12-05"
  }
]

export const testimonials = [
  {
    id: "testimonial-01",
    name: "Elon M.",
    role: "CEO, Tech Industry",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    content: "OrbitBook tornou a reserva espacial tão simples quanto reservar um hotel. A plataforma é intuitiva e o suporte é excepcional.",
    rating: 5
  },
  {
    id: "testimonial-02",
    name: "Sofia R.",
    role: "Astronauta Amadora",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    content: "Já fiz três viagens pelo OrbitBook. O assistente de IA me ajudou a escolher o destino perfeito para cada etapa da minha jornada espacial.",
    rating: 5
  },
  {
    id: "testimonial-03",
    name: "Marcus W.",
    role: "Investidor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    content: "A transparência nos preços e requisitos me deu confiança para fazer minha primeira reserva. O processo foi impecável do início ao fim.",
    rating: 5
  }
]

export const stats = [
  { value: "2.847", label: "Viajantes espaciais" },
  { value: "156", label: "Missões completadas" },
  { value: "99.8%", label: "Taxa de satisfação" },
  { value: "4", label: "Destinos únicos" }
]

export const operators = [
  { id: "stellar-dynamics", name: "Stellar Dynamics", logo: "/operators/stellar-dynamics.svg" },
  { id: "orbital-horizons", name: "Orbital Horizons", logo: "/operators/orbital-horizons.svg" },
  { id: "lunar-voyages", name: "Lunar Voyages", logo: "/operators/lunar-voyages.svg" },
  { id: "red-planet", name: "Red Planet Ventures", logo: "/operators/red-planet.svg" }
]

export const categories = [
  { id: "suborbital", name: "Voos Suborbitais", description: "Experiências de 1-2 horas além da atmosfera" },
  { id: "leo", name: "Órbita Baixa (LEO)", description: "Estadias de 3-14 dias em estação orbital" },
  { id: "lunar", name: "Missões Lunares", description: "Expedições ao redor ou para a Lua" },
  { id: "mars", name: "Colonização Marte", description: "Missões de longo prazo ao Planeta Vermelho" }
]
