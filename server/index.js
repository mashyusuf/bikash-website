// app.js (or your server file)
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const port = process.env.PORT || 8000;

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173'], // Adjust this to your frontend's URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// MongoDB setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ziugtg4.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');

    const usersCollection = client.db('mfsWebsite').collection('users');
    const sendMoneyCollection = client.db('mfsWebsite').collection('sendMoney');

    // Register route
    app.post('/register', async (req, res) => {
      const { name, lname, email, number, pin, role } = req.body;
      const user = await usersCollection.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const hashedpin = await bcrypt.hash(pin, 10);
      const userInfo = {
        name,
        lname,
        email,
        number,
        pin: hashedpin,
        role,
        status: 'pending',
      };
      const result = await usersCollection.insertOne(userInfo);
      res.send(result);
    });

    // Login route
    app.post('/login', async (req, res) => {
      const { credential, pin } = req.body;

      try {
        const user = await usersCollection.findOne({
          $or: [{ email: credential }, { number: credential }],
        });

        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(pin, user.pin);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '7d',
        });

        res.json({ token });
      } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error' });
      }
    });

    // Middleware to verify JWT
    function verifyJWT(req, res, next) {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.user = decoded.userId; // Assuming userId is stored in decoded object
        next();
      });
    }

  // POST endpoint for sending money
app.post('/api/sendMoney', verifyJWT, async (req, res) => {
  const { amount, pin, phoneNumber } = req.body;

  try {
    // Validate amount, pin, phoneNumber, and other necessary checks
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 50 || !pin || !phoneNumber) {
      return res.status(400).json({ message: 'Invalid request. Please provide valid amount, PIN, and recipient phone number.' });
    }

    // Process transaction logic
    let transactionFee = 0;
    if (parseFloat(amount) > 100) {
      transactionFee = 5;
    }

    const totalAmount = parseFloat(amount) + transactionFee;

    // Example of saving transaction in MongoDB collection
    const transaction = {
      sender: req.user, // Assuming userId is stored in req.user after JWT verification
      recipientPhoneNumber: phoneNumber,
      amount: parseFloat(amount),
      transactionFee,
      totalAmount,
      date: new Date(),
    };

    const result = await sendMoneyCollection.insertOne(transaction);
    
    // Check if insertion was successful
    if (result && result.insertedCount === 1) {
      console.log('Money sent successfully:', result.ops[0]);
      return res.json({ message: 'Money sent successfully', transaction: result.ops[0] });
    } else {
      throw new Error('Failed to insert transaction into database');
    }
  } catch (error) {
    console.error('Error sending money:', error);
    return res.status(500).json({ message: 'Server error. Failed to send money.' });
  }
});



    // Default route
    app.get('/', (req, res) => {
      res.send('Server is running...');
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

run().catch(console.dir);
