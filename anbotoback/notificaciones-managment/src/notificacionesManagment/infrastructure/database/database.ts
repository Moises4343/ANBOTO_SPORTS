import mongoose from 'mongoose';

export async function connectToDatabase() {
    const mongoURI: string = 'mongodb://admin:193243up@54.83.57.80:27017/notification?authSource=admin';
    try {
        await mongoose.connect(mongoURI);
        console.log('Conexión a MongoDB establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        process.exit(1);
    }
}