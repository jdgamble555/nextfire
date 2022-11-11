import { auth, googleAuthProvider } from '@lib/firebase';
import Img from 'next/image';
import { UserContext } from '@lib/context';
import { useCallback, useContext, useEffect, useState } from 'react';
import { doc, getDoc, getFirestore, writeBatch } from 'firebase/firestore';
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
//import debounce from 'lodash.debounce';

export default function Enter(): JSX.Element {
    const { user, username } = useContext(UserContext);

    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
    return (
        <main>
            {user ?
                !username ? <UsernameForm /> : <SignOutButton />
                : <SignInButton />
            }
        </main>
    );
}

// Sign in with Google button
function SignInButton(): JSX.Element {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider)
            .catch((e: any) => console.error(e));
    };

    return (
        <>
            <button className="btn-google" onClick={signInWithGoogle}>
                <Img alt="Sign in with Google" src={'/google.png'} width="30" height="30" />
                Sign in with Google
            </button>
            <button onClick={() => signInAnonymously(auth)}>
                Sign in Anonymously
            </button>
        </>
    );
}

// Sign out button
function SignOutButton(): JSX.Element {
    return <button onClick={() => signOut(auth).catch((e: any) => console.error(e))}>Sign Out</button>;
}

// Username form
function UsernameForm(): JSX.Element | null {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async (e: any) => {
        e.preventDefault();

        // Create refs for both documents
        const userDoc = doc(getFirestore(), 'users', user.uid);
        const usernameDoc = doc(getFirestore(), 'usernames', formValue);

        // Commit both docs together as a batch write.
        const batch = writeBatch(getFirestore());
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit().catch((e: any) => console.error(e));
    };

    const onChange = (e: any): void => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    const [timer] = useState(0);

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useCallback((username: string): void => {
        //debounce(async () => {
        clearTimeout(timer);
        setTimeout(async () => {
            if (username.length >= 3) {
                const ref = doc(getFirestore(), 'usernames', username);
                const snap = await getDoc(ref);
                console.log('Firestore read executed!', snap.exists());
                setIsValid(!snap.exists());
                setLoading(false);
            }
        }, 500);
        // }, 500)
    }, [timer]);

    useEffect((): void => {
        checkUsername(formValue);
    }, [formValue, checkUsername]);


    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    ) || null;
}

function UsernameMessage({ username, isValid, loading }: { username: string, isValid: boolean, loading: boolean }): JSX.Element {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
    } else {
        return <p></p>;
    }
}