import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page" className="flex h-screen text-center">
            <div class="m-auto">
                <h1 className="text-3xl font-bold text-blue-800 mb-12">Uh oh...</h1>
                <p className="text-lg mb-4">Sorry, an unexpected erorr has occurred. Share the info from below to help me out!</p>
                <p>
                    <i>{error.statusText || error.message }</i>
                </p>
            </div>
        </div>
    );
}