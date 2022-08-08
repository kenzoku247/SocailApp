import React from 'react'

const LoadMoreBtn = ({result, page, load, handleLoadMore}) => {
    return (
        <>
            {
                result < 8 * (page - 1) ? '' : 

                !load && <button className="button fc-button"
                onClick={handleLoadMore}>
                    Load more
                </button>
            }
            
        </>
    )
}

export default LoadMoreBtn
