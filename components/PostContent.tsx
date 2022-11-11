import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// UI component for main post content
export default function PostContent({ post }: { post: any }) {
    const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

    return (
        <div className="card">
            <h1>{post?.title}</h1>
            <span className="text-sm">
                Written by{' '}
                <Link className="text-info" href={`/${post.username}/`}>
                    @{post.username}
                </Link>{' '}
                on {createdAt.toISOString()}
            </span>
            <ReactMarkdown>{post?.content}</ReactMarkdown>
        </div>
    );
}