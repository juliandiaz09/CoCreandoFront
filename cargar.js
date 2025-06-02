const admin = require('firebase-admin');
const proyectos = require('./projects.json'); // Asegúrate que el path sea correcto

// Configura Firebase Admin SDK
const serviceAccount = require('./cocreando.json'); // Cambia esto por tu archivo de credenciales

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadProjects() {
  try {
    const batch = db.batch();
    const proyectosRef = db.collection('proyectos');


    proyectos.forEach(proyecto => {
      // Asegúrate que el ID sea string (Firestore usa strings como IDs)
      const docRef = proyectosRef.doc(proyecto.id.toString());
      
      // Convertir fechas strings a objetos Date (Firestore las maneja automáticamente)
      const proyectoParaFirestore = {
        ...proyecto,
        deadline: new Date(proyecto.deadline),
        updates: proyecto.updates?.map(update => ({
          ...update,
          date: new Date(update.date)
        })),
        supporters: proyecto.supporters?.map(supporter => ({
          ...supporter,
          date: new Date(supporter.date)
        }))
      };

      batch.set(docRef, proyectoParaFirestore);
    });

    await batch.commit();
  } catch (error) {
    console.error('❌ Error al cargar proyectos:', error);
  }
}

uploadProjects();