import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Preview() {
    const navigate = useNavigate();

    const [isHoveredBack, setIsHoveredBack] = useState(false);
    const [isHoveredShare, setIsHoveredShare] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        avatarUrl: null
    });

    const [links, setLinks] = useState([]);

    const platformStyles = {
        "GitHub": { bg: "#1A1A1A", icon: "fa-brands fa-github", label: "GitHub" },
        "YouTube": { bg: "#EE3939", icon: "fa-brands fa-youtube", label: "YouTube" },
        "LinkedIn": { bg: "#2D68FF", icon: "fa-brands fa-linkedin", label: "LinkedIn" },
        "Facebook": { bg: "#1877F2", icon: "fa-brands fa-facebook", label: "Facebook" },
        "Frontend Mentor": {
            bg: "#FFFFFF",
            color: "#333333",
            border: "1px solid #D9D9D9",
            icon: "fa-solid fa-code",
            label: "Frontend Mentor"
        },
        "Twitter": { bg: "#43B7E9", icon: "fa-brands fa-twitter", label: "Twitter" },
        "Twitch": { bg: "#9146FF", icon: "fa-brands fa-twitch", label: "Twitch" },
        "Dev.to": { bg: "#333333", icon: "fa-brands fa-dev", label: "Dev.to" },
        "Codewars": { bg: "#8A1A50", icon: "fa-solid fa-fire-flame-curved", label: "Codewars" },
        "Codepen": { bg: "#000000", icon: "fa-brands fa-codepen", label: "Codepen" },
        "freeCodeCamp": { bg: "#302040", icon: "fa-brands fa-freecodecamp", label: "freeCodeCamp" },
        "GitLab": { bg: "#E24329", icon: "fa-brands fa-gitlab", label: "GitLab" },
        "Hashnode": { bg: "#2962FF", icon: "fa-brands fa-hashnode", label: "Hashnode" },
        "Stack Overflow": { bg: "#F48024", icon: "fa-brands fa-stack-overflow", label: "Stack Overflow" }
    };

    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem("devprofile");
            const savedLinks = localStorage.getItem("devlinks");

            if (savedProfile) setProfile(JSON.parse(savedProfile));
            if (savedLinks) {
                const parsedLinks = JSON.parse(savedLinks);
                console.log("Links loaded in Preview:", parsedLinks); 
                setLinks(parsedLinks);
            }
        } catch (err) {
            console.error("Failed to load preview data:", err);
        }
    }, []);

    const handleShareLink = () => {
        navigator.clipboard.writeText(window.location.origin + "/preview");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div style={styles.page}>
            <div style={styles.bg} />

            <div style={styles.container}>

                <div style={styles.header}>
                    <button
                        onClick={() => navigate("/dashboard")}
                        onMouseEnter={() => setIsHoveredBack(true)}
                        onMouseLeave={() => setIsHoveredBack(false)}
                        style={{
                            ...styles.backBtn,
                            backgroundColor: isHoveredBack ? "#EFEBFF" : "transparent",
                        }}
                    >
                        Back to Editor
                    </button>

                    <button
                        onClick={handleShareLink}
                        onMouseEnter={() => setIsHoveredShare(true)}
                        onMouseLeave={() => setIsHoveredShare(false)}
                        style={{
                            ...styles.shareBtn,
                            backgroundColor: isHoveredShare ? "#BEB0FF" : "#633CFF",
                        }}
                    >
                        Share Link
                    </button>
                </div>

                <div style={styles.card}>

                    <div style={styles.avatar(profile.avatarUrl)} />

                    <div style={styles.nameBox}>
                        {profile.firstName || profile.lastName ? (
                            <h2 style={styles.name}>
                                {profile.firstName} {profile.lastName}
                            </h2>
                        ) : (
                            <div style={styles.nameSkeleton} />
                        )}

                        {profile.email ? (
                            <p style={styles.email}>{profile.email}</p>
                        ) : (
                            <div style={styles.emailSkeleton} />
                        )}
                    </div>

                    <div style={styles.links}>
                        {links && links.length > 0 ? (
                            links.map((link, index) => {
                              
                                const platformKey = link.title || link.platform;
                                
                                const config = platformStyles[platformKey] || {
                                    bg: "#333",
                                    icon: "fa-solid fa-link",
                                    label: platformKey || `Link #${index + 1}`,
                                    color: "#fff"
                                };

                                return (
                                    <a
                                        key={index}
                                        href={link.url || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            ...styles.link,
                                            backgroundColor: config.bg,
                                            color: config.color || "#fff",
                                            border: config.border || "none"
                                        }}
                                    >
                                        <div style={styles.linkLeft}>
                                            <i className={config.icon} />
                                            <span>{config.label}</span>
                                        </div>
                                        <i className="fa-solid fa-arrow-right" />
                                    </a>
                                );
                            })
                        ) : (
                            [1, 2, 3].map((n) => (
                                <div key={n} style={styles.skeleton} />
                            ))
                        )}
                    </div>

                </div>
            </div>

            {showToast && (
                <div style={styles.toast}>
                    <i className="fa-solid fa-link" />
                    Link copied to clipboard!
                </div>
            )}
        </div>
    );
}


const styles = {
    page: {
        fontFamily: "'Instrument Sans', sans-serif",
        backgroundColor: "#FAFAFA",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
    },

    bg: {
        backgroundColor: "#633CFF",
        height: "320px",
        width: "100%",
        borderBottomLeftRadius: "32px",
        borderBottomRightRadius: "32px",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1
    },

    container: {
        position: "relative",
        zIndex: 2,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    header: {
        width: "100%",
        maxWidth: "900px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "40px"
    },

    backBtn: {
        padding: "10px 18px",
        borderRadius: "8px",
        border: "1px solid #633CFF",
        color: "#633CFF",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: "14px"
    },

    shareBtn: {
        padding: "10px 18px",
        borderRadius: "8px",
        border: "none",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: "14px"
    },

    card: {
        width: "100%",
        maxWidth: "350px",
        backgroundColor: "#fff",
        borderRadius: "24px",
        padding: "40px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 0 32px rgba(0,0,0,0.05)",
    },

    avatar: (img) => ({
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        border: "4px solid #633CFF",
        backgroundColor: "#eee",
        backgroundImage: img ? `url(${img})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        marginBottom: "20px"
    }),

    nameBox: { textAlign: "center" },

    name: { fontSize: "24px", fontWeight: 700 },

    email: { fontSize: "14px", color: "#737373" },

    nameSkeleton: {
        width: "140px",
        height: "14px",
        background: "#eee",
        margin: "0 auto 10px auto",
        borderRadius: "8px"
    },

    emailSkeleton: {
        width: "90px",
        height: "10px",
        background: "#eee",
        margin: "0 auto",
        borderRadius: "8px"
    },

    links: {
        width: "100%",
        marginTop: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    },

    link: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "50px",
        padding: "0 14px",
        borderRadius: "8px",
        fontWeight: 600,
        textDecoration: "none",
        fontSize: "14px"
    },

    linkLeft: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },

    skeleton: {
        height: "50px",
        backgroundColor: "#eee",
        borderRadius: "8px"
    },

    toast: {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#333",
        color: "#fff",
        padding: "12px 18px",
        borderRadius: "10px",
        fontSize: "14px",
        display: "flex",
        gap: "10px",
        alignItems: "center"
    }
};