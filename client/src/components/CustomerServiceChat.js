import React, {useEffect, useState, useRef} from 'react';
import {IconButton, Paper, TextField, Button, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import gptService from '../api/gpt'
import MDEditor from "@uiw/react-md-editor";
import Code from './Code'

const MOON_THEME = {
    primary: '#4C5871',      // 黛青
    ink: '#1C2333',          // 墨黛
    secondary: '#6E7B91',    // 银灰
    gold: '#B08D57',         // 香槟金
    divider: '#D7DDE7',
    userBubble: '#FFF6E8',   // 暖金雾
    aiBubble: '#EAF0F6',     // 雾白
    glass: 'rgba(255,255,255,.92)'
};

const WELCOME = 'Tilion 已就绪——可以问我任何事，或让我为你找一篇博客。';

const MoonCrescent = ({id, size = 20, color = MOON_THEME.gold}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <mask id={id}>
            <rect width="24" height="24" fill="white"/>
            <circle cx="17" cy="7" r="7.5" fill="black"/>
        </mask>
        <circle cx="11" cy="13" r="9" fill={color} mask={`url(#${id})`}/>
    </svg>
);

const roleLabel = role => (role === 'assistant' ? 'Tilion' : 'User');

const bubbleStyle = backgroundColor => ({
    border: `1px solid ${MOON_THEME.divider}`,
    borderRadius: '10px',
    padding: '8px',
    backgroundColor
});

const Markdown = ({source}) => (
    <MDEditor.Markdown
        className="markdown"
        source={source}
        components={{code: Code}}
        style={{whiteSpace: 'pre-wrap', backgroundColor: 'transparent'}}
    />
);

const CustomerServiceChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [waiting, setWaiting] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            gptService.setToken(user.token);
        }
    }, []);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    };

    const toggleChatBox = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = () => {
        setChatLog(prevChatLog => [...prevChatLog, {role: 'user', content: message}]);
        setMessage('');
        setWaiting(true);
    };

    useEffect(() => {
        const getAnswer = async () => {
            try {
                const reply = await gptService.getReply(chatLog);
                setChatLog(prevChatLog => [...prevChatLog, {role: 'assistant', content: reply}]);
            } catch (exception) {
                setChatLog(prevChatLog => [...prevChatLog, {
                    role: 'assistant',
                    content: 'Tilion 暂时无法回应，请稍后再试。'
                }]);
            } finally {
                setWaiting(false);
            }
        };
        if (chatLog.length > 0 && chatLog[chatLog.length - 1].role === 'user') {
            getAnswer();
        }
        scrollToBottom();
    }, [chatLog]);

    return (
            <div className="tilion-anchor">
            {isOpen && (
                <Paper elevation={8} style={{
                    width: '320px',
                    height: '520px',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: MOON_THEME.glass,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderRadius: '12px',
                    borderTop: `1px solid ${MOON_THEME.gold}`,
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px 10px 16px',
                        borderBottom: `1px solid ${MOON_THEME.divider}`
                    }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <MoonCrescent id="tilion-title-moon" size={18}/>
                            <Typography style={{
                                marginLeft: '8px',
                                fontWeight: 'bold',
                                color: MOON_THEME.ink,
                                fontFamily: "'Cinzel','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif"
                            }}>
                                Tilion · 驾月者
                            </Typography>
                        </div>
                        <IconButton onClick={toggleChatBox} size="small">
                            <CloseIcon/>
                        </IconButton>
                    </div>
                    <div style={{
                        overflowY: 'auto', flexGrow: 1, padding: '16px 16px 0px 16px',
                    }}>
                        <div style={{marginBottom: '16px'}}>
                            <Typography variant="subtitle1" style={{
                                fontWeight: 'bold',
                                color: MOON_THEME.secondary
                            }}>Tilion</Typography>
                            <div style={bubbleStyle(MOON_THEME.aiBubble)}>
                                <Markdown source={WELCOME}/>
                            </div>
                        </div>
                        {chatLog.map((entry, index) => (
                            <div key={index} style={{marginBottom: '16px'}}>
                                <Typography variant="subtitle1" style={{
                                    fontWeight: 'bold',
                                    color: MOON_THEME.secondary
                                }}>{roleLabel(entry.role)}</Typography>
                                <div style={bubbleStyle(entry.role === 'user' ? MOON_THEME.userBubble : MOON_THEME.aiBubble)}>
                                    <Markdown source={entry.content}/>
                                </div>
                            </div>
                        ))}
                        {waiting && (
                            <div style={{marginBottom: '16px'}}>
                                <Typography variant="subtitle1" style={{
                                    fontWeight: 'bold',
                                    color: MOON_THEME.secondary
                                }}>Tilion</Typography>
                                <div style={bubbleStyle(MOON_THEME.aiBubble)}>
                                    <div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef}/>
                    </div>
                    <div style={{padding: '16px'}}>
                        <TextField
                            fullWidth
                            multiline
                            variant="outlined"
                            inputProps={{
                                style: {height: "5vh"}
                            }}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="问 Tilion 吧…"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSendMessage}
                            style={{
                                marginTop: '8px',
                                backgroundColor: MOON_THEME.primary
                            }}>
                            Send
                        </Button>
                    </div>
                </Paper>
            )}
            {!isOpen && (
                <IconButton
                    onClick={toggleChatBox}
                    style={{
                        background: MOON_THEME.primary,
                        borderRadius: '20px',
                        padding: '10px 20px',
                        boxShadow: '0 8px 30px rgba(28,35,51,.08)'
                    }}
                >
                    <MoonCrescent id="tilion-fab-moon" size={20}/>
                    <Typography
                        variant="h6"
                        style={{
                            marginLeft: '8px',
                            color: 'white'
                        }}
                    >
                        Tilion
                    </Typography>
                </IconButton>
            )}
        </div>
    );
};

export default CustomerServiceChat;
