import { Button, Container, Heading, Input } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { ref, get, set, push } from 'firebase/database';
import { db } from '../../firebase-config';
import { AuthContext } from '../../context/AuthContext';
import { Post } from '../../types';
import ThumbnailPreview from '../../components/ThumbnailPreview';

export const EditPost = () => {
    const { id } = useParams();
    const context = useContext(AuthContext);

    const [post, updatePost] = useState<Post>({
        id: '',
        title: '',
        markdown: '',
        thumbnail: '',
        color: '#000000'
    });

    useEffect(() => {
        console.log('EditPost');
        const setPost = async () => {
            console.log(id);
            if (id) {
                const postsRef = ref(db, `posts/${id}`);
                const snapshot = await get(postsRef);

                updatePost(snapshot.val());
            }
        };

        setPost();
    }, []);

    const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updatePost({
            ...post,
            title: event.target.value
        });
    };

    const onMarkdownChange = (value: any) => {
        updatePost({
            ...post,
            markdown: value
        });
    };

    const onFileChange = async (value: string) => {
        updatePost({
            ...post,
            thumbnail: value
        });
    };

    const onColorChange = async (value: string) => {
        updatePost({
            ...post,
            color: value
        });
    };

    const postPost = () => {
        if (id) {
            set(ref(db, `posts/${id}`), {
                markdown: post.markdown,
                title: post.title,
                thumbnail: post.thumbnail,
                color: post.color
            });
        } else {
            const postListRef = ref(db, `posts/`);
            const newPostRef = push(postListRef);

            set(newPostRef, {
                markdown: post.markdown,
                title: post.title,
                thumbnail: post.thumbnail,
                color: post.color
            });
        }
    };

    return (
        <>
            {context.isLoggedIn ? (
                <Container>
                    <Input value={post.title} onChange={onTitleChange} />
                </Container>
            ) : (
                <Container py={'5'}>
                    <Heading as="h3" fontSize={20} mb={4}>
                        {post.title}
                    </Heading>
                </Container>
            )}
            {context.isLoggedIn ? (
                <Container>
                    <Button onClick={postPost} colorScheme="blue" marginTop={'1em'}>
                        Post topic
                    </Button>

                    <ThumbnailPreview
                        color={post.color}
                        thumbnail={post.thumbnail}
                        onFileChange={onFileChange}
                        onColorChange={onColorChange}
                    />
                </Container>
            ) : (
                ''
            )}

            <Container>
                {context.isLoggedIn ? (
                    <MDEditor
                        value={post.markdown}
                        onChange={onMarkdownChange}
                        previewOptions={{
                            rehypePlugins: [[rehypeSanitize]]
                        }}
                    />
                ) : (
                    ''
                )}
                <MDEditor.Markdown source={post.markdown} style={{ whiteSpace: 'pre-wrap' }} />
            </Container>
        </>
    );
};

export default EditPost;