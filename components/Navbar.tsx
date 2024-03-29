import Link from 'next/link';
import Img from 'next/image';
import { useContext } from 'react';
import { UserContext } from '@lib/context';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '@lib/firebase';

// Top navbar
export default function Navbar(): JSX.Element {

    const { user, username } = useContext(UserContext);

    const router = useRouter();

    const signOutNow = () => {
        signOut(auth);
        router.reload();
    }

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link passHref={true} href="/">
                        <button className="btn-logo">FEED</button>
                    </Link>
                </li>

                {/* user is signed-in and has username */}
                {username && (
                    <>
                        <li className="push-left">
                            <button onClick={signOutNow}>Sign Out</button>
                        </li>
                        <li>
                            <Link passHref href="/admin">
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            {user?.photoURL && (
                                <Link passHref href={`/${username}`}>
                                    <Img alt={user?.displayName} src={user?.photoURL} width="50" height="50" />
                                </Link>
                            )}
                        </li>
                    </>
                )}

                {/* user is not signed OR has not created username */}
                {!username && (
                    <li>
                        <Link passHref href="/enter">
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}