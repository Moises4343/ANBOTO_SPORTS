import mongoose from 'mongoose';

export async function connectToDatabase() {
    const mongoURI: string = 'mongodb://localhost:27017/notifications';
    try {
        await mongoose.connect(mongoURI);
        console.log('Conexión a MongoDB establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        process.exit(1);
    }
}