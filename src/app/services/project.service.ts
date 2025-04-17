import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Project } from './project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly projectsUrl = 'assets/data/projects.json';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectsUrl).pipe(
      catchError(error => {
        console.error('Error al cargar proyectos:', error);
        // Devuelve datos de ejemplo si el archivo no se encuentra
        return of(this.getFallbackProjects());
      })
    );
  }

  private getFallbackProjects(): Project[] {
    return [
      {
        "id": 1,
        "title": "Reforestación Urbana Sostenible",
        "description": "Plantación de 10 000 árboles nativos en áreas urbanas",
        "longDescription": "Este proyecto busca mitigar el cambio climático y mejorar la calidad del aire mediante la plantación estratégica de 10 000 árboles nativos en parques, avenidas y zonas con menor cobertura arbórea. Cada ejemplar será geolocalizado y monitoreado durante tres años para garantizar su supervivencia y crecimiento óptimo.",
        "goal": 30000000,
        "collected": 22500000,
        "category": "Medio Ambiente",
        "deadline": "2025-11-30",
        "location": "Medellín, Colombia",
        "creator": {
          "name": "EcoUrban S.A.S.",
          "email": "contacto@ecourban.com",
          "bio": "Organización sin ánimo de lucro especializada en proyectos de sostenibilidad urbana con ocho años de experiencia.",
          "avatar": "https://randomuser.me/api/portraits/lego/1.jpg"
        },
        "risksAndChallenges": "Obtención de permisos municipales, aseguramiento de la participación comunitaria y mantenimiento a largo plazo. Se han establecido convenios con la alcaldía y un programa de adopción de árboles por parte de los residentes.",
        "rewards": [
          { "title": "Certificado digital",     "description": "Reconocimiento oficial de participación",                   "minimumAmount": 250000 },
          { "title": "Kit de jardinería urbana", "description": "Herramientas básicas y guía digital de cuidado",          "minimumAmount": 600000 },
          { "title": "Taller de sostenibilidad", "description": "Acceso a taller online sobre jardinería urbana",         "minimumAmount": 12500000 },
          { "title": "Árbol con placa",          "description": "Placa personalizada en uno de los árboles plantados",    "minimumAmount": 300000 }
        ],
        "updates": [
          { "date": "2025-01-15", "title": "Campaña lanzada",           "content": "Se inició la recaudación con un primer tramo de planificación." },
          { "date": "2025-03-20", "title": "Meta parcial alcanzada",    "content": "Se superaron los 15 000 USD, iniciando gestiones para la compra de 6 000 árboles." }
        ],
        "supporters": [
          { "name": "Carlos A. Gómez",               "amount": 900000,  "date": "2025-04-10" },
          { "name": "VerdeVivo Fundación",           "amount": 600000,  "date": "2025-03-15" },
          { "name": "Ana M. Rodríguez",              "amount": 300000,  "date": "2025-02-20" },
          { "name": "Empresas Públicas de Medellín", "amount": 450000,  "date": "2025-04-30" }
        ]
      },
      {
        "id": 2,
        "title": "App Educativa para Niños Rurales",
        "description": "Plataforma de aprendizaje interactivo sin conexión",
        "longDescription": "Desarrollo de una aplicación offline con contenidos de matemáticas, ciencias y lectura, alineados al currículo oficial, optimizada para dispositivos de gama baja en comunidades sin internet estable.",
        "goal": 25000000,
        "collected": 17000500,
        "category": "Tecnología",
        "deadline": "2025-09-15",
        "location": "Zonas rurales de Latinoamérica",
        "creator": {
          "name": "TecnoEduca",
          "email": "proyectos@tecnoseduca.org",
          "bio": "Startup social con cinco años de experiencia en soluciones tecnológicas para contextos vulnerables.",
          "avatar": "https://randomuser.me/api/portraits/lego/2.jpg"
        },
        "risksAndChallenges": "Optimización para hardware limitado, adaptación a diversos currículos y distribución física. Se cuenta con alianzas institucionales y logística consolidada.",
        "rewards": [
          { "title": "Mención en redes",    "description": "Agradecimiento en nuestras plataformas sociales",                     "minimumAmount": 20000 },
          { "title": "Acceso beta",         "description": "Participación anticipada en la versión de prueba",                  "minimumAmount": 40000 },
          { "title": "Taller virtual",      "description": "Sesión online sobre tecnología educativa",                          "minimumAmount": 80000},
          { "title": "Visita a comunidad",  "description": "Invitación a una escuela rural beneficiada",                        "minimumAmount": 250000 }
        ],
        "updates": [
          { "date": "2025-02-01", "title": "Diseño completado",    "content": "Interfaz y arquitectura técnica finalizadas." },
          { "date": "2025-04-10", "title": "Piloto exitoso",      "content": "Prueba en tres escuelas rurales con alta aceptación." }
        ],
        "supporters": [
          { "name": "Fundación Educar",     "amount": 700000,  "date": "2025-03-15" },
          { "name": "Laura Martínez",       "amount": 250000,  "date": "2025-02-28" },
          { "name": "TechForGood Inc.",     "amount": 800000,  "date": "2025-04-05" }
        ]
      },
      {
        "id": 3,
        "title": "Centro Comunitario Integral",
        "description": "Espacio autosostenible para actividades barriales",
        "longDescription": "Construcción de un centro de 300 m² con sala multiusos, biblioteca, cocina comunitaria y paneles solares, además de captación de agua de lluvia. Servirá como punto de formación, apoyo escolar y actividades culturales.",
        "goal": 50000000,
        "collected": 32000000,
        "category": "Social",
        "deadline": "2026-03-01",
        "location": "Barrio Las Flores, Bogotá",
        "creator": {
          "name": "Comunidad Activa",
          "email": "comunidad.activa@example.com",
          "bio": "Colectivo vecinal con doce años de trabajo en dinamización comunitaria.",
          "avatar": "https://randomuser.me/api/portraits/lego/3.jpg"
        },
        "risksAndChallenges": "Licencias de construcción, participación sostenida y mantenimiento. Se constituyó un comité gestor y se pactaron acuerdos con la alcaldía.",
        "rewards": [
          { "title": "Agenda cultural",     "description": "Libro artesano con fotos del proyecto",                           "minimumAmount": 30000 },
          { "title": "Taller gratuito",      "description": "Acceso a un taller a elección",                                  "minimumAmount": 60000 },
          { "title": "Placa conmemorativa",  "description": "Nombre en la placa de inauguración",                            "minimumAmount": 200000 },
          { "title": "Sala con tu nombre",   "description": "Sala principal nombrada a tu elección",                         "minimumAmount": 6000000 }
        ],
        "updates": [
          { "date": "2025-01-10", "title": "Terreno asignado",         "content": "La alcaldía otorgó el terreno para el proyecto." },
          { "date": "2025-05-15", "title": "Planos aprobados",         "content": "Diseños arquitectónicos validados por autoridades y vecinos." }
        ],
        "supporters": [
          { "name": "Constructora Solidaria", "amount": 1200000, "date": "2025-04-20" },
          { "name": "Vecinos Unidos",          "amount": 900000,  "date": "2025-03-01" },
          { "name": "Banco Comunitario",       "amount": 1100000, "date": "2025-05-10" }
        ]
      },
      {
        "id": 4,
        "title": "Robot Asistencial para Ancianos",
        "description": "Asistente robótico de bajo costo para adultos mayores",
        "longDescription": "Diseño de un robot capaz de recordar medicación, detectar caídas, facilitar videollamadas y monitorear signos vitales básicos. Se prioriza una interfaz extremadamente intuitiva y pruebas en residencias antes de su producción.",
        "goal": 40000000,
        "collected": 28000000,
        "category": "Tecnología",
        "deadline": "2025-12-15",
        "location": "Colombia",
        "creator": {
          "name": "TecnoCare Solutions",
          "email": "info@tecnocare.com",
          "bio": "Equipo de ingenieros y gerontólogos comprometidos con la calidad de vida de los mayores.",
          "avatar": "https://randomuser.me/api/portraits/lego/4.jpg"
        },
        "risksAndChallenges": "Precisión en detección de caídas, usabilidad para usuarios con baja alfabetización tecnológica y eficiencia de costes. Prototipos iniciales mostraron alta aceptación.",
        "rewards": [
          { "title": "Newsletter exclusivo",  "description": "Informe mensual de avances",                                  "minimumAmount": 25000 },
          { "title": "Visita al laboratorio", "description": "Tour virtual por el centro de desarrollo",                  "minimumAmount": 50000 },
          { "title": "Créditos honoríficos",  "description": "Nombre en la documentación oficial",                         "minimumAmount": 150000 },
          { "title": "Preventa con descuento","description": "30 % de descuento en primera edición comercial",              "minimumAmount": 600000 }
        ],
        "updates": [
          { "date": "2025-02-20", "title": "Prototipo funcional",  "content": "Se completó el primer prototipo con funciones esenciales." },
          { "date": "2025-06-10", "title": "Pruebas en residencias","content": "Ensayos en tres residencias con resultados satisfactorios." }
        ],
        "supporters": [
          { "name": "SilverTech Ventures",     "amount": 1000000, "date": "2025-05-15" },
          { "name": "Asociación Gerontológica","amount": 800000,  "date": "2025-04-01" },
          { "name": "Hackers por la Sociedad", "amount": 1000000, "date": "2025-03-10" }
        ]
      },
      {
        "id": 5,
        "title": "Biblioteca Móvil para Zonas Rurales",
        "description": "Unidad sobre ruedas con libros y contenidos digitales",
        "longDescription": "Transformación de un autobús en biblioteca móvil con 2 000 volúmenes físicos, estaciones de consulta offline y espacio para talleres itinerantes. Visitará quince comunidades mensualmente, atendiendo a más de 3 000 jóvenes.",
        "goal": 30000000,
        "collected": 21000000,
        "category": "Educación",
        "deadline": "2025-10-20",
        "location": "Chocó, Colombia",
        "creator": {
          "name": "Lectura Viajera",
          "email": "contacto@lecturaviajera.org",
          "bio": "Organización sin ánimo de lucro con seis años promoviendo la lectura en áreas aisladas.",
          "avatar": "https://randomuser.me/api/portraits/lego/5.jpg"
        },
        "risksAndChallenges": "Mantenimiento vehicular en caminos difíciles, formación de promotores locales y financiamiento sostenido. Se cuenta con programa de voluntariado rotativo.",
        "rewards": [
          { "title": "Postal ilustrada",      "description": "Postal con diseño exclusivo del proyecto",                   "minimumAmount": 20000 },
          { "title": "Libro dedicado",        "description": "Volumen con dedicatoria especial",                           "minimumAmount": 45000 },
          { "title": "Ruta acompañada",       "description": "Participación en una jornada de la biblioteca móvil",        "minimumAmount": 120000 },
          { "title": "Estación nombrada",     "description": "Estación de lectura con placa a tu nombre",                  "minimumAmount": 900000 }
        ],
        "updates": [
          { "date": "2025-03-01", "title": "Bus adquirido",           "content": "Vehículo comprado y en proceso de adecuación." },
          { "date": "2025-06-15", "title": "Primera donación",        "content": "Recibidos 500 libros donados por editoriales aliadas." }
        ],
        "supporters": [
          { "name": "Fundación Leer es Vivir","amount": 800000,  "date": "2025-04-10" },
          { "name": "Escritores Unidos",      "amount": 600000,  "date": "2025-05-20" },
          { "name": "Rotary Club Local",      "amount": 700000,  "date": "2025-03-15" }
        ]
      },
      {
        "id": 6,
        "title": "Talleres de Robótica para Jóvenes",
        "description": "Formación STEM con kits reutilizables",
        "longDescription": "Implementación semestral de talleres de robótica en diez escuelas públicas, beneficiando a 300 estudiantes. Incluye manuales, competencias intercolegiales y creación de clubes permanentes.",
        "goal": 35000000,
        "collected": 24500000,
        "category": "Educación",
        "deadline": "2025-08-30",
        "location": "Cali, Colombia",
        "creator": {
          "name": "Robótica para Todos",
          "email": "info@roboticapertodos.edu",
          "bio": "Colectivo de ingenieros y educadores dedicados a democratizar la educación tecnológica.",
          "avatar": "https://randomuser.me/api/portraits/lego/6.jpg"
        },
        "risksAndChallenges": "Adaptación curricular, mantenimiento de equipos y continuidad tras el cierre de talleres. Se ofrece capacitación docente y clubes de seguimiento.",
        "rewards": [
          { "title": "Video de agradecimiento", "description": "Mensaje personalizado del equipo",                         "minimumAmount": 20000 },
          { "title": "Kit básico",             "description": "Kit de iniciación a robótica para el hogar",             "minimumAmount": 60000 },
          { "title": "Clase demostrativa",     "description": "Participación en taller presencial",                     "minimumAmount": 100000 },
          { "title": "Taller nombrado",        "description": "Sesión con tu nombre o el que elijas",                   "minimumAmount": 2500000 }
        ],
        "updates": [
          { "date": "2025-02-15", "title": "Escuelas seleccionadas", "content": "Se definieron las diez instituciones participantes." },
          { "date": "2025-05-20", "title": "Kits adquiridos",        "content": "Compra de 150 kits gracias a los fondos iniciales." }
        ],
        "supporters": [
          { "name": "Asociación de Ingenieros",   "amount": 900000,  "date": "2025-04-05" },
          { "name": "Universidad Tecnológica",    "amount": 800000,  "date": "2025-03-22" },
          { "name": "Empresa de Tecnología",      "amount": 750000,  "date": "2025-05-10" }
        ]
      },
      {
        "id": 7,
        "title": "Programa de Salud Mental Comunitaria",
        "description": "Atención psicosocial gratuita y continua",
        "longDescription": "Equipo itinerante de psicólogos y trabajadores sociales que brinda consultas, talleres de autocuidado y grupos de apoyo en barrios vulnerables, más línea telefónica 24/7 y portal web con recursos descargables.",
        "goal": 25000000,
        "collected": 17500000,
        "category": "Salud",
        "deadline": "2025-12-31",
        "location": "Bogotá, Colombia",
        "creator": {
          "name": "SaludIntegral NGO",
          "email": "contacto@saludintegral.org",
          "bio": "ONG con diez años promoviendo el bienestar y la inclusión social.",
          "avatar": "https://randomuser.me/api/portraits/lego/7.jpg"
        },
        "risksAndChallenges": "Estigma social, retención de usuarios y logística de seguimiento. Se implementan campañas de sensibilización y convenios con centros comunitarios.",
        "rewards": [
          { "title": "Mención honorífica", "description": "Agradecimiento en página oficial",                       "minimumAmount": 25000 },
          { "title": "Sesión informativa", "description": "Webinar exclusivo sobre salud mental comunitaria",      "minimumAmount": 50000 },
          { "title": "Kit de autocuidado", "description": "Material didáctico y herramientas prácticas",             "minimumAmount": 120000 },
          { "title": "Patrocinador oficial","description": "Logo en comunicaciones y materiales del programa",       "minimumAmount": 900000 }
        ],
        "updates": [
          { "date": "2025-03-05", "title": "Portal web activo",      "content": "Se habilitó la plataforma con recursos y formulario." },
          { "date": "2025-05-01", "title": "Primer taller comunitario","content": "Sesión de autocuidado con 50 participantes." }
        ],
        "supporters": [
          { "name": "Fundación Esperanza",  "amount": 600000,  "date": "2025-04-12" },
          { "name": "Psicólogos Unidos",     "amount": 450000,  "date": "2025-03-28" },
          { "name": "Donante Anónimo",      "amount": 700000,  "date": "2025-05-10" }
        ]
      },
      {
        "id": 8,
        "title": "Festival de Arte Urbano",
        "description": "Encuentro de murales, danza y música en la calle",
        "longDescription": "Evento de cinco días con más de treinta muralistas y agrupaciones de danza urbana, intervenciones sonoras y puestos gastronómicos. Se espera la asistencia de 8 000 personas diarias.",
        "goal": 35000000,
        "collected": 21000000,
        "category": "Cultura",
        "deadline": "2025-07-20",
        "location": "Cali, Colombia",
        "creator": {
          "name": "ArteVivo Colectivo",
          "email": "info@artevivo.co",
          "bio": "Grupo independiente que promueve el arte callejero como motor de cambio social.",
          "avatar": "https://randomuser.me/api/portraits/lego/8.jpg"
        },
        "risksAndChallenges": "Permisos de espacio público, protección de obras y coordinación logística. Se cuentan con seguros y respaldo municipal.",
        "rewards": [
          { "title": "Agradecimiento en cartel", "description": "Nombre o logo en el afiche oficial",                  "minimumAmount": 35000 },
          { "title": "Tour VIP",                "description": "Recorrido guiado con los artistas",                    "minimumAmount": 75000 },
          { "title": "Print limitado",          "description": "Serigrafía firmada por uno de los muralistas",         "minimumAmount": 160000 },
          { "title": "Patrocinador platino",    "description": "Logo en escenario y mención inaugural",               "minimumAmount": 1800000 }
        ],
        "updates": [
          { "date": "2025-04-22", "title": "Artistas confirmados", "content": "Listados 25 muralistas y 10 agrupaciones de danza." },
          { "date": "2025-06-10", "title": "Escenarios instalados", "content": "Se completó el montaje de tarimas y servicios básicos." }
        ],
        "supporters": [
          { "name": "Galería Urbana",        "amount": 900000,  "date": "2025-05-05" },
          { "name": "Colectivo Sonido Libre","amount": 600000,  "date": "2025-04-30" },
          { "name": "Municipio de Cali",     "amount": 600000,  "date": "2025-06-01" }
        ]
      },
      {
        "id": 9,
        "title": "Plataforma de Comercio Justo",
        "description": "Marketplace digital para pequeños productores",
        "longDescription": "Desarrollo de un portal y app que conecten productores rurales con compradores, garantizando precios justos, transparencia y seguimiento logístico en tiempo real.",
        "goal": 30000000,
        "collected": 18500000,
        "category": "Comercio",
        "deadline": "2025-11-10",
        "location": "Colombia y exportación",
        "creator": {
          "name": "JustoMarket Inc.",
          "email": "contacto@justomarket.com",
          "bio": "Startup tecnológica dedicada al comercio justo y la economía colaborativa.",
          "avatar": "https://randomuser.me/api/portraits/lego/9.jpg"
        },
        "risksAndChallenges": "Logística de distribución, adopción tecnológica y fluctuaciones de precios. Se han firmado convenios con tres cooperativas y un operador logístico.",
        "rewards": [
          { "title": "Mención en el sitio",     "description": "Nombre o logo en sección de patrocinadores",                "minimumAmount": 40000 },
          { "title": "Acceso anticipado",       "description": "Prueba exclusiva de la plataforma antes del lanzamiento",    "minimumAmount": 90000 },
          { "title": "Reporte de impacto",      "description": "Informe anual de beneficios a productores",                 "minimumAmount": 180000 },
          { "title": "Socio fundador",          "description": "Participación en decisiones estratégicas",                  "minimumAmount": 2200000 }
        ],
        "updates": [
          { "date": "2025-03-12", "title": "MVP publicado",            "content": "Versión mínima viable en prueba con productores." },
          { "date": "2025-05-08", "title": "Primera venta internacional","content": "Envío de café orgánico a Europa completado." }
        ],
        "supporters": [
          { "name": "Cooperativa del Sur", "amount": 700000,  "date": "2025-04-18" },
          { "name": "Inversores Ángel",    "amount": 550000,  "date": "2025-05-02" },
          { "name": "AgroTech Ltda.",      "amount": 600000,  "date": "2025-03-29" }
        ]
      },
      {
        "id": 10,
        "title": "Centros de Energía Solar Comunitarios",
        "description": "Instalación fotovoltaica en escuelas rurales",
        "longDescription": "Implementación de sistemas solares en cinco escuelas sin conexión estable a la red, garantizando iluminación, equipos de cómputo y refrigeración de comedor. Incluye dos años de mantenimiento.",
        "goal": 45000000,
        "collected": 31500000,
        "category": "Energía",
        "deadline": "2026-01-15",
        "location": "Región Andina, Colombia",
        "creator": {
          "name": "SolComunidad",
          "email": "info@solcomunidad.org",
          "bio": "ONG con siete años de experiencia en proyectos de energía renovable comunitaria.",
          "avatar": "https://randomuser.me/api/portraits/lego/10.jpg"
        },
        "risksAndChallenges": "Transporte de equipos, capacitación técnica local y variabilidad climática. Se formó personal comunitario y se contrató proveedor regional.",
        "rewards": [
          { "title": "Informe técnico",        "description": "Documento detallado de diseño e impacto",                   "minimumAmount": 55000 },
          { "title": "Panel simbólico",        "description": "Placa con tu nombre en una instalación",                     "minimumAmount": 120000 },
          { "title": "Visita técnica",         "description": "Viaje organizado para conocer el proyecto",                  "minimumAmount": 550000 },
          { "title": "Patrocinador dorado",    "description": "Logo destacado en placa conmemorativa",                      "minimumAmount": 3000000 }
        ],
        "updates": [
          { "date": "2025-04-01", "title": "Estudios completados",      "content": "Análisis de irradiación y diseños preliminares listos." },
          { "date": "2025-06-20", "title": "Equipos recibidos",         "content": "Paneles y baterías entregados para la primera escuela." }
        ],
        "supporters": [
          { "name": "Fundación Solar",            "amount": 1200000, "date": "2025-05-12" },
          { "name": "Ingenieros Sin Fronteras",   "amount": 1000000, "date": "2025-04-25" },
          { "name": "Donante Privado",            "amount": 950000,  "date": "2025-06-05" }
        ]
      },
      {
        "id": 11,
        "title": "Club de Lectura Virtual Multilenguaje",
        "description": "Foro online para debate literario en tres idiomas",
        "longDescription": "Portal y app que une lectores de español, inglés y portugués para sesiones semanales de discusión, foros de análisis y traducción colaborativa, con entrevistas en vivo y biblioteca digital multiformato.",
        "goal": 20000000,
        "collected": 14000000,
        "category": "Cultura",
        "deadline": "2025-08-01",
        "location": "Virtual",
        "creator": {
          "name": "Letras Globales",
          "email": "contacto@letrasglobales.net",
          "bio": "Iniciativa digital que promueve el intercambio cultural y la lectura multilingüe.",
          "avatar": "https://randomuser.me/api/portraits/lego/11.jpg"
        },
        "risksAndChallenges": "Conectividad limitada, coordinación de zonas horarias y derechos de autor. Se negociaron licencias y optimizó la plataforma para banda ancha baja.",
        "rewards": [
          { "title": "Acceso anticipado",       "description": "Participación en sesiones beta",                              "minimumAmount": 15000 },
          { "title": "Entrevista privada",      "description": "Charla en vivo con autor invitado",                            "minimumAmount": 50000 },
          { "title": "Pack de e‑books",         "description": "Cinco títulos en los tres idiomas",                           "minimumAmount": 110000 },
          { "title": "Socio fundador",          "description": "Reconocimiento perpetuo y voto en selecciones literarias",     "minimumAmount": 600000 }
        ],
        "updates": [
          { "date": "2025-03-18", "title": "Portal lanzado",           "content": "Versión inicial con biblioteca y foros disponibles." },
          { "date": "2025-05-02", "title": "Primera sesión en vivo",   "content": "Encuentro con 120 participantes de ocho países." }
        ],
        "supporters": [
          { "name": "Amigos de la Lectura", "amount": 500000,  "date": "2025-04-08" },
          { "name": "Editorial Babel",      "amount": 600000,  "date": "2025-03-29" },
          { "name": "Donante Anónimo",      "amount": 300000,  "date": "2025-05-05" }
        ]
      },
      {
        "id": 12,
        "title": "Huertos Verticales en Espacios Urbanos",
        "description": "Jardines modulares para terrazas y azoteas",
        "longDescription": "Implementación de huertos verticales modulares en azoteas y fachadas, cultivando hortalizas y plantas ornamentales para mejorar la calidad del aire y la seguridad alimentaria en zonas densamente pobladas.",
        "goal": 20000000,
        "collected": 12000000,
        "category": "Medio Ambiente",
        "deadline": "2025-10-01",
        "location": "Bogotá, Colombia",
        "creator": {
          "name": "UrbanGreen ONG",
          "email": "proyectos@urbangreen.org",
          "bio": "ONG dedicada a la agricultura urbana sostenible y diseño de espacios verdes.",
          "avatar": "https://randomuser.me/api/portraits/lego/12.jpg"
        },
        "risksAndChallenges": "Adaptación a diferentes estructuras arquitectónicas, riego eficiente y mantenimiento comunitario. Se desarrollaron kits estandarizados y protocolos de voluntariado.",
        "rewards": [
          { "title": "Guía digital",            "description": "Manual paso a paso para construir un huerto",              "minimumAmount": 20000 },
          { "title": "Kit de inicio",            "description": "Componentes básicos para un módulo vertical",               "minimumAmount": 50000 },
          { "title": "Taller práctico",          "description": "Sesión presencial sobre cultivo urbano",                   "minimumAmount": 100000 },
          { "title": "Módulo nombrado",          "description": "Módulo instalado con tu placa personalizada",               "minimumAmount": 2000000 }
        ],
        "updates": [
          { "date": "2025-03-10", "title": "Piloto concluido",   "content": "Se finalizó la instalación de tres huertos piloto." },
          { "date": "2025-05-05", "title": "Primeros módulos",   "content": "Se colocaron diez módulos en aulas universitarias." }
        ],
        "supporters": [
          { "name": "Vecinos Unidos",          "amount": 400000,  "date": "2025-04-01" },
          { "name": "GreenTech Startup",       "amount": 300000,  "date": "2025-03-15" },
          { "name": "Donante Corporativo",     "amount": 500000,  "date": "2025-05-10" }
        ]
      },
      {
        "id": 13,
        "title": "Aplicación de Telemedicina Rural",
        "description": "Consultas médicas vía móvil sin infraestructura avanzada",
        "longDescription": "Plataforma móvil que permite consultas médicas en zonas rurales mediante videochat, almacenamiento de historiales y recordatorios de citas, incluso en áreas con conectividad intermitente.",
        "goal": 28000000,
        "collected": 16800000,
        "category": "Salud",
        "deadline": "2025-12-01",
        "location": "Colombia rural",
        "creator": {
          "name": "TelemedHealth",
          "email": "contacto@telemedhealth.co",
          "bio": "Startup de salud digital enfocada en comunidades de baja conectividad.",
          "avatar": "https://randomuser.me/api/portraits/lego/13.jpg"
        },
        "risksAndChallenges": "Calidad de la red móvil, adopción por parte de profesionales de la salud y privacidad de datos. Se implementaron protocolos de compresión de video y cifrado de extremo a extremo.",
        "rewards": [
          { "title": "Acceso anticipado",         "description": "Prueba exclusiva de la app",                                "minimumAmount": 25000 },
          { "title": "Seminario web",             "description": "Webinar con especialistas en telemedicina",                "minimumAmount": 60000 },
          { "title": "Informe técnico",           "description": "Documento con resultados de la fase piloto",                "minimumAmount": 150000 },
          { "title": "Patrocinador reconocido",   "description": "Logo en paneles de la interfaz y comunicaciones",          "minimumAmount": 1500000 }
        ],
        "updates": [
          { "date": "2025-02-20", "title": "Arquitectura definida",    "content": "Se completó el diseño backend y mobile." },
          { "date": "2025-04-25", "title": "Piloto implementado",      "content": "Prueba en dos municipios con 50 usuarios activos." }
        ],
        "supporters": [
          { "name": "Clínica Rural A",         "amount": 600000,  "date": "2025-03-15" },
          { "name": "Gobernación Local",       "amount": 400000,  "date": "2025-04-10" },
          { "name": "Fundación SaludGlobal",   "amount": 680000,  "date": "2025-05-05" }
        ]
      },
      {
        "id": 14,
        "title": "Capacitación en Energías Renovables",
        "description": "Cursos prácticos de energía solar y eólica",
        "longDescription": "Programa de formación para técnicos locales en instalación, mantenimiento y dimensionamiento de sistemas solares y turbinas eólicas de pequeña escala.",
        "goal": 15000000,
        "collected": 9000000,
        "category": "Educación",
        "deadline": "2025-09-01",
        "location": "Antioquia, Colombia",
        "creator": {
          "name": "RenovaEdu",
          "email": "info@renovaedu.edu",
          "bio": "Centro educativo especializado en formación ambiental y energética.",
          "avatar": "https://randomuser.me/api/portraits/lego/14.jpg"
        },
        "risksAndChallenges": "Logística de talleres prácticos, actualización de contenidos y certificaciones oficiales. Se alianza con universidad técnica para emisión de diplomados.",
        "rewards": [
          { "title": "Acceso al curso",     "description": "Inscripción en curso básico online",                      "minimumAmount": 20000 },
          { "title": "Certificado oficial", "description": "Diploma acreditado por la universidad",                  "minimumAmount": 50000 },
          { "title": "Material físico",     "description": "Manual impreso y herramientas digitales",                "minimumAmount": 100000 },
          { "title": "Patrocinador del curso","description": "Logo en materiales y mención en acto de clausura",       "minimumAmount": 800000 }
        ],
        "updates": [
          { "date": "2025-01-30", "title": "Currículo diseñado",     "content": "Plan de estudios finalizado con expertos académicos." },
          { "date": "2025-04-15", "title": "Convenio firmado",       "content": "Alianza establecida con la Universidad de Antioquia." }
        ],
        "supporters": [
          { "name": "Universidad T. Nacional","amount": 300000,  "date": "2025-02-10" },
          { "name": "Ministerio de Energía",  "amount": 250000,  "date": "2025-03-05" },
          { "name": "Centro Tecnológico",     "amount": 350000,  "date": "2025-05-01" }
        ]
      },
      {
        "id": 15,
        "title": "Plataforma de Idiomas para Refugiados",
        "description": "Aprendizaje de idiomas online y gratuito",
        "longDescription": "Desarrollo de una plataforma interactiva para enseñar español, inglés y el idioma local a refugiados, con módulos de audio, video y tutorías entre pares.",
        "goal": 18000000,
        "collected": 12600000,
        "category": "Social",
        "deadline": "2025-10-15",
        "location": "Virtual",
        "creator": {
          "name": "LinguaSolidaria",
          "email": "contacto@linguasolidaria.org",
          "bio": "Organización sin fines de lucro dedicada a la inclusión lingüística de refugiados.",
          "avatar": "https://randomuser.me/api/portraits/lego/15.jpg"
        },
        "risksAndChallenges": "Acceso a internet, motivación continua y adaptación cultural. Se ofrecen datos subsidiados y mentorías voluntarias.",
        "rewards": [
          { "title": "Acceso premium",      "description": "Funcionalidades avanzadas de la plataforma",               "minimumAmount": 15000 },
          { "title": "Tutoría privada",     "description": "Sesión individual con profesor nativo",                    "minimumAmount": 40000 },
          { "title": "Pack de materiales",  "description": "Libros digitales y guías de estudio",                      "minimumAmount": 80000 },
          { "title": "Donante destacado",   "description": "Reconocimiento en la web y certificados institucionales",  "minimumAmount": 1200000 }
        ],
        "updates": [
          { "date": "2025-03-15", "title": "Portal inicial",      "content": "Lanzada la versión mínima con módulos básicos." },
          { "date": "2025-05-10", "title": "Primeros inscritos",  "content": "Cincuenta refugiados comenzaron sus clases." }
        ],
        "supporters": [
          { "name": "UNHCR Regional",    "amount": 400000,  "date": "2025-04-20" },
          { "name": "Editorial Global",  "amount": 500000,  "date": "2025-03-28" },
          { "name": "Donante Anónimo",   "amount": 360000,  "date": "2025-05-05" }
        ]
      },
      {
        "id": 16,
        "title": "Reciclaje Electrónico Comunitario",
        "description": "Recolección y aprovechamiento de e‑waste",
        "longDescription": "Programa de acopio y reciclaje de residuos electrónicos en barrios populares, con talleres de desmontaje, separación de materiales y envío a plantas de reciclaje certificadas.",
        "goal": 22000000,
        "collected": 1320000,
        "category": "Medio Ambiente",
        "deadline": "2025-09-30",
        "location": "Medellín, Colombia",
        "creator": {
          "name": "E‑Waste Solutions",
          "email": "info@ewastesol.com",
          "bio": "Empresa social especializada en gestión de residuos electrónicos.",
          "avatar": "https://randomuser.me/api/portraits/lego/16.jpg"
        },
        "risksAndChallenges": "Logística de recolección, separación segura y financiamiento del transporte. Se cuenta con puntos de acopio y voluntariado capacitado.",
        "rewards": [
          { "title": "Sticker ecológico",       "description": "Adhesivo con mensaje ambiental",                                "minimumAmount": 20000 },
          { "title": "Bolsa reutilizable",      "description": "Bolsa de tela con diseño del proyecto",                         "minimumAmount": 60000 },
          { "title": "Visita guiada",          "description": "Tour por las instalaciones de reciclaje",                        "minimumAmount": 130000 },
          { "title": "Patrocinador comunitario","description": "Logo en unidades de recolección y web",                        "minimumAmount": 900000 }
        ],
        "updates": [
          { "date": "2025-02-25", "title": "Centro habilitado",      "content": "Punto de acopio inaugurado con 200 kg de e‑waste." },
          { "date": "2025-05-20", "title": "Residuos procesados",    "content": "Más de 500 kg de componentes separados y enviados." }
        ],
        "supporters": [
          { "name": "Fundación Verde",      "amount": 500000,  "date": "2025-04-10" },
          { "name": "TechRecycle Ltda.",    "amount": 420000,  "date": "2025-03-15" },
          { "name": "Donante Local",        "amount": 400000,  "date": "2025-05-05" }
        ]
      },
      {
        "id": 17,
        "title": "Transporte Eléctrico Escolar",
        "description": "Ruta escolar con vehículos eléctricos",
        "longDescription": "Implantación de buses eléctricos para el transporte escolar en zonas periurbanas, reduciendo emisiones y garantizando seguridad y confort para los estudiantes.",
        "goal": 40000000,
        "collected": 28000000,
        "category": "Movilidad",
        "deadline": "2026-02-28",
        "location": "Región Metropolitana, Colombia",
        "creator": {
          "name": "EcoBus Escolar",
          "email": "contacto@ecobus.edu",
          "bio": "Proyecto piloto de movilidad eléctrica impulsado por la alcaldía local.",
          "avatar": "https://randomuser.me/api/portraits/lego/17.jpg"
        },
        "risksAndChallenges": "Infraestructura de carga, coste de adquisición y formación de conductores. Se han suscrito convenios con proveedor de energía renovable.",
        "rewards": [
          { "title": "Agradecimiento oficial", "description": "Mención en acto de presentación del servicio",             "minimumAmount": 25000 },
          { "title": "Visita guiada",          "description": "Tour por la unidad y conversación con el equipo técnico",   "minimumAmount": 70000 },
          { "title": "Viaje inaugural",        "description": "Asiento reservado en el viaje de lanzamiento",             "minimumAmount": 250000 },
          { "title": "Patrocinador oro",       "description": "Logo en laterales del bus y materiales promocionales",      "minimumAmount": 4000000 }
        ],
        "updates": [
          { "date": "2025-04-01", "title": "Ruta delineada",       "content": "Definidas paradas y horarios del transporte escolar." },
          { "date": "2025-06-01", "title": "Primer viaje",         "content": "Se efectuó el recorrido inaugural con 30 estudiantes." }
        ],
        "supporters": [
          { "name": "Gobernación Departamental", "amount": 1000000, "date": "2025-05-05" },
          { "name": "Empresa de Energía Limpia", "amount": 900000,  "date": "2025-04-20" },
          { "name": "Donante Institucional",     "amount": 900000,  "date": "2025-06-10" }
        ]
      }
    ]    
  }
}