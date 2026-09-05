import {Typography, Box} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SellIcon from '@mui/icons-material/Sell';
import {useContext} from "react";
import ExampleContext from "./ExampleContext";
import formatDate from "../utils/formatDate";

const MOON_FONT = "'Cinzel','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";
const BODY_FONT = "'EB Garamond','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";

/* 期刊列表行：紧凑 Notion 式，点击 → 右侧阅读面板（编辑/点赞在面板内） */
const Blog = ({blog}) => {
    const val = useContext(ExampleContext)
    const selected = val.blogId === blog.id

    return <Box
        onClick={() => val.setBlogId(selected ? '' : blog.id)}
        sx={{
            position: 'relative',
            px: 2,
            py: 1.25,
            borderRadius: '10px',
            cursor: 'pointer',
            border: selected ? '1px solid rgba(176,141,87,.55)' : '1px solid transparent',
            background: selected ? 'rgba(176,141,87,.07)' : 'transparent',
            transition: 'background-color .2s ease, border-color .2s ease',
            '&:hover': {
                background: 'rgba(76,88,113,.06)',
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 10,
                bottom: 10,
                width: 3,
                borderRadius: '3px',
                background: 'linear-gradient(180deg, #B08D57, rgba(176,141,87,.25))',
                opacity: selected ? 1 : 0,
                transition: 'opacity .2s ease',
            },
        }}>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5}}>
            <Typography sx={{
                fontFamily: MOON_FONT,
                fontWeight: 600,
                fontSize: '1.06rem',
                color: '#1C2333',
                letterSpacing: '.02em',
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0,
            }}>
                {blog.title}
            </Typography>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: .5,
                flexShrink: 0,
                color: '#8A6D42',
            }}>
                <ThumbUpIcon sx={{fontSize: 14}}/>
                <Typography sx={{fontFamily: 'Roboto', fontSize: '12.5px', color: '#8A6D42'}}>
                    {blog.likes === undefined ? 0 : blog.likes}
                </Typography>
            </Box>
        </Box>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: .4,
            flexWrap: 'wrap',
        }}>
            <Typography sx={{fontFamily: 'Roboto', fontSize: '11.5px', color: '#6E7B91', letterSpacing: '.02em'}}>
                {formatDate(blog.date)}
            </Typography>
            {blog.tag ? <Box sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: .4,
                px: 1,
                borderRadius: '999px',
                background: 'rgba(176,141,87,.12)',
                border: '1px solid rgba(176,141,87,.32)',
            }}>
                <SellIcon sx={{fontSize: 11, color: '#B08D57'}}/>
                <Typography sx={{fontFamily: 'Roboto', fontSize: '11px', color: '#8A6D42',
                                 maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {blog.tag}
                </Typography>
            </Box> : null}
            <Typography sx={{fontFamily: BODY_FONT, fontSize: '12.5px', color: '#4C5871', ml: 'auto'}}>
                {blog.user.name}
            </Typography>
        </Box>
    </Box>
}

export default Blog
