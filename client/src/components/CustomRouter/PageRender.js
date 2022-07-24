import React from 'react'
import {useParams} from 'react-router-dom'
import NotFound from '../NotFound/NotFound'
import { useSelector } from 'react-redux'

const generatePage = (pageName) => {
    const component = () => require(`../../pages/${pageName}`).default

    try {
        return React.createElement(component())
    } catch (err) {
        return <NotFound />
    }
}

const PageRender = () => {
    const {page, id} = useParams()
    const { authData } = useSelector(state => state.auth)

    let pageName = "";

    if(authData.token){
        if(id){
            pageName = `${page}/[id]`
        }else{
            pageName = `${page}`
        }
    }

    return generatePage(pageName)
}

export default PageRender
