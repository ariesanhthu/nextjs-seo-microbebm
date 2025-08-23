// import mongoose from 'mongoose';

// let cached = globalThis.mongoose;

// if (!cached) {
//   cached = globalThis.mongoose = { conn: null, promise: null };
// }

// const connectDB = async () => {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const connString = process.env.MONGODB_URI || '';
//     cached.promise = mongoose.connect(connString, {
//       // Bạn có thể thêm các options khác nếu cần
//     }).then((mongooseInstance) => {
//       return mongooseInstance;
//     });
//   }
//   cached.conn = await cached.promise;
//   console.log('MongoDB connected successfully');
//   return cached.conn;
// };

// export default connectDB;
