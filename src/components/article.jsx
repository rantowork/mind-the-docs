import React from 'react';
import {useParams} from 'react-router-dom';

function Article() {
    const {id} = useParams();
    const {folder} = useParams();

    return (
        <>
            <div className="ml-8 mt-4">Hello, world, this is an article! This article is in the {folder} folder and has an id of {id}.</div>
        </>
    )
}

export default Article;