import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import {micromark} from 'micromark';
import {gfm, gfmHtml} from 'micromark-extension-gfm';
import DOMPurify from 'dompurify';

function Article() {
    const {id} = useParams();
    const {folder} = useParams();

    const [markdownData, setMarkdownData] = useState([]);
    const loadMarkdownData = async () => {
        let markdownPath = `/docs/${folder}/${id}.md`;
        let articleText = '';
        try {
            await fetch (markdownPath)
                .then(response => response.text())
                .then(text => {
                    articleText = text;
                });

                let articleBodyText = articleText.substring(articleText.lastIndexOf('-----')+5);

                let htmlFromMarkdown = micromark(articleBodyText, {
                    extensions: [gfm()],
                    htmlExtensions: [gfmHtml()]
                })

                let cleanHtml = DOMPurify.sanitize(htmlFromMarkdown, {USE_PROFILES: {html: true}});

                setMarkdownData(cleanHtml);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadMarkdownData();
        return () => {};
    }, [folder, id]);

    return (
        <>
            <div className="ml-8 mt-8">
                <article className="prose min-w-fit">
                    <div dangerouslySetInnerHTML={{__html: markdownData}} />
                </article>
            </div>
        </>
    )
}

export default Article;