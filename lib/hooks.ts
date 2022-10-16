import { useEffect, useRef, useState } from 'react';
//import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@lib/firebase';
import {
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
    getFirestore,
    onSnapshot,
    Query,
    QuerySnapshot
} from 'firebase/firestore';
import { Auth, onIdTokenChanged, User } from 'firebase/auth';

export function useUserData(): any {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // turn off realtime subscription
        let unsubscribe;

        if (user) {
            const ref = doc(getFirestore(), 'users', user.uid);
            unsubscribe = onSnapshot(ref, (doc) => {
                if (doc) setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }

        return unsubscribe;
    }, [user]);

    return { user, username };
}

// added this due to problems with react-firebase-hooks

export function useAuthState(auth: Auth): any {
    const [user, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        return onIdTokenChanged(auth, (_user) => {
            setCurrentUser(_user ?? null);
        });
    }, [auth]);
    return [user];
}

export function useDocument(ref: DocumentReference): any {
    const [_doc, _setDoc] = useState<DocumentData | null>(null);

    const path = ref.path;
    const firestore = ref.firestore;

    useEffect(() => {
        // turn off realtime subscription
        return onSnapshot(doc(firestore, path), (snap) => {
            _setDoc(snap.exists() ? snap : null);
        });
    }, [path, firestore]);
    return [_doc];
}

export function useDocumentData(ref: DocumentReference): any {
    const [_doc, setDoc] = useState<DocumentData | null>(null);

    const path = ref.path;
    const firestore = ref.firestore;

    useEffect(() => {
        // turn off realtime subscription
        return onSnapshot(doc(firestore, path), (snap) => {
            setDoc(snap.exists() ? snap.data() : null);
        });
    }, [path, firestore]);
    return [_doc];
}

export function useDocumentDataOnce(ref: DocumentReference): any {
    const [_doc, setDoc] = useState<DocumentData | null>(null);

    const path = ref.path;
    const firestore = ref.firestore;

    useEffect(() => {
        // turn off realtime subscription
        getDoc(doc(firestore, path)).then(snap => {
            setDoc(snap.exists() ? snap.data() : null);
        });
        return;
    }, [path, firestore]);
    return [_doc];
}

export function useCollection(ref: Query): any {
    const [_col, setCol] = useState<QuerySnapshot | null>(null);
    const colRef = useRef(ref);
    useEffect(() => {
        // turn off realtime subscription
        return onSnapshot(colRef.current, (snap) => {
            setCol(!snap.empty ? snap : null);
        });
    }, []);
    return [_col];
}