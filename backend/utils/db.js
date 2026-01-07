import mongoose from "mongoose";

// Disable Mongoose buffering globally - fail fast if not connected
mongoose.set('bufferCommands', false);

let isConnecting = false;
let connectionPromise = null;

const connectDB = async (retries = 3) => {
    // If already connected, return immediately
    if (mongoose.connection.readyState === 1) {
        return true;
    }

    // If already connecting, wait for that connection
    if (isConnecting && connectionPromise) {
        return connectionPromise;
    }

    // Start new connection attempt
    isConnecting = true;
    connectionPromise = (async () => {
        try {
            // Connection options for MongoDB Atlas
            const options = {
                serverSelectionTimeoutMS: 30000, // Increased to 30s for network issues
                socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
                connectTimeoutMS: 30000, // Connection timeout
                retryWrites: true,
                retryReads: true,
                // Additional options for Atlas
                maxPoolSize: 10, // Maintain up to 10 socket connections
                minPoolSize: 2, // Maintain at least 2 socket connections
                maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
            };

            // Set up event handlers only once
            if (!mongoose.connection.listeners('error').length) {
                mongoose.connection.on('error', (err) => {
                    console.error('MongoDB connection error:', err.message);
                });
            }

            if (!mongoose.connection.listeners('disconnected').length) {
                mongoose.connection.on('disconnected', () => {
                    console.log('MongoDB disconnected - attempting to reconnect...');
                    isConnecting = false;
                    connectionPromise = null;
                    // Attempt to reconnect after 5 seconds
                    setTimeout(() => {
                        if (mongoose.connection.readyState === 0) {
                            connectDB(1);
                        }
                    }, 5000);
                });
            }

            if (!mongoose.connection.listeners('reconnected').length) {
                mongoose.connection.on('reconnected', () => {
                    console.log('MongoDB reconnected successfully');
                });
            }

            console.log('Connecting to MongoDB Atlas...');
            await mongoose.connect(process.env.MONGO_URI, options);
            console.log('MongoDB connected successfully');
            isConnecting = false;
            return true;
        } catch (error) {
            isConnecting = false;
            console.error('MongoDB connection error:', error.message);
            
            if (retries > 0) {
                console.log(`Retrying connection... (${retries} attempts remaining)`);
                await new Promise(resolve => setTimeout(resolve, 5000));
                connectionPromise = null;
                return connectDB(retries - 1);
            }
            
            console.error('Failed to connect to MongoDB after all retries');
            connectionPromise = null;
            return false;
        }
    })();

    return connectionPromise;
}

export default connectDB;