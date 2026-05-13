// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCHbNqnpm6SMDAMprUYZ04ilCw2x8Cgjrc",
    projectId: "streamly-75355",
    databaseURL: "https://streamly-75355-default-rtdb.europe-west1.firebasedatabase.app",
    appId: "1:958823392893:web:53e4c8ce40bd3d50c43314"
};

// Strapi Configuration
const strapiConfig = {
    baseURL: "https://streamlybackend-31ax.onrender.com",
    apiEndpoint: "/api/movies"
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, strapiConfig };
}