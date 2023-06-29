import React, { useEffect, useState } from 'react';
import navigationConfig from '../navigationConfig';
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Outlet, Link } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

let childNavNode = function() {
  this.name = '';
  this.href = '#';
}

let parentNavNode = function() {
  this.name = '';
  this.current = false;
  this.children = [];
}

export default function Root() {
const [navData, setNavData] = useState([]);

useEffect(() => {
    async function getNavigation() {
        const labelRegex = /(?<=label:\s).*/;
        const navNodes = [];
        try {
            navigationConfig.forEach((data) => {

                let childElements = [];
                  
                data.pages.forEach((page) =>{
                    fetch(`docs/${page}.md`)
                        .then(response => response.text())
                        .then(text => 
                        { 
                            let pageProps = text.substring(text.indexOf('-----')+7,text.lastIndexOf('-----'));
                            let pageLabel = labelRegex.exec(pageProps);
                            let childNode = new childNavNode();
                            childNode.name = pageLabel[0];
                            childNode.href = page;
                            childElements.push(childNode);
                        })
                })

                let parentNode = new parentNavNode();
                parentNode.name = data.section;
                parentNode.children = childElements;
                navNodes.push(parentNode);
            });
            setNavData(navNodes);
        } catch (err) {
            console.log(err);
        }
    }
    getNavigation();
}, []);

return (
<>
    <div className="flex min-h-screen bg-white">
    <div className="flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-center">
                <Link to="/" className="text-xl">Mind The Docs</Link>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                    <ul role="list" className="-mx-2 space-y-1">
                    {navData.map((item) => (
                        <li key={item.name}>
                        {!item.children ? (
                            <Link
                                key={item.name}
                                to={`docs/${item.href}`}
                                className={classNames(
                                    item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                    'block rounded-md py-2 pr-2 pl-10 text-sm leading-6 font-semibold text-gray-700'
                                )}>
                                {item.name}
                            </Link>
                        ) : (
                            <Disclosure as="div">
                            {({ open }) => (
                                <>
                                <Disclosure.Button
                                    className={classNames(
                                    item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                    'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700'
                                    )}
                                >
                                    <ChevronRightIcon
                                    className={classNames(
                                        open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                        'h-5 w-5 shrink-0'
                                    )}
                                    aria-hidden="true"
                                    />
                                    {item.name}
                                </Disclosure.Button>
                                <Disclosure.Panel as="ul" className="mt-1 px-2">
                                    {item.children.map((subItem) => (
                                    <li key={subItem.name}>
                                        <Link
                                            key={subItem.name}
                                            to={`docs/${subItem.href}`}
                                            className={classNames(
                                                subItem.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                            'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700'
                                            )}>
                                            {subItem.name}
                                        </Link>
                                    </li>
                                    ))}
                                </Disclosure.Panel>
                                </>
                            )}
                            </Disclosure>
                        )}
                        </li>
                    ))}
                    </ul>
                </li>
                </ul>
            </nav>
        </div>
    </div>
        <div className="flex-1" id="body">
            <Outlet />
        </div>
    </div>
</>
)
}