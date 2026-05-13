// Strapi API Module
class StreamlyAPI {
    constructor() {
        this.baseURL = strapiConfig.baseURL;
        this.apiEndpoint = strapiConfig.apiEndpoint;
    }

    async getAllMovies() {
        try {
            const response = await fetch(`${this.baseURL}${this.apiEndpoint}`);
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Erro ao obter filmes:', error);
            return [];
        }
    }

    async getMoviesByCategory(category) {
        try {
            const movies = await this.getAllMovies();
            return movies.filter(movie => {
                const movieData = movie.attributes || movie;
                return movieData.category === category;
            });
        } catch (error) {
            console.error('Erro ao filtrar por categoria:', error);
            return [];
        }
    }

    async getMovieById(movieId) {
        try {
            const response = await fetch(`${this.baseURL}${this.apiEndpoint}/${movieId}`);
            const data = await response.json();
            return data.data || null;
        } catch (error) {
            console.error('Erro ao obter filme:', error);
            return null;
        }
    }

    async getCategories() {
        try {
            const movies = await this.getAllMovies();
            const categories = new Set();
            
            movies.forEach(movie => {
                const movieData = movie.attributes || movie;
                if (movieData.category) {
                    categories.add(movieData.category);
                }
            });
            
            return Array.from(categories);
        } catch (error) {
            console.error('Erro ao obter categorias:', error);
            return [];
        }
    }

    // Helper para obter dados do filme (compatível com Strapi v3 e v4)
    getMovieData(movie) {
        return movie.attributes || movie;
    }

    // Helper para obter URL da capa
    getPosterUrl(movie) {
        const movieData = this.getMovieData(movie);
        return movieData.posterUrl || movieData.poster?.data?.attributes?.url || '';
    }

    // Helper para obter URL do vídeo
    getVideoUrl(movie) {
        const movieData = this.getMovieData(movie);
        return movieData.videoUrl || '';
    }

    // Helper para obter URL do trailer
    getTrailerUrl(movie) {
        const movieData = this.getMovieData(movie);
        return movieData.trailerUrl || '';
    }
}

// Initialize API module
const streamlyAPI = new StreamlyAPI();