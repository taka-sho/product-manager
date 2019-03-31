import * as firebase from 'firebase/app'

const config = {
  apiKey: 'AIzaSyCpwQB1T64mawu3q0A_2vZBHZjfeIaSAU4',
  authDomain: 'train-product-manager.firebaseapp.com',
  databaseURL: 'https://train-product-manager.firebaseio.com',
  projectId: 'train-product-manager',
  storageBucket: 'train-product-manager.appspot.com',
  messagingSenderId: '1019313849328',
}

export default firebase.initializeApp(config)
