// Firebase Database Module - Watch Progress Synchronization
class StreamlyDatabase {
    constructor() {
        this.database = null;
        this.userId = null;
    }

    init() {
        this.database = firebase.database();
    }

    setUserId(userId) {
        this.userId = userId;
    }

    async saveWatchProgress(movieId, currentTime, duration) {
        if (!this.userId) return;

        try {
            const ref = this.database.ref(`users/${this.userId}/watching/${movieId}`);
            await ref.set({
                currentTime: currentTime,
                duration: duration,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        } catch (error) {
            console.error('Erro ao guardar progresso:', error);
        }
    }

    async getWatchProgress(movieId) {
        if (!this.userId) return null;

        try {
            const ref = this.database.ref(`users/${this.userId}/watching/${movieId}`);
            const snapshot = await ref.once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Erro ao obter progresso:', error);
            return null;
        }
    }

    async getAllWatchingMovies() {
        if (!this.userId) return [];

        try {
            const ref = this.database.ref(`users/${this.userId}/watching`);
            const snapshot = await ref.once('value');
            const watching = snapshot.val();
            
            if (!watching) return [];

            // Converter para array e ordenar por timestamp descendente
            return Object.keys(watching)
                .map(movieId => ({
                    movieId: movieId,
                    ...watching[movieId]
                }))
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        } catch (error) {
            console.error('Erro ao obter filmes em progresso:', error);
            return [];
        }
    }

    async removeFromWatching(movieId) {
        if (!this.userId) return;

        try {
            const ref = this.database.ref(`users/${this.userId}/watching/${movieId}`);
            await ref.remove();
        } catch (error) {
            console.error('Erro ao remover do histórico:', error);
        }
    }

    // Real-time listener para mudanças no progresso
    onWatchProgressChanged(movieId, callback) {
        if (!this.userId) return;

        const ref = this.database.ref(`users/${this.userId}/watching/${movieId}`);
        ref.on('value', (snapshot) => {
            callback(snapshot.val());
        });

        // Retornar função para desligar o listener
        return () => ref.off('value');
    }
}

// Initialize database module
const streamlyDatabase = new StreamlyDatabase();
streamlyDatabase.init();