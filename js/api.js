// Strapi API Module
class StreamlyAPI {
    constructor() {
        this.baseURL = strapiConfig.baseURL;
        this.apiEndpoint = strapiConfig.apiEndpoint;
    }

    // Obter todos os filmes
    async getAllMovies() {
        try {
            const response = await fetch(`${this.baseURL}${this.apiEndpoint}`);
            if (!response.ok) throw new Error('Erro ao obter filmes');
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Erro ao obter filmes:', error.message);
            return [];
        }
    }

    // Obter filmes por categoria
    async getMoviesByCategory(category) {
        try {
            const movies = await this.getAllMovies();
            return movies.filter(movie => movie.attributes.category === category);
        } catch (error) {
            console.error('Erro ao obter filmes por categoria:', error.message);
            return [];
        }
    }

    // Obter detalhes de um filme específico
    async getMovieById(movieId) {
        try {
            const response = await fetch(`${this.baseURL}${this.apiEndpoint}/${movieId}`);
            if (!response.ok) throw new Error('Erro ao obter filme');
            const data = await response.json();
            return data.data || null;
        } catch (error) {
            console.error('Erro ao obter filme:', error.message);
            return null;
        }
    }

    // Obter todas as categorias únicas
    async getCategories() {
        try {
            const movies = await this.getAllMovies();
            const categories = new Set();
            movies.forEach(movie => {
                if (movie.attributes.category) {
                    categories.add(movie.attributes.category);
                }
            });
            return Array.from(categories).sort();
        } catch (error) {
            console.error('Erro ao obter categorias:', error.message);
            return [];
        }
    }

    // Formatar URL da imagem do Strapi
    formatImageUrl(imageUrl) {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http')) return imageUrl;
        return `${this.baseURL}${imageUrl}`;
    }

    // Obter URL do vídeo (Dropbox)
    getVideoUrl(videoUrl) {
        if (!videoUrl) return '';
        // Se for link do Dropbox, garantir que tem o parâmetro dl=1
        if (videoUrl.includes('dropbox.com')) {
            return videoUrl.includes('dl=0') ? videoUrl.replace('dl=0', 'dl=1') : videoUrl + '?dl=1';
        }
        return videoUrl;
    }
}

// Instanciar globalmente
const streamlyAPI = new StreamlyAPI();