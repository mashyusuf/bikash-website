const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const balanceCollection = client.db('mfsWebsite').collection('balance');
    const sendMoneyCollection = client.db('mfsWebsite').collection('sendMoney');
    const cashOutCollection = client.db('mfsWebsite').collection('cashOut');
   

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

       { if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(pin, user.pin);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }}

        const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '7d',
        });

        res.json({ token });
      } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error' });
      }
    });

    // Middleware to verify JWT and role
function verifyJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch user details from MongoDB
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check user's role
    if (user.role !== 'admin' && user.role !== 'agent' && user.role !== 'user') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = decoded.userId;
    req.userRole = user.role;
    next();
  });
}


    // POST route to update user balance using balanceCollection
    app.post('/api/updateBalance', verifyJWT, async (req, res) => {
      const { amount } = req.body;

      try {
        // Fetch user balance document from balanceCollection
        const balanceDocument = await balanceCollection.findOne({ userId: req.user });
        if (!balanceDocument) {
          return res.status(400).json({ message: 'User balance document not found' });
        }

        // Update user's balance
        const updatedBalance = balanceDocument.balance + parseFloat(amount);

        // Update balance document in balanceCollection
        const result = await balanceCollection.updateOne(
          { userId: req.user },
          { $set: { balance: updatedBalance } }
        );

        if (result.modifiedCount !== 1) {
          throw new Error('Failed to update balance document');
        }

        res.json({ message: 'Balance updated successfully', newBalance: updatedBalance });
      } catch (error) {
        console.error('Error updating balance:', error);
        res.status(500).json({ message: 'Server error. Failed to update balance.' });
      }
    });

    // GET route to fetch user balance from balanceCollection
    app.get('/api/balance', verifyJWT, async (req, res) => {
      try {
        // Fetch user balance document from balanceCollection
        const balanceDocument = await balanceCollection.findOne({ userId: req.user });
        if (!balanceDocument) {
          return res.status(400).json({ message: 'User balance document not found' });
        }

        res.json({ balance: balanceDocument.balance });
      } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ message: 'Server error. Failed to fetch balance.' });
      }
    });

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

    // Cash-out route
    app.post('/api/cashout', verifyJWT, async (req, res) => {
      const { amount, pin, agentId } = req.body;

      try {
        console.log('Cash-out request received:', req.body);
        const user = await usersCollection.findOne({ _id: new ObjectId(req.user) });
        const agent = await usersCollection.findOne({ _id: new ObjectId(agentId), role: 'agent' });

        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }
        if (!agent) {
          return res.status(400).json({ message: 'Agent not found or not valid' });
        }

        // Check if pin is correct
        const isPinValid = await bcrypt.compare(pin, user.pin);
        if (!isPinValid) {
          return res.status(400).json({ message: 'Invalid PIN' });
        }

        const transactionAmount = parseFloat(amount);
        if (user.balance < transactionAmount) {
          return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Calculate transaction fee and total deduction
        const fee = transactionAmount * 0.015;
        const totalDeduction = transactionAmount + fee;

        // Update balances
        const updatedUserBalance = user.balance - totalDeduction;
        const updatedAgentBalance = agent.balance + transactionAmount + fee;

        // Perform the transaction
        const transaction = {
          userId: user._id,
          agentId: agent._id,
          amount: transactionAmount,
          fee,
          totalDeduction,
          date: new Date(),
        };

        const transactionResult = await cashOutCollection.insertOne(transaction);
        if (!transactionResult.insertedId) {
          throw new Error('Failed to record transaction');
        }

        // Update user and agent balances in the database
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { balance: updatedUserBalance } }
        );
        await usersCollection.updateOne(
          { _id: agent._id },
          { $set: { balance: updatedAgentBalance } }
        );

        res.json({ message: 'Cash-out successful', transaction });
      } catch (error) {
        console.error('Error during cash-out:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
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
