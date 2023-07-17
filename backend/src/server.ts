import app from "./app";
import mongoose from "mongoose";


const port = process.env.PORT;

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_CONNECTION_STRING!)
    .then(() => {
        console.log("Mongoose connected");
        app.listen(port, () => {
            console.log("Server running on port: " + port);
        });
    })
    .catch(console.error);

   
    

    