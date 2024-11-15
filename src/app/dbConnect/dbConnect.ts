// import mongoose from "mongoose";

// export async function connect(){
//     try{
//         await mongoose.connect(process.env.MONGO_URI!);

//         const connection = mongoose.connection;

//         connection.on('connected', () => {
//             console.log("MongoDB Conencted Successfully");
//         })

//         connection.on('error', (err) => {
//             console.log(err)
//         })

//     }catch(error){
//         console.log("Error connecting to MongoDB");
//         console.log(error);
//         process.exit(1);
//     }
// }
