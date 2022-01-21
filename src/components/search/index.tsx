import _ from 'lodash'

import React, {useEffect, useState} from 'react'
import {Search} from 'semantic-ui-react'
import {PostProp} from "../post/types";


type State = {
    loading: boolean;
    results: PostProp[];
    value: string;
}

const initialState: State = {
    loading: false,
    results: [],
    value: '',
}

const URL = process.env.REACT_APP_API_ENDPOINT;

function exampleReducer(state: State, action: any) {
    switch (action.type) {
        case 'CLEAN_QUERY':
            return initialState
        case 'START_SEARCH':
            return {...state, loading: true, value: action.query}
        case 'FINISH_SEARCH':
            return {...state, loading: false, results: action.results}
        case 'UPDATE_SELECTION':
            return {...state, value: action.selection}

        default:
            throw new Error()
    }
}


const SearchField: React.FC = () => {
    const [state, dispatch] = React.useReducer(exampleReducer, initialState)
    const {loading, results, value}: State = state
    const [posts, setPosts] = useState<PostProp[]>([]);
    const timeoutRef: any = React.useRef()

    const handleSearchChange = React.useCallback((e, data) => {
        clearTimeout(timeoutRef.current)
        dispatch({type: 'START_SEARCH', query: data.value})

        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                dispatch({type: 'CLEAN_QUERY'})
                return
            }

            const re = new RegExp(_.escapeRegExp(data.value), 'i')
            const isMatch = (result: PostProp) => re.test(result.content as string)

            dispatch({
                type: 'FINISH_SEARCH',
                results: _.filter(posts, isMatch),
            })
        }, 300)
    }, [posts])


    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    useEffect(() => {
        loadPosts()
    }, [])


    async function loadPosts() {
        await fetch(`${URL}/api/v1/posts`)
            .then(response => response.json())
            .then((res) => {
                    setPosts(res);
                },
                (error) => {
                    console.error(error)
                }
            )
    }

    const resultRenderer = ({summary}: any) => <p style={{fontSize: "small"}}> {summary} </p>


    return (

        <Search fluid
                loading={loading}
                onResultSelect={(e, data) => {
                    dispatch({type: 'UPDATE_SELECTION', selection: data.result.summary});
                    window.location.href = `/posts/${data.result.slug}`
                }
                }
                onSearchChange={handleSearchChange}
                results={results}
                resultRenderer={resultRenderer}
                value={value}

        />

    )
}

export default SearchField
