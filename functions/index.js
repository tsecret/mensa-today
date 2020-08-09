const functions = require('firebase-functions');
const firebase = require('firebase');
const admin = require('firebase-admin');
const { user } = require('firebase-functions/lib/providers/auth');
const app = require('express')();
const axios = require('axios');
// const cors = require('cors');
admin.initializeApp();
// app.use(cors({ origin: true }));

var firebaseConfig = {
    apiKey: "AIzaSyD-4peeepzDf4xQoD5qdnC1JH6WXlKp76w",
    authDomain: "mensa-today.firebaseapp.com",
    databaseURL: "https://mensa-today.firebaseio.com",
    projectId: "mensa-today",
    storageBucket: "mensa-today.appspot.com",
    messagingSenderId: "712413286137",
    appId: "1:712413286137:web:8d0600e47dd9183bb15c28",
    measurementId: "G-X8PCMZEG7G"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
};
  
const isEmpty = (string) => {
    if (string.trim() === '') return true;
    else return false;
};

const FBAuth = async (req, res, next) => {

    var token;
    var dToken;

    // CHECK FOR AUTH BEARER
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split('Bearer ')[1]
    } else {
        return res.status(403).json({ message: "Unauthorized"})
    }
    
    // DECODE TOKEN
    await admin.auth().verifyIdToken(token)
    .then(decodedToken => {dToken = decodedToken})

    // FILTER
    if(req.route.path==='/addcard'){
        if(req.body.id !== dToken.uid) res.status(403).json({message:"Unauthorized"})
    }

    // FETCH USER DATA 
    await db.doc('/users/' + dToken.uid).get()
    .then(doc => {
        if(doc.exists) {
            next();
        } else {
            res.status(400).json({message: "Document does not exist"})
        }
    })
    .catch(error => res.status(400).json({message: error.message}))
};

app.get("/user", FBAuth, (req, res) => {
    db.doc('/users/' + req.query.id).get()
    .then(doc => res.status(200).json(doc.data()))
})

app.post('/signup', (req, res) => {
    console.log("Signup request from " + req.body.username)

    var token;
    var userCredentials = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        created_at: new Date().getTime(),
        cards: [],
    }


    firebase.auth().createUserWithEmailAndPassword(userCredentials.email, userCredentials.password)
    .then(data => {
        userCredentials.id = data.user.uid;
        userCredentials.username = userCredentials.username.toLowerCase()
        delete userCredentials.password;
        return data.user.getIdToken();
    })
    .then(idToken => {
        token = idToken;
        return db.doc(`/users/${userCredentials.id}`).set(userCredentials);
    })
    .then(() => {
		console.log(`User ${userCredentials.username} signup sucessfully`)
      	return res.status(201).json({ token });
    })
    .catch(error => {
      if(error.code===500){
        res.status(500).json({})
      } else{
        res.status(400).json({message: error.message})
      }
    })
})

app.post('/login', async (req, res) => {
    var userCredentials = {
		data: req.body.data,
		email: "",
    password: req.body.password,
	}
	
	if (Number.isInteger(userCredentials.data)){
		console.log("Login with cardID");
		await db.collection('/users').get()
		.then(data => {
			data.forEach(async doc => {
				if(doc.data().cardID === parseInt(userCredentials.data)) userCredentials.email = await doc.data().email
			});
		});
	} else if(!isEmail(userCredentials.data)){
		console.log("Login with username");
		await db.doc('/users/' + userCredentials.data).get()
		.then(async doc => {
			if(doc.exists) userCredentials.email = await doc.data().email;
		})
	} else {
		console.log("Login with email");
	  userCredentials.email = userCredentials.data;
	}

    firebase.auth().signInWithEmailAndPassword(userCredentials.email, userCredentials.password)
    .then((data) => {
        return data.user.getIdToken();
      })
    .then((token) => {
          return res.json({ token });
    })
    .catch(error => res.status(400).json({message: error.message}))
})

app.post("/addcard", FBAuth, async(req, res) => {
    var cards;
    var card = {
        id: parseInt(req.body.cardID),
        owner: req.body.id
    }
    await db.doc('/users/' + card.owner).get()
    .then(async doc => {
        cards = doc.data().cards;
        await cards.forEach(ownedCard => {
            if(ownedCard.id===card.id) res.status(400).json({message: "You already own this card"})
        })
        cards.push(card);
    });

    await db.doc('/users/' + card.owner)
    .update({cards})

    res.status(200).json(cards)
})

app.get("/cardbalance", FBAuth, async (req, res) => {
    await axios.get(`https://topup.klarna.com/api/STW_DUSSELDORF/cards/${req.query.id}/balance`)
    .then(response => res.status(200).json({balance: response.data.balance/10}))
    .catch(error => res.status(400).json({message: error.response.message }))
})


exports.api = functions.https.onRequest(app);