// src/components/ImageThumb.tsx
import React, { FC } from 'react'
import { createUseStyles } from 'react-jss'
import { IoCloseCircle } from 'react-icons/io5'

const useStyles = createUseStyles({
    thumbContainer: {
        position: 'relative',
        width: '120px',
        height: '120px',
        margin: '10px 0',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    thumb: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    deleteButton: {
        position: 'absolute',
        top: '4px',
        right: '4px',
        cursor: 'pointer',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '50%',
        padding: '2px',
        color: 'white',
        '&:hover': {
            background: 'rgba(0, 0, 0, 0.7)'
        }
    }
})

interface ImageThumbProps {
    imagePath: string
    onDelete: () => void
}

const ImageThumb: FC<ImageThumbProps> = ({ imagePath, onDelete }) => {
    const styles = useStyles()

    return (
        <div className={styles.thumbContainer}>
            <img src={imagePath} className={styles.thumb} alt="预览图" />
            <IoCloseCircle
                size={20}
                className={styles.deleteButton}
                onClick={onDelete}
            />
        </div>
    )
}

export default ImageThumb