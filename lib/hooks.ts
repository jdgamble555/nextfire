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
    QueryDocumentSnapshot,
    QuerySnapshot
} from 'firebase/firestore';
import { Auth, onIdTokenChanged, User } from 'firebase/auth';

export function useUserData(): { user: User | null, username: string | null } {
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

export function useAuthState(auth: Auth): (User | null)[] {
    const [user, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        return onIdTokenChanged(auth, (_user) => {
            setCurrentUser(_user ?? null);
        });
    }, [auth]);
    return [user];
}

export function useDocument(ref: DocumentReference): (QueryDocumentSnapshot | null)[] {
    const [_doc, _setDoc] = useState<QueryDocumentSnapshot | null>(null);

    const docRef = useRef(ref);

    useEffect(() => {
        return onSnapshot(docRef.current, (snap) => {
            _setDoc(snap.exists() ? snap : null);
        });
    }, [docRef]);
    return [_doc];
}

export function useDocumentData(ref: DocumentReference): (DocumentData | null)[] {
    const [_doc, setDoc] = useState<DocumentData | null>(null);

    const docRef = useRef(ref);

    useEffect(() => {
        return onSnapshot(docRef.current, (snap) => {
            setDoc(snap.exists() ? snap.data() : null);
        });
    }, [docRef]);
    return [_doc];
}

export function useDocumentDataOnce(ref: DocumentReference): (DocumentData | null)[] {
    const [_doc, setDoc] = useState<DocumentData | null>(null);

    const docRef = useRef(ref);

    useEffect(() => {
        getDoc(docRef.current).then(snap => {
            setDoc(snap.exists() ? snap.data() : null);
        });
        return;
    }, [docRef]);
    return [_doc];
}

export function useCollection(ref: Query): (QuerySnapshot<DocumentData> | null)[] {
    const [_col, setCol] = useState<QuerySnapshot | null>(null);

    const colRef = useRef(ref);

    useEffect(() => {
        return onSnapshot(colRef.current, (snap) => {
            setCol(!snap.empty ? snap : null);
        });
    }, [colRef]);
    return [_col];
}