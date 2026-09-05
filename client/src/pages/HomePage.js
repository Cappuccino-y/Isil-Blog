import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Typography, Box} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const MOON_FONT = '"EB Garamond","Noto Serif SC","Source Han Serif SC","STZhongsong","SimSun",serif';
const UI_FONT = "'Roboto','Helvetica','Arial',sans-serif";

const MOON_PHASES = [
    '/moonphases/1-moon-new.svg',
    '/moonphases/2-moon-waxing-crescent-6.svg',
    '/moonphases/3-moon-first-quarter.svg',
    '/moonphases/4-moon-waxing-gibbous-6.svg',
    '/moonphases/5-moon-full.svg',
    '/moonphases/6-moon-waning-gibbous-6.svg',
    '/moonphases/7-moon-third-quarter.svg',
    '/moonphases/8-moon-waning-crescent-6.svg',
];

const MoonPhasesRow = ({height = 20, glass = false}) => (
    <Box className="moon-float-soft" sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: glass ? 216 : 200,
        ...(glass ? {
            px: 1.25,
            py: 0.75,
            borderRadius: '999px',
            background: 'rgba(255,255,255,.42)',
            border: '1px solid rgba(215,221,231,.9)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            boxShadow: '0 4px 16px rgba(28,35,51,.08)',
        } : {}),
    }} aria-hidden="true">
        {MOON_PHASES.map((src) => (
            <Box key={src} component="img" src={src} alt="" className="moon-phase"
                 sx={{height, width: 'auto', display: 'block'}}/>
        ))}
    </Box>
);

/* 滚动显现（无依赖 IntersectionObserver） */
const useReveal = () => {
    useEffect(() => {
        const els = document.querySelectorAll('.moon-reveal');
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('moon-revealed');
                    io.unobserve(e.target);
                }
            });
        }, {threshold: 0.18});
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);
};

const Eyebrow = ({children, color = '#8C6D3F', glass = false}) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        ...(glass ? {
            px: 2,
            py: .75,
            borderRadius: '999px',
            background: 'rgba(255,255,255,.42)',
            border: '1px solid rgba(215,221,231,.9)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            boxShadow: '0 4px 16px rgba(28,35,51,.08)',
        } : {}),
    }}>
        <Box aria-hidden="true" sx={{
            width: 36, height: 1,
            background: 'linear-gradient(90deg, rgba(176,141,87,0), rgba(176,141,87,.9))'
        }}/>
        <Typography sx={{
            fontFamily: UI_FONT,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '.32em',
            textTransform: 'uppercase',
            color: glass ? '#4C5871' : color,
            textShadow: glass ? 'none' : '0 1px 8px rgba(244,246,250,.9)',
            pl: '.32em',
            whiteSpace: 'nowrap',
        }}>
            {children}
        </Typography>
        <Box aria-hidden="true" sx={{
            width: 36, height: 1,
            background: 'linear-gradient(90deg, rgba(176,141,87,.9), rgba(176,141,87,0))'
        }}/>
    </Box>
);

const LANDMARKS = [
    {img: '1.jpg', en: 'Rivendell', zh: '「群山之间，精灵的最后居所」'},
    {img: '2.jpg', en: 'The Grey Havens', zh: '「雾起处，白帆驶向西方」'},
    {img: '3.jpg', en: 'Dol Amroth', zh: '「悬崖之下，银色的海城」'},
    {img: '4.jpg', en: 'The White City', zh: '「巨瀑之上，白塔长明」'},
];

const HomePage = ({user}) => {
    const navigate = useNavigate()
    useReveal()

    return <Box sx={{width: '100%'}}>

        {/* Hero：Rivendell 崖顶满幅 */}
        <Box sx={{
            position: 'relative',
            height: {md: 'calc(100vh - 64px)', xs: '92vh'},
            overflow: 'hidden',
            background: 'url(0.jpg) center / cover no-repeat',
        }}>
            <Box aria-hidden="true" sx={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(rgba(244,246,250,.34), rgba(244,246,250,.04) 42%, rgba(244,246,250,.42))',
            }}/>
            <Box sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: {xs: 1.5, md: 2},
                px: 2,
                textAlign: 'center',
            }}>
                <Eyebrow glass>Beneath the Sheen of Isil</Eyebrow>
                <Typography sx={{
                    color: '#1C2333',
                    fontFamily: MOON_FONT,
                    fontStyle: 'italic',
                    fontWeight: 600,
                    fontSize: 'clamp(1.7rem, 3.6vw, 2.6rem)',
                    lineHeight: 1.4,
                    letterSpacing: '0.02em',
                    textShadow: '0 1px 16px rgba(244,246,250,.9), 0 1px 2px rgba(255,255,255,.7)',
                    maxWidth: 780,
                }}>
                    Nai tiruvantel ar varyuvantel i Valar tielyanna nu vilya.
                </Typography>
                <Box sx={{
                    px: 2.5,
                    py: .75,
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,.46)',
                    border: '1px solid rgba(215,221,231,.9)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    boxShadow: '0 4px 16px rgba(28,35,51,.08)',
                }}>
                    <Typography sx={{
                        color: '#4C5871',
                        fontFamily: MOON_FONT,
                        fontStyle: 'italic',
                        fontSize: {xs: '1rem', md: '1.2rem'},
                        lineHeight: 1.6,
                        letterSpacing: '0.1em',
                        whiteSpace: 'nowrap',
                    }}>
                        Valin na omentiemme. Anar caluva tielyanna.
                    </Typography>
                </Box>
                <Box className="moon-stagger-item">
                    <MoonPhasesRow glass/>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    endIcon={<LoginIcon/>}
                    sx={{
                        mt: 1,
                        backgroundColor: 'rgba(28,35,51,.82)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        color: '#F4F6FA',
                        borderRadius: '999px',
                        px: 3.5,
                        py: 1.25,
                        letterSpacing: '0.1em',
                        boxShadow: '0 10px 30px rgba(28,35,51,.25)',
                        transition: 'background-color .3s ease, transform .3s ease, box-shadow .3s ease',
                        '&:hover': {
                            backgroundColor: '#4C5871',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 0 0 3px rgba(176,141,87,.25), 0 12px 32px rgba(28,35,51,.3)',
                        },
                    }}
                >
                    启程 · Enter
                </Button>
            </Box>
            {/* 滚动提示 */}
            <Box sx={{
                position: 'absolute',
                bottom: 22,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: .25,
                color: '#4C5871',
                opacity: .8,
            }}>
                <Typography sx={{fontFamily: UI_FONT, fontSize: 10, letterSpacing: '.3em', textTransform: 'uppercase'}}>
                    Scroll
                </Typography>
                <KeyboardArrowDownIcon className="moon-float-soft" sx={{fontSize: 22}}/>
            </Box>
        </Box>

        {/* 地标图片带：四站旅程 */}
        <Box sx={{py: {md: 8, xs: 5}, px: {xs: 2, md: 8}, mx: 'auto', maxWidth: 1440}}>
            <Box className="moon-reveal" sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                mb: 5,
                textAlign: 'center',
            }}>
                <Eyebrow color="#6E7B91">Four Wonders of Middle-earth</Eyebrow>
                <Typography sx={{
                    fontFamily: MOON_FONT,
                    fontWeight: 600,
                    fontSize: {md: '2rem', xs: '1.5rem'},
                    color: '#1C2333',
                    letterSpacing: '.04em',
                }}>
                    中土世界的四座传说之城
                </Typography>
            </Box>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)'},
                gap: {md: 2.5, xs: 2},
            }}>
                {LANDMARKS.map((l, i) => (
                    <Box key={l.img} className="moon-reveal" sx={{animationDelay: `${i * 90}ms`}}>
                        <Box sx={{
                            position: 'relative',
                            height: {md: 300, xs: 230},
                            borderRadius: '14px',
                            overflow: 'hidden',
                            border: '1px solid #D7DDE7',
                            boxShadow: '0 8px 30px rgba(28,35,51,.08)',
                            '&:hover .moon-wall-img': {transform: 'scale(1.06)'},
                        }}>
                            <Box className="moon-wall-img" sx={{
                                position: 'absolute',
                                inset: 0,
                                background: `url(${l.img}) center / cover no-repeat`,
                            }}/>
                            <Box aria-hidden="true" sx={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(rgba(28,35,51,0) 46%, rgba(28,35,51,.62))',
                            }}/>
                            <Box sx={{
                                position: 'absolute',
                                left: 0, right: 0, bottom: 0,
                                p: 2,
                            }}>
                                <Typography sx={{
                                    fontFamily: MOON_FONT,
                                    fontWeight: 600,
                                    fontSize: '1.08rem',
                                    color: '#F4F6FA',
                                    letterSpacing: '.08em',
                                }}>
                                    {l.en}
                                </Typography>
                                <Typography sx={{
                                    fontFamily: MOON_FONT,
                                    fontStyle: 'italic',
                                    fontSize: '.82rem',
                                    color: 'rgba(244,246,250,.82)',
                                    letterSpacing: '.06em',
                                }}>
                                    {l.zh}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>

        {/* 引言段 */}
        <Box sx={{
            py: {md: 7, xs: 5},
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2.5,
            textAlign: 'center',
        }}>
            <Box className="moon-reveal" sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2.5,
            }}>
                <MoonPhasesRow/>
                <Typography sx={{
                    fontFamily: MOON_FONT,
                    fontStyle: 'italic',
                    fontSize: {md: '1.5rem', xs: '1.15rem'},
                    color: '#4C5871',
                    letterSpacing: '.06em',
                    maxWidth: 720,
                    lineHeight: 1.7,
                }}>
                    「月光不问归人，只照见每一段未写完的旅途。」
                </Typography>
                <Box aria-hidden="true" sx={{
                    width: 88, height: 2, borderRadius: '2px',
                    background: 'linear-gradient(90deg, rgba(176,141,87,0), #B08D57, rgba(176,141,87,0))'
                }}/>
                <Typography sx={{
                    fontFamily: UI_FONT,
                    fontSize: 11.5,
                    fontWeight: 600,
                    letterSpacing: '.28em',
                    textTransform: 'uppercase',
                    color: '#6E7B91',
                }}>
                    Isil nar caluva tielyanna
                </Typography>
            </Box>
        </Box>

        {/* 尾段 CTA：行者望月 */}
        <Box className="moon-reveal" sx={{
            position: 'relative',
            height: {md: 400, xs: 320},
            overflow: 'hidden',
            background: 'url(bg1.jpg) center 30% / cover no-repeat',
            mb: 0,
        }}>
            <Box aria-hidden="true" sx={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, rgba(28,35,51,.55), rgba(28,35,51,.12) 55%, rgba(28,35,51,0))',
            }}/>
            <Box sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: {xs: 'center', md: 'flex-start'},
                justifyContent: 'center',
                px: {md: 8, xs: 3},
                gap: 2,
            }}>
                <Typography sx={{
                    fontFamily: MOON_FONT,
                    fontWeight: 600,
                    fontSize: {md: '1.9rem', xs: '1.4rem'},
                    color: '#F4F6FA',
                    letterSpacing: '.05em',
                    textShadow: '0 2px 18px rgba(28,35,51,.5)',
                }}>
                    月已升起，故事正等你落笔
                </Typography>
                <Typography sx={{
                    fontFamily: MOON_FONT,
                    fontStyle: 'italic',
                    fontSize: {md: '1.02rem', xs: '.9rem'},
                    color: 'rgba(244,246,250,.85)',
                    letterSpacing: '.08em',
                    textShadow: '0 1px 12px rgba(28,35,51,.5)',
                }}>
                    The moon is risen — your tale awaits beneath it.
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate(user ? '/blogs' : '/login')}
                    startIcon={<LoginIcon/>}
                    sx={{
                        mt: 1,
                        color: '#F4F6FA',
                        borderColor: 'rgba(244,246,250,.55)',
                        borderRadius: '999px',
                        px: 3.5,
                        py: 1,
                        letterSpacing: '0.08em',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        '&:hover': {
                            borderColor: '#B08D57',
                            color: '#F4F6FA',
                            background: 'rgba(176,141,87,.25)',
                            transform: 'translateY(-2px)',
                        },
                    }}
                >
                    进入期刊 · Open the Journal
                </Button>
            </Box>
        </Box>
    </Box>
}

export default HomePage
