// Firebase Authentication Module
class StreamlyAuth {
    constructor() {
        this.auth = null;
    }

    init() {
        firebase.initializeApp(firebaseConfig);
        this.auth = firebase.auth();
    }

    async register(email, password) {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            await this.auth.signOut();
        } catch (error) {
            throw error;
        }
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }

    onAuthStateChanged(callback) {
        return this.auth.onAuthStateChanged(callback);
    }

    async resetPassword(email) {
        try {
            await this.auth.sendPasswordResetEmail(email);
        } catch (error) {
            throw error;
        }
    }
}

// Initialize auth module
const streamlyAuth = new StreamlyAuth();
streamlyAuth.init();