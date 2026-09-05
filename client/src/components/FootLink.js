import {useState} from "react";

const FooterLink = () => {
    const footerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0 10px 0',
        background: 'transparent',
        flexShrink: 0,
        // position: 'fixed', // Add this line
        // bottom: 0,
        width: '100%' // Add this line
    };
    const [linkColorICP, setLinkColorICP] = useState('#133');
    const [linkColorPolice, setLinkColorPolice] = useState('#133');

    const hoverColor = '#007bff';
    const linkStyle = {
        textDecoration: 'none',
        fontSize: '16px',
        margin: '0 10px'
    };

    return (
        <div style={footerStyle}>
            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010602013040" target="_blank"
               style={{...linkStyle, color: linkColorPolice}} onMouseOver={() => {
                setLinkColorPolice(hoverColor)
            }} onMouseOut={() => setLinkColorPolice('#333')}>浙公网安备 33010602013040号</a>
            <a href="https://beian.miit.gov.cn/" target="_blank" style={{...linkStyle, color: linkColorICP}}
               onMouseOver={() => {
                   setLinkColorICP(hoverColor)
               }} onMouseOut={() => setLinkColorICP('#333')}>浙ICP备2023009285号</a>
        </div>)
}

export default FooterLink