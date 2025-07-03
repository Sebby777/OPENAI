import { IconBaseProps } from 'react-icons'
import { createUseStyles } from 'react-jss'
import { useTheme } from '@/common/hooks/useTheme'
import { IThemedStyleProps } from '@/common/types'

// SVG 图标样式
const useStyles = createUseStyles({
    icon: ({ theme }: IThemedStyleProps) => ({
        '& path': {
            fill: 'currentColor',
        },
    }),
})

export function DifyIcon(props: IconBaseProps) {
    const { theme, themeType } = useTheme()
    const styles = useStyles({ theme, themeType })

    return (
        <svg
            className={styles.icon}
            width={props.size}
            height={props.size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
            <path d="M2 17L12 22L22 17" />
            <path d="M2 12L12 17L22 12" />
        </svg>
    )
}