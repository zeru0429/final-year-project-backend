import express from "express";
import cors from 'cors';
import requestIp from "request-ip";
import { CORS_ORIGIN, HOST, PORT } from "./config/secrets.js";
import { errorMiddleware } from "./middlewares/error.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express() as express.Application; // Explicitly specify the type
const httpServer = createServer(app);

//prepare io
const io = new Server(httpServer, {
   pingTimeout: 60000,
   cors:{
      credentials:true,
      origin: CORS_ORIGIN,
   }
});
app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);

// global middlewares
app.use(
   cors({
     origin:
       process.env.CORS_ORIGIN === "*"
         ? "*" // This might give CORS error for some origins due to credentials set to true
         : process.env.CORS_ORIGIN?.split(","), // For multiple cors origin for production. 
     credentials: true,
   })
 );

 app.use(requestIp.mw());
 app.use(express.static("public")); // configure static file to save images locally


// Routes
import appRouter from "./routes/index.js";
import axios from "axios";
app.use('/api', appRouter);
//testing route
app.get('/', async (req, res) => {
  // sendSMS('+251904825407','ye yoseph lij endet nesh ' );
  // sendSMS22('+251904825407','ye yoseph lij mohanud endet nesh ' );
  // const mess= {
  //   "secret": UNCG_API,
  //   "mode": "devices",
  //   "device": "00000000-0000-0000-d57d-f30cb6a89289",
  //   "sim": 1,
  //   "priority": 1,
  //   "phone": "+251965199682",
  //   "message": "Hello World!"
  // }
  // try {
  //   const response = await axios.post('https://sms.uncgateway.com/api/send/sms',{params: mess});
  //   console.log(response.data);
    
  // } catch (error: any) {
  //   console.log(error.message)
  // }

  //sikar
  // const bd = {
  //   "template_id": "EntertemplateID",
  //   "short_url": "1 (On) or 0 (Off)",
  //   "recipients": [
  //     {
  //       "mobiles": "251904825407",
  //       "VAR1": "VALUE 1",
  //       "VAR2": "VALUE 2"
  //     }
  //   ]
  // };
  
  // try {
  //   const response = await axios.post('https://control.msg91.com/api/v5/flow/', bd, {
  //   headers: {
  //     "authkey": SIKAR_API,
  //     "content-type": "application/json" // Changed to lowercase 'json'
  //   }
  // });
  // console.log(response.data);
    
  // } catch (error: any) {
  //   console.log(error.message)
  // }
  
  //my
  // let username = 'zeru0429';
  // let password = 'OpenAi@2023';
  // let postData = JSON.stringify({
  //   'to' : ['+251904825407', '+251965199682'],
  //   'body': 'Hello Yosi!'
  // });


  // let auth = Buffer.from(`${username}:${password}`).toString('base64');
  // let config = {
  //   method: 'post',
  //   url: 'https://api.bulksms.com/v1/messages',
  //   headers: { 
  //     'Content-Type': 'application/json', 
  //     'Authorization': `Basic ${auth}`
  //   },
  //   data : postData
  // };
  // axios(config)
  // .then((response) => {
  //   console.log('statusCode:', response.status);
  //   console.log("Response:", response.data);
  // })
  // .catch((error) => {
  //   console.error(error);
  // });
  

  res.send("app working");
});

const startServer = () => {
   httpServer.listen(PORT || 8080, () => {
     console.log(`⚙️ Server is running http://${HOST}:${PORT}`);
   });
 };
 

 startServer();
// app.listen(PORT, () => console.log(`Server is running http://${HOST}:${PORT}`));
