import firebase from './'
import 'firebase/database'

export function set (path: string, data: object) {  
  return firebase.database().ref(path).update(data)
}

export function push (path: string, data: any) {
  return firebase.database().ref(path).push(data)
}

export function read (path: string) {
  return firebase.database().ref(path).once('value')
}

export function listenStart (path: string) {
  return firebase.database().ref(path).on('value', (snapshot: any) => {
    return snapshot.val()
  })
}

export function remove (path: string) {
  return firebase.database().ref(path).remove()
}
