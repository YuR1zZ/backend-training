import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import authRouter from './routes/auth.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleWare from './middlewares/error.midleware.js';
import coockieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(coockieParser());

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)

app.use(errorMiddleWare)

app.get('/',(req,res)=>{
    res.send('welcome to subscription tracker API')
});

app.listen(PORT, async ()=>{
    console.log(`subscription tracker API is running on http://localhost:${PORT}`)

    await connectToDatabase();
})

export default app;