import { Box, Button, Container, Heading, Spinner, SimpleGrid, Link } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { GridArticleItem } from '../../components/GridItem';
import { db } from '../../firebase-config';

export interface Article {
    id: string;
    title: string;
    markdown: string;
}

export const ArticlesList: React.FC = () => {
    const [articlesList, updateArticlesList] = useState<Article[]>();

    useEffect(() => {
        const setArticles = async () => {
            const userRef = ref(db, `articles`);
            const snapshot = await get(userRef);

            const articles: Article[] = [];

            for (const [key, value] of Object.entries(snapshot.val())) {
                articles.push({
                    id: key,
                    title: value?.title,
                    markdown: value?.markdown
                });
            }

            updateArticlesList(articles);
        };

        setArticles();
    }, []);

    const renderArticles = (arr: Article[]) =>
        arr.map((item: Article) => (
            <GridArticleItem
                key={item.id}
                title={`${item.title}`}
                thumbnail={`${process.env.PUBLIC_URL}/content/playwright.png`}
                id={item.id}
            />
        ));

    const articles = articlesList?.length ? renderArticles(articlesList) : <Spinner />;

    return (
        <Container py={5}>
            <Box>
                <Heading as="h3" fontSize={20} mb={4}>
                    Articles
                </Heading>

                <Link href="/articles/new">
                    <Button colorScheme="blue">Add Article</Button>
                </Link>
            </Box>

            <Box py={5}>
                <SimpleGrid columns={[1, 2, 2]} gap={10}>
                    {articles}
                </SimpleGrid>
            </Box>
        </Container>
    );
};

export default ArticlesList;