const functions = require('firebase-functions');
const firebase = require('firebase');
const admin = require('firebase-admin');
const { user } = require('firebase-functions/lib/providers/auth');
const app = require('express')();
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

const FBAuth = (req, res, next) => {
	console.log("FBAuth")
	let restricted_routes = [
		'/user'
	]
	let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
		if(restricted_routes.includes(req.route.path)){
			req.query.restricted=true;
			return next()
		} else {
			console.error('No token found');
			return res.status(403).json({ error: 'Unauthorized' });
		}
    }
  
    admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
		req.user = decodedToken;
		return db
			.collection('users')
			.where('user_id', '==', req.user.uid)
			.limit(1)
			.get();
    })
    .then((data) => {
		req.user.username = data.docs[0].data().username;
		if (req.user.username !== req.query.username) req.query.restricted=true;
		return next();
    })
    .catch((err) => {
		console.error('Error while verifying token ', err);
		return res.status(403).json(err);
    });
};

app.get("/users",  (req, res) => {
    res.send(200).json({})
})

app.post('/signup', (req, res) => {
    var token;
    var userCredentials = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cardID: req.body.cardID,
        created_at: new Date().getTime(),
        balance: null,
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
        return db.doc(`/users/${userCredentials.username}`).set(userCredentials);
    })
    .then(() => {
		console.log(`User ${userCredentials.username} signup sucessfully`)
      	return res.status(201).json({ token });
    })
    .catch(error => res.status(400).json({message: error.message}))
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




exports.api = functions.https.onRequest(app);